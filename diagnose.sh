#!/bin/bash

echo "=== OpenLab Resume Screening 진단 ==="
echo ""

# 1. 포트 확인
echo "1. 포트 확인:"
echo "   - Vite (5173):"
lsof -i :5173 2>/dev/null | grep LISTEN && echo "     ✓ 실행 중" || echo "     ✗ 미실행"

echo "   - Python (8000):"
lsof -i :8000 2>/dev/null | grep LISTEN && echo "     ✓ 실행 중" || echo "     ✗ 미실행"

echo ""
echo "2. Python 서버 테스트 (실행 중이면):"
curl -s -X POST http://localhost:8000/analyze-resume \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "job_description=test&criteria=test&resume_text=test" \
  -w "\nStatus: %{http_code}\n" || echo "   ✗ 연결 실패"

echo ""
echo "=== 필요한 작업 ==="
echo "1. Python 백엔드 시작:"
echo "   cd /Users/hynwl/hynwl_pjt/hynwl_openlab/resume_screening"
echo "   source .venv/bin/activate"
echo "   python main.py"
echo ""
echo "2. Ollama 서비스 확인:"
echo "   ollama serve  (별도 터미널에서)"
