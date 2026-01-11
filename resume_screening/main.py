#!/usr/bin/env python3
"""
Ollama 기반 이력서 스크리닝 시스템
로컬 Ollama 인스턴스를 사용하여 이력서를 평가합니다.
"""

import os
import json
import logging
from typing import Dict, List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import requests
import PyPDF2
from io import BytesIO

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('resume_screening.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# FastAPI 앱 초기화
app = FastAPI(title="Resume Screening Service")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    # Vite(5173)에서 직접 호출(fetch)하기 위한 로컬 허용 목록
    # 쿠키/세션을 쓰지 않으므로 credentials는 끕니다.
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ollama 설정
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")

logger.info(f"Ollama Base URL: {OLLAMA_BASE_URL}")
logger.info(f"Ollama Model: {OLLAMA_MODEL}")


def extract_text_from_pdf(file_content: bytes) -> str:
    """PDF 파일에서 텍스트 추출"""
    try:
        pdf_reader = PyPDF2.PdfReader(BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        logger.error(f"PDF 텍스트 추출 실패: {str(e)}")
        return ""


def call_ollama(prompt: str, model: str = OLLAMA_MODEL, temperature: float = 0.3) -> Optional[str]:
    """Ollama API 호출"""
    try:
        url = f"{OLLAMA_BASE_URL}/api/generate"
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "temperature": temperature,
        }
        
        response = requests.post(url, json=payload, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "")
        else:
            logger.error(f"Ollama 호출 실패: {response.status_code} - {response.text}")
            return None
            
    except requests.exceptions.ConnectionError:
        logger.error(f"Ollama 서버 연결 실패: {OLLAMA_BASE_URL}")
        return None
    except Exception as e:
        logger.error(f"Ollama 호출 중 오류: {str(e)}")
        return None


def parse_llm_response(response_text: str) -> Dict:
    """LLM 응답을 JSON으로 파싱"""
    try:
        # 응답에서 JSON 부분 추출
        start_idx = response_text.find("{")
        end_idx = response_text.rfind("}") + 1
        
        if start_idx != -1 and end_idx > start_idx:
            json_str = response_text[start_idx:end_idx]
            return json.loads(json_str)
        else:
            logger.warning("응답에서 JSON을 찾을 수 없습니다")
            return {}
            
    except json.JSONDecodeError as e:
        logger.error(f"JSON 파싱 실패: {str(e)}")
        return {}


def screen_resume_with_ollama(
    resume_text: str,
    job_description: str,
    criteria: str
) -> Dict:
    """Ollama를 사용한 이력서 평가"""
    
    if not resume_text:
        return {
            "success": False,
            "error": "이력서 텍스트가 없습니다",
            "overall_decision": False,
            "overall_reasoning": "이력서를 제공해 주세요",
            "criteria_decisions": []
        }
    
    # 프롬프트 구성
    prompt = f"""다음 이력서를 채용 공고와 선별 기준에 따라 평가하고 JSON 형식으로 응답해주세요.

**채용 공고:**
{job_description}

**선별 기준:**
{criteria}

**이력서:**
{resume_text}

다음 JSON 형식으로만 응답해주세요:
{{
  "criteria_decisions": [
    {{"criteria": "기준내용", "decision": true/false, "reasoning": "설명"}}
  ],
  "overall_decision": true/false,
  "overall_reasoning": "종합 평가"
}}

각 기준에 대해 true/false 결정과 1-2줄의 설명을 포함해주세요."""

    # Ollama 호출
    response = call_ollama(prompt, OLLAMA_MODEL)
    
    if not response:
        return {
            "success": False,
            "error": "Ollama 서버와의 통신 실패",
            "overall_decision": False,
            "overall_reasoning": "서버 오류로 평가할 수 없습니다",
            "criteria_decisions": []
        }
    
    # 응답 파싱
    parsed = parse_llm_response(response)
    
    if parsed:
        parsed["success"] = True
        return parsed
    else:
        # 파싱 실패시 폴백: 간단한 텍스트 기반 평가
        logger.warning("LLM 응답 파싱 실패, 간단한 평가로 진행")
        
        criteria_list = [c.strip() for c in criteria.split("\n") if c.strip() and not c.startswith("-")]
        resume_lower = resume_text.lower()
        
        criteria_decisions = []
        for criterion in criteria_list:
            matched = all(word.lower() in resume_lower for word in criterion.split() if len(word) > 2)
            criteria_decisions.append({
                "criteria": criterion,
                "decision": matched,
                "reasoning": f"{'이력서에서 확인됨' if matched else '이력서에서 찾지 못함'}"
            })
        
        passed = sum(1 for d in criteria_decisions if d["decision"])
        overall_decision = passed > len(criteria_decisions) / 2 if criteria_decisions else False
        
        return {
            "success": True,
            "criteria_decisions": criteria_decisions,
            "overall_decision": overall_decision,
            "overall_reasoning": f"{passed}개 중 {len(criteria_decisions)}개 기준 충족"
        }


@app.get("/health")
def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "ok", "model": OLLAMA_MODEL}


@app.post("/analyze-resume")
async def analyze_resume(
    resume: Optional[UploadFile] = File(None),
    resume_text: str = Form(""),
    job_description: str = Form(""),
    criteria: str = Form("")
) -> JSONResponse:
    """
    이력서 분석 엔드포인트
    
    Parameters:
    - resume: PDF 파일 (선택)
    - resume_text: 직접 입력한 이력서 텍스트 (선택)
    - job_description: 채용 공고
    - criteria: 선별 기준 (라인 구분)
    """
    
    try:
        logger.info(f"analyze-resume 호출 - resume: {resume is not None}, resume_text len: {len(resume_text)}, job_description len: {len(job_description)}, criteria len: {len(criteria)}")
        
        # 이력서 텍스트 추출
        extracted_text = ""
        
        if resume:
            # PDF 파일에서 텍스트 추출
            file_content = await resume.read()
            extracted_text = extract_text_from_pdf(file_content)
            logger.info(f"PDF 파일에서 {len(extracted_text)} 글자 추출")
        
        if resume_text:
            # 직접 입력한 텍스트
            extracted_text = resume_text if not extracted_text else extracted_text + "\n" + resume_text
        
        if not extracted_text:
            logger.warning("이력서 텍스트 없음")
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "error": "이력서 텍스트를 제공해주세요"
                }
            )
        
        if not job_description or not criteria:
            logger.warning("job_description 또는 criteria 없음")
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "error": "채용 공고와 선별 기준을 모두 입력해주세요"
                }
            )
        
        # Ollama를 사용한 평가
        logger.info("이력서 평가 시작")
        result = screen_resume_with_ollama(
            extracted_text,
            job_description,
            criteria
        )
        
        logger.info(f"평가 결과: {json.dumps(result, ensure_ascii=False)}")
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"분석 중 오류 발생: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e)
            }
        )


@app.post("/screen")
async def screen_endpoint(
    job_description: str = Form(""),
    criteria: str = Form(""),
    resume_text: str = Form(""),
    resume: Optional[UploadFile] = File(None)
) -> JSONResponse:
    """
    프로덕션 호환 스크리닝 엔드포인트 (Node.js API와 호환)
    """
    return await analyze_resume(resume, resume_text, job_description, criteria)


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
