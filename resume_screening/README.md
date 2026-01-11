# AI 기반 이력서 스크리닝 시스템

## 개요

AI 에이전트가 사전 설정된 채용 기준과 직무별 요구사항에 따라 이력서를 자동으로 평가하고 1차 스크리닝을 수행하는 시스템입니다.

## 주요 기능

### 🎯 자동 평가
- AI가 이력서를 분석하여 직무 적합도 평가
- 10점 만점 기종합 점수 산정
- PASS/REVIEW/REJECT 추천 등급 제공

### 📊 다차원 평가 체계
- 기술 스택 일치도 평가 (40%)
- 경력 적합도 평가 (30%)
- 학력 요구사항 충족도 (20%)
- 소프트 스킬 평가 (10%)

### 🔍 키워드 분석
- 매칭된 핵심 키워드 추적
- 누락된 필수 기술 식별
- 자격조건 충족 여부 확인

### 📋 상세 피드백
- 구체적인 강점/약점 분석
- 개선이 필요한 영역 식별
- 상세한 평가 의견 제공

## 설치 및 설정

### 1. 의존성 설치

```bash
# 방법 1: conda 사용
conda env create -f environment.yml
conda activate resume-screening

# 방법 2: pip 사용
pip install -r requirements.txt
```

### 2. API 키 설정

```bash
# Linux/Mac
export OPENAI_API_KEY='your-openai-api-key'

# Windows
setx OPENAI_API_KEY="your-openai-api-key"

# 또는 .env 파일 생성
echo "OPENAI_API_KEY=your-openai-api-key" > .env
```

### 3. 설정 파일 구성

`config/` 디렉토리의 JSON 파일들을 수정하여 평가 기준을 설정합니다.

## 사용 방법

### 1. 이력서 준비
`resumes/` 디렉토리에 평가할 이력서 파일들을 업로드합니다.

지원 형식:
- PDF (.pdf)
- Word 문서 (.docx, .doc)
- 텍스트 파일 (.txt)

### 2. 평가 기준 설정

#### 스크리닝 기준 (`config/criteria.json`)
```json
{
    "min_experience_years": 3,
    "required_skills": ["Python", "JavaScript", "React"],
    "preferred_skills": ["TypeScript", "AWS", "Docker"],
    "required_education": "학사 이상",
    "minimum_score": 7
}
```

#### 채용 공고 정보 (`config/job_description.json`)
```json
{
    "title": "소프트웨어 엔지니어",
    "requirements": ["3년 이상 개발 경험", "Python 능숙"],
    "responsibilities": ["웹 애플리케이션 개발", "코드 리뷰"]
}
```

### 3. 프로그램 실행

```bash
python main.py
```

### 4. 결과 확인

실행 완료 후 생성되는 파일들:
- `screening_results.xlsx`: 상세 평가 결과
- `resume_screening.log`: 실행 로그

## 출력 결과

### 콘솔 출력
```
=== 이력서 스크리닝 결과 ===
총 5개 이력서 평가 완료

✅ 홍길동: 8.5/10 - PASS
⚠️ 김철수: 6.8/10 - REVIEW
❌ 이미영: 4.2/10 - REJECT
...
📊 결과가 'screening_results.xlsx' 파일로 저장되었습니다.
```

### 엑셀 결과 파일
| 지원자명 | 전체점수 | 기술점수 | 추천결과 | 매칭키워드 | 누락키워드 |
|----------|----------|----------|----------|------------|------------|
| 홍길동   | 8.5      | 9.0      | PASS     | Python, React | Kubernetes |
| 김철수   | 6.8      | 7.2      | REVIEW   | JavaScript | Docker, AWS |

## 고급 설정

### 평가 가중치 조정
`config/settings.json` 파일에서 평가 카테고리별 가중치를 조정할 수 있습니다:

```json
{
    "scoring_system": {
        "categories": {
            "technical_skills": 0.4,
            "experience": 0.3,
            "education": 0.2,
            "soft_skills": 0.1
        }
    }
}
```

### AI 모델 설정
기본적으로 GPT-3.5-turbo를 사용하며, 필요에 따라 다른 모델로 변경 가능:

```json
{
    "ai_model": "gpt-4",
    "evaluation_timeout": 60,
    "max_tokens": 2000
}
```

## 문제 해결

### 자주 발생하는 오류

#### 1. API 키 오류
```
OpenAI API 키가 설정되지 않았습니다.
```
해결: `OPENAI_API_KEY` 환경변수를 올바르게 설정했는지 확인

#### 2. 파일 형식 오류
```
지원하지 않는 파일 형식입니다.
```
해결: PDF, DOCX, DOC, TXT 형식만 지원

#### 3. AI 평가 실패
```
AI 평가 중 오류 발생
```
해결: 네트워크 연결 확인, API 키 유효성 확인

## 성능 최적화

### 대용량 처리
- 여러 이력서를 동시에 처리 (동시성 처리)
- 결과 캐싱을 통한 재평가 방지
- 일괄 처리 모드 지원

### 정확도 향상
- 평가 프롬프트 최적화
- 컨텍스트 정보 향상
- 피드백 루프 구현

## 보안 고려사항

- API 키는 절대 코드에 하드코딩 금지
- 민감한 개인정보는 로깅하지 않음
- 이력서 파일은 안전한 디렉토리에 보관

## 기여하기

버그 리포트나 기능 제안은 이슈 트래커에 등록해주세요.

## 라이선스

MIT License