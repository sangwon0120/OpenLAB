#!/usr/bin/env python3
"""
AI 기반 이력서 스크리닝 시스템
작업 공고와 사전 설정된 기준을 바탕으로 이력서를 자동으로 평가합니다.
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass
import asyncio
import aiofiles
import PyPDF2
import docx
from openai import AsyncOpenAI
import pandas as pd

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

@dataclass
class ScreeningCriteria:
    """스크리닝 기준 데이터 클래스"""
    min_experience_years: int
    required_skills: List[str]
    preferred_skills: List[str]
    required_education: str
    minimum_score: int = 7  # 10점 만점 기준
    
@dataclass
class JobDescription:
    """채용 공고 정보"""
    title: str
    department: str
    level: str
    requirements: List[str]
    responsibilities: List[str]
    location: str
    employment_type: str

@dataclass
class ResumeScreeningResult:
    """스크리닝 결과"""
    resume_id: str
    applicant_name: str
    overall_score: float
    recommendation: str  # "PASS", "REVIEW", "REJECT"
    skill_match_score: float
    experience_match_score: float
    education_match_score: float
    detailed_feedback: List[str]
    matched_keywords: List[str]
    missing_keywords: List[str]
    screening_date: datetime
    criteria_used: Dict[str, any]

class ResumeProcessor:
    """이력서 파일 처리 클래스"""
    
    def __init__(self):
        self.supported_formats = ['.pdf', '.docx', '.txt', '.doc']
    
    async def extract_text_from_pdf(self, file_path: str) -> str:
        """PDF에서 텍스트 추출"""
        try:
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    text += page.extract_text()
            return text
        except Exception as e:
            logger.error(f"PDF 텍스트 추출 실패 {file_path}: {str(e)}")
            return ""
    
    async def extract_text_from_docx(self, file_path: str) -> str:
        """DOCX에서 텍스트 추출"""
        try:
            doc = docx.Document(file_path)
            return "\n".join([paragraph.text for paragraph in doc.paragraphs])
        except Exception as e:
            logger.error(f"DOCX 텍스트 추출 실패 {file_path}: {str(e)}")
            return ""
    
    async def extract_text_from_txt(self, file_path: str) -> str:
        """텍스트 파일에서 내용 읽기"""
        try:
            async with aiofiles.open(file_path, mode='r', encoding='utf-8') as file:
                return await file.read()
        except Exception as e:
            logger.error(f"텍스트 파일 읽기 실패 {file_path}: {str(e)}")
            return ""
    
    async def process_resume(self, file_path: str) -> str:
        """이력서 파일 처리 및 텍스트 추출"""
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension not in self.supported_formats:
            raise ValueError(f"지원하지 않는 파일 형식: {file_extension}")
        
        logger.info(f"이력서 처리 시작: {file_path}")
        
        if file_extension == '.pdf':
            return await self.extract_text_from_pdf(file_path)
        elif file_extension == '.docx':
            return await self.extract_text_from_docx(file_path)
        elif file_extension == '.txt':
            return await self.extract_text_from_txt(file_path)
        else:
            return ""

class AIResumeScorer:
    """AI 기반 이력서 평가 클래스"""
    
    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(api_key=api_key)
        self.model = "gpt-3.5-turbo"
    
    def create_evaluation_prompt(self, resume_text: str, job_description: JobDescription, 
                                criteria: ScreeningCriteria) -> str:
        """AI 평가를 위한 프롬프트 생성"""
        
        prompt = f"""
        당신은 HR 전문가로서 이력서를 평가하는 AI 에이전트입니다. 아래의 채용 정보와 기준을 바탕으로 이력서를 종합적으로 평가해주세요.

        ### 채용 공고 정보:
        - 직무: {job_description.title}
        - 부서: {job_description.department}
        - 레벨: {job_description.level}
        - 위치: {job_description.location}
        - 고용 형태: {job_description.employment_type}
        
        ### 주요 요구사항:
        {chr(10).join([f"- {req}" for req in job_description.requirements])}
        
        ### 책임 사항:
        {chr(10).join([f"- {resp}" for resp in job_description.responsibilities])}
        
        ### 스크리닝 기준:
        - 최소 경력: {criteria.min_experience_years}년
        - 필수 기술: {', '.join(criteria.required_skills)}
        - 우대 기술: {', '.join(criteria.preferred_skills)}
        - 필수 학력: {criteria.required_education}
        - 합격 최소 점수: {criteria.minimum_score}/10
        
        ### 이력서 내용:
        ```
        {resume_text[:4000]}  # 처음 4000자만 분석 (토큰 제한)
        ```

        ### 평가 요청사항:
        1. 전체적인 적합도 점수를 10점 만점으로 매겨주세요.
        2. 기술 스택 일치도를 10점 만점으로 평가해주세요.
        3. 경력 적합도를 10점 만점으로 평가해주세요.
        4. 학력 요구사항 충족 여부를 10점 만점으로 평가해주세요.
        5. 다음의 추천 등급 중 하나를 선택해주세요: "PASS" (합격), "REVIEW" (추가 검토 필요), "REJECT" (불합격)
        6. 발견된 핵심 키워드 목록을 제공해주세요.
        7. 누락된 중요 키워드 목록을 제공해주세요.
        8. 구체적인 피드백을 3-5개 항목으로 제공해주세요.

        ### 응답 형식 (JSON):
        {{
            "overall_score": 7.5,
            "skill_match_score": 8.0,
            "experience_match_score": 7.0,
            "education_match_score": 9.0,
            "recommendation": "PASS",
            "matched_keywords": ["Python", "Django", "React", "AWS"],
            "missing_keywords": ["Kubernetes", "Docker"],
            "feedback": [
                "필수 기술 스택이 잘 갖춰져 있음",
                "경력이 요구사항에 부합함",
                "우대 기술 일부 부족",
                "전반적으로 우수한 지원자"
            ]
        }}
        """
        
        return prompt
    
    async def evaluate_resume(self, resume_text: str, job_description: JobDescription, 
                             criteria: ScreeningCriteria) -> Dict:
        """이력서 AI 평가 수행"""
        try:
            prompt = self.create_evaluation_prompt(resume_text, job_description, criteria)
            
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "당신은 전문적인 HR 전문가입니다."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=1000
            )
            
            result = response.choices[0].message.content
            
            # JSON 파싱
            import json
            try:
                # JSON 형식이 아닐 수 있으므로 파싱 시도
                parsed_result = json.loads(result.strip())
                return parsed_result
            except json.JSONDecodeError:
                # JSON 파싱 실패 시 기본 구조 반환
                logger.warning("AI 응답을 JSON으로 파싱 실패, 기본값 반환")
                return {
                    "overall_score": 5.0,
                    "skill_match_score": 5.0,
                    "experience_match_score": 5.0,
                    "education_match_score": 5.0,
                    "recommendation": "REVIEW",
                    "matched_keywords": [],
                    "missing_keywords": [],
                    "feedback": ["AI 평가 실패 - 수동 검토 필요"]
                }
                
        except Exception as e:
            logger.error(f"AI 평가 중 오류 발생: {str(e)}")
            raise e

class ResumeScreeningOrchestrator:
    """이력서 스크리닝 오케스트레이터"""
    
    def __init__(self, openai_api_key: str):
        self.processor = ResumeProcessor()
        self.scorer = AIResumeScorer(openai_api_key)
        self.results_history = []
    
    async def screen_single_resume(self, resume_path: str, job_description: JobDescription, 
                                  criteria: ScreeningCriteria) -> ResumeScreeningResult:
        """단일 이력서 스크리닝"""
        try:
            logger.info(f"이력서 스크리닝 시작: {resume_path}")
            
            # 1. 이력서 텍스트 추출
            resume_text = await self.processor.process_resume(resume_path)
            
            if not resume_text:
                raise ValueError(f"이력서 텍스트 추출 실패: {resume_path}")
            
            # 2. AI 평가 수행
            ai_result = await self.scorer.evaluate_resume(resume_text, job_description, criteria)
            
            # 3. 결과 생성
            applicant_name = os.path.splitext(os.path.basename(resume_path))[0]
            result = ResumeScreeningResult(
                resume_id=os.path.basename(resume_path),
                applicant_name=applicant_name,
                overall_score=float(ai_result.get('overall_score', 0)),
                recommendation=ai_result.get('recommendation', 'REVIEW'),
                skill_match_score=float(ai_result.get('skill_match_score', 0)),
                experience_match_score=float(ai_result.get('experience_match_score', 0)),
                education_match_score=float(ai_result.get('education_match_score', 0)),
                detailed_feedback=ai_result.get('feedback', []),
                matched_keywords=ai_result.get('matched_keywords', []),
                missing_keywords=ai_result.get('missing_keywords', []),
                screening_date=datetime.now(),
                criteria_used=criteria.__dict__
            )
            
            logger.info(f"이력서 스크리닝 완료: {resume_path} - 점수: {result.overall_score}")
            return result
            
        except Exception as e:
            logger.error(f"이력서 스크리닝 실패 {resume_path}: {str(e)}")
            raise e
    
    async def screen_multiple_resumes(self, resume_directory: str, job_description: JobDescription,
                                       criteria: ScreeningCriteria) -> List[ResumeScreeningResult]:
        """여러 이력서 일괄 스크리닝"""
        try:
            logger.info(f"여러 이력서 스크리닝 시작: {resume_directory}")
            
            # 지원되는 파일 형식만 필터링
            resume_files = []
            for file in os.listdir(resume_directory):
                if any(file.lower().endswith(ext) for ext in self.processor.supported_formats):
                    resume_files.append(os.path.join(resume_directory, file))
            
            logger.info(f"총 {len(resume_files)}개의 이력서 발견")
            
            # 병렬로 스크리닝 수행
            tasks = []
            for resume_path in resume_files:
                task = self.screen_single_resume(resume_path, job_description, criteria)
                tasks.append(task)
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # 성공한 결과만 필터링
            successful_results = []
            for i, result in enumerate(results):
                if isinstance(result, ResumeScreeningResult):
                    successful_results.append(result)
                else:
                    logger.error(f"이력서 스크리닝 실패: {resume_files[i]} - {str(result)}")
            
            self.results_history.extend(successful_results)
            logger.info(f"스크리닝 완료: {len(successful_results)}개 성공, {len(results) - len(successful_results)}개 실패")
            
            return successful_results
            
        except Exception as e:
            logger.error(f"여러 이력서 스크리닝 실패: {str(e)}")
            raise e
    
    def export_results_to_excel(self, results: List[ResumeScreeningResult], output_path: str):
        """결과를 Excel 파일로 내보내기"""
        try:
            data = []
            for result in results:
                data.append({
                    '지원자명': result.applicant_name,
                    '전체점수': result.overall_score,
                    '기술점수': result.skill_match_score,
                    '경력점수': result.experience_match_score,
                    '학력점수': result.education_match_score,
                    '추천결과': result.recommendation,
                    '매칭키워드': ', '.join(result.matched_keywords),
                    '누락키워드': ', '.join(result.missing_keywords),
                    '평가일시': result.screening_date.strftime('%Y-%m-%d %H:%M:%S'),
                    '피드백': '; '.join(result.detailed_feedback)
                })
            
            # PASS, REVIEW, REJECT 순서로 정렬
            def sort_key(x):
                order = {'PASS': 1, 'REVIEW': 2, 'REJECT': 3}
                return order.get(x['추천결과'], 4)
            
            data.sort(key=sort_key)
            
            df = pd.DataFrame(data)
            df.to_excel(output_path, index=False, sheet_name='스크리닝결과')
            
            logger.info(f"결과 Excel 파일로 내보내기 완료: {output_path}")
            
        except Exception as e:
            logger.error(f"Excel 내보내기 실패: {str(e)}")
            raise e

# 설정 파일 로더
class ScreeningConfig:
    """스크리닝 설정 관리"""
    
    @staticmethod
    def load_criteria_from_json(json_path: str) -> ScreeningCriteria:
        """JSON 파일에서 스크리닝 기준 로드"""
        try:
            with open(json_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
            
            return ScreeningCriteria(
                min_experience_years=data.get('min_experience_years', 0),
                required_skills=data.get('required_skills', []),
                preferred_skills=data.get('preferred_skills', []),
                required_education=data.get('required_education', ''),
                minimum_score=data.get('minimum_score', 7)
            )
        except Exception as e:
            logger.error(f"스크리닝 기준 로드 실패: {str(e)}")
            raise e
    
    @staticmethod
    def load_job_description_from_json(json_path: str) -> JobDescription:
        """JSON 파일에서 채용 공고 정보 로드"""
        try:
            with open(json_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
            
            return JobDescription(
                title=data.get('title', ''),
                department=data.get('department', ''),
                level=data.get('level', ''),
                requirements=data.get('requirements', []),
                responsibilities=data.get('responsibilities', []),
                location=data.get('location', ''),
                employment_type=data.get('employment_type', '')
            )
        except Exception as e:
            logger.error(f"채용 공고 로드 실패: {str(e)}")
            raise e

async def main():
    """메인 실행 함수"""
    try:
        # 설정
        openai_api_key = os.getenv('OPENAI_API_KEY', 'your-openai-api-key')
        
        if openai_api_key == 'your-openai-api-key':
            logger.error("OpenAI API 키가 설정되지 않았습니다. 환경변수 OPENAI_API_KEY를 설정해주세요.")
            return
        
        # 오케스트레이터 초기화
        orchestrator = ResumeScreeningOrchestrator(openai_api_key)
        
        # 설정 파일 로드 (예시)
        try:
            criteria = ScreeningConfig.load_criteria_from_json('config/criteria.json')
            job_desc = ScreeningConfig.load_job_description_from_json('config/job_description.json')
        except FileNotFoundError:
            # 기본값 사용
            logger.warning("설정 파일을 찾을 수 없어 기본값을 사용합니다.")
            criteria = ScreeningCriteria(
                min_experience_years=3,
                required_skills=['Python', 'JavaScript', 'React'],
                preferred_skills=['Node.js', 'AWS', 'Docker'],
                required_education='학사',
                minimum_score=7
            )
            job_desc = JobDescription(
                title='소프트웨어 엔지니어',
                department='개발팀',
                level='중급',
                requirements=['3년 이상 개발 경험', 'Python 능숙', 'React 경험'],
                responsibilities=['웹 애플리케이션 개발', '코드 리뷰', '기술 문서 작성'],
                location='서울',
                employment_type='정규직'
            )
        
        # 스크리닝 실행
        resume_dir = 'resumes'  # 이력서가 있는 디렉토리
        results = await orchestrator.screen_multiple_resumes(resume_dir, job_desc, criteria)
        
        # 결과 출력
        print(f"\n=== 이력서 스크리닝 결과 ===")
        print(f"총 {len(results)}개 이력서 평가 완료\n")
        
        for result in results:
            status_icon = "✅" if result.recommendation == "PASS" else "⚠️" if result.recommendation == "REVIEW" else "❌"
            print(f"{status_icon} {result.applicant_name}: {result.overall_score}/10 - {result.recommendation}")
        
        # 엑셀 파일로 내보내기
        if results:
            orchestrator.export_results_to_excel(results, 'screening_results.xlsx')
            print(f"\n📊 결과가 'screening_results.xlsx' 파일로 저장되었습니다.")
        
    except Exception as e:
        logger.error(f"메인 실행 중 오류 발생: {str(e)}")
        print(f"오류 발생: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())