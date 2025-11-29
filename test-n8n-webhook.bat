@echo off
echo ============================================
echo Testing N8N Disease Detection Webhook
echo ============================================
echo.

echo [1/3] Testing if N8N is running...
curl -s http://localhost:5678 > nul
if %errorlevel% neq 0 (
    echo ❌ N8N is NOT running!
    echo.
    echo Please start N8N first:
    echo    n8n start
    echo.
    pause
    exit /b 1
)
echo ✅ N8N is running on port 5678
echo.

echo [2/3] Testing webhook endpoint...
curl -X POST http://localhost:5678/webhook/disease-detection ^
  -H "Content-Type: application/json" ^
  -d "{\"test\":\"ping\"}" ^
  -w "\n\nHTTP Status: %%{http_code}\n"
echo.

echo [3/3] Testing with sample payload...
curl -X POST http://localhost:5678/webhook/disease-detection ^
  -H "Content-Type: application/json" ^
  -d "{\"image\":\"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==\",\"crop\":\"Tomato\",\"timestamp\":\"2025-11-28T09:00:00.000Z\"}"
echo.

echo ============================================
echo Test Complete
echo ============================================
echo.
echo If you see JSON output above, webhook is working! ✅
echo.
echo If you see errors, please check:
echo   1. Workflow is imported to N8N
echo   2. Workflow is activated (green toggle)
echo   3. Environment variables are set:
echo      - HUGGINGFACE_API_KEY
echo      - GROQ_API_KEY
echo.
pause
