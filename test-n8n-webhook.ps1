# N8N Webhook Test Script
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Testing N8N Disease Detection Webhook" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if N8N is running
Write-Host "[1/4] Testing if N8N is running..." -ForegroundColor Yellow
try {
    $n8nTest = Invoke-WebRequest -Uri "http://localhost:5678" -Method Get -UseBasicParsing -TimeoutSec 5
    if ($n8nTest.StatusCode -eq 200) {
        Write-Host "✅ N8N is running on port 5678" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ N8N is NOT running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start N8N first:" -ForegroundColor Yellow
    Write-Host "   n8n start" -ForegroundColor White
    Write-Host ""
    pause
    exit 1
}
Write-Host ""

# Test 2: Check webhook endpoint exists
Write-Host "[2/4] Testing webhook endpoint (empty request)..." -ForegroundColor Yellow
try {
    $testPayload = @{
        test = "ping"
    } | ConvertTo-Json

    $webhookTest = Invoke-WebRequest -Uri "http://localhost:5678/webhook/disease-detection" `
        -Method Post `
        -ContentType "application/json" `
        -Body $testPayload `
        -UseBasicParsing `
        -TimeoutSec 10

    Write-Host "✅ Webhook responded with status: $($webhookTest.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($webhookTest.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Webhook endpoint failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "  1. Workflow is imported to N8N" -ForegroundColor White
    Write-Host "  2. Workflow is activated (green toggle in N8N UI)" -ForegroundColor White
    Write-Host "  3. Webhook path is: /webhook/disease-detection" -ForegroundColor White
    Write-Host ""
}
Write-Host ""

# Test 3: Check with full payload
Write-Host "[3/4] Testing with sample image payload..." -ForegroundColor Yellow
try {
    $fullPayload = @{
        image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        crop = "Tomato"
        timestamp = "2025-11-28T09:00:00.000Z"
        imageType = "image/png"
    } | ConvertTo-Json

    $fullTest = Invoke-WebRequest -Uri "http://localhost:5678/webhook/disease-detection" `
        -Method Post `
        -ContentType "application/json" `
        -Body $fullPayload `
        -UseBasicParsing `
        -TimeoutSec 30

    Write-Host "✅ Full payload test succeeded!" -ForegroundColor Green
    Write-Host "Status: $($fullTest.StatusCode)" -ForegroundColor Gray
    
    try {
        $jsonResponse = $fullTest.Content | ConvertFrom-Json
        Write-Host ""
        Write-Host "Response Data:" -ForegroundColor Cyan
        Write-Host "  Disease: $($jsonResponse.disease)" -ForegroundColor White
        Write-Host "  Confidence: $($jsonResponse.confidence)" -ForegroundColor White
        Write-Host "  Severity: $($jsonResponse.severity)" -ForegroundColor White
    } catch {
        Write-Host "Raw Response: $($fullTest.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Full payload test failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "HTTP Status: $statusCode" -ForegroundColor Red
    }
}
Write-Host ""

# Test 4: Check N8N environment variables
Write-Host "[4/4] Environment Variable Check" -ForegroundColor Yellow
Write-Host "Please verify in N8N UI (Settings → Environment Variables):" -ForegroundColor White
Write-Host "  ✓ HUGGINGFACE_API_KEY is set" -ForegroundColor Gray
Write-Host "  ✓ GROQ_API_KEY is set" -ForegroundColor Gray
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Test Complete" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  • N8N Dashboard: http://localhost:5678" -ForegroundColor White
Write-Host "  • Webhook URL: http://localhost:5678/webhook/disease-detection" -ForegroundColor White
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. If tests failed, check N8N_QUICK_START.md" -ForegroundColor White
Write-Host "  2. Import workflow: n8n-disease-detection-workflow.json" -ForegroundColor White
Write-Host "  3. Activate workflow in N8N (green toggle)" -ForegroundColor White
Write-Host "  4. Set environment variables in N8N" -ForegroundColor White
Write-Host ""

pause
