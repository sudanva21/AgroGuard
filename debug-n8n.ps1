# Advanced N8N Webhook Debugging Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "N8N Webhook Advanced Debugging" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Verify N8N is running
Write-Host "[1/5] Checking N8N service..." -ForegroundColor Yellow
try {
    $n8nCheck = Invoke-WebRequest -Uri "http://localhost:5678" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ N8N is running (Status: $($n8nCheck.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ N8N is not accessible!" -ForegroundColor Red
    Write-Host "Start N8N with: n8n start" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 2: Test webhook with minimal payload
Write-Host "[2/5] Testing webhook with minimal payload..." -ForegroundColor Yellow
try {
    $minimalPayload = @{
        crop = "Test"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "http://localhost:5678/webhook/disease-detection" `
        -Method Post `
        -ContentType "application/json" `
        -Body $minimalPayload `
        -UseBasicParsing `
        -TimeoutSec 15 `
        -ErrorAction Stop

    Write-Host "✅ Webhook responded" -ForegroundColor Green
    Write-Host "   Status Code: $($response.StatusCode)" -ForegroundColor Gray
    Write-Host "   Content Length: $($response.Content.Length) bytes" -ForegroundColor Gray
    Write-Host "   Content Type: $($response.Headers['Content-Type'])" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Raw Response:" -ForegroundColor Cyan
    Write-Host "   $($response.Content)" -ForegroundColor White
    Write-Host ""
    
    if ($response.Content.Length -eq 0) {
        Write-Host "⚠️ WARNING: Webhook returned EMPTY response!" -ForegroundColor Red
        Write-Host ""
        Write-Host "This means:" -ForegroundColor Yellow
        Write-Host "  • Workflow is running BUT" -ForegroundColor White
        Write-Host "  • The 'Respond to Webhook' node is not configured correctly" -ForegroundColor White
        Write-Host "  • OR workflow execution is failing silently" -ForegroundColor White
        Write-Host ""
        Write-Host "Solution:" -ForegroundColor Yellow
        Write-Host "  1. Open N8N workflow" -ForegroundColor White
        Write-Host "  2. Check 'Respond to Webhook' node (last node)" -ForegroundColor White
        Write-Host "  3. Verify it has: 'Respond With: json'" -ForegroundColor White
        Write-Host "  4. Check N8N Executions tab for errors" -ForegroundColor White
        Write-Host ""
    }
} catch {
    Write-Host "❌ Webhook request failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   HTTP Status: $statusCode" -ForegroundColor Red
        
        if ($statusCode -eq 404) {
            Write-Host ""
            Write-Host "⚠️ 404 means webhook path not found!" -ForegroundColor Yellow
            Write-Host "   Check:" -ForegroundColor White
            Write-Host "   • Workflow is imported" -ForegroundColor Gray
            Write-Host "   • Workflow is ACTIVATED (green toggle)" -ForegroundColor Gray
            Write-Host "   • Webhook path is: disease-detection" -ForegroundColor Gray
        }
    }
}
Write-Host ""

# Test 3: Check N8N executions API
Write-Host "[3/5] Checking recent N8N executions..." -ForegroundColor Yellow
try {
    $executions = Invoke-WebRequest -Uri "http://localhost:5678/rest/executions" -UseBasicParsing -TimeoutSec 5
    $execData = $executions.Content | ConvertFrom-Json
    
    if ($execData.data.length -gt 0) {
        Write-Host "✅ Found $($execData.data.length) recent executions" -ForegroundColor Green
        Write-Host ""
        Write-Host "   Last 3 executions:" -ForegroundColor Cyan
        foreach ($exec in $execData.data | Select-Object -First 3) {
            $status = if ($exec.finished) { "✅ Success" } else { "❌ Failed" }
            Write-Host "   $status - $($exec.workflowName) ($(Get-Date $exec.startedAt -Format 'HH:mm:ss'))" -ForegroundColor Gray
        }
    } else {
        Write-Host "⚠️ No executions found" -ForegroundColor Yellow
        Write-Host "   This means webhook was never triggered!" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️ Cannot access executions API" -ForegroundColor Yellow
    Write-Host "   (This is OK - might need authentication)" -ForegroundColor Gray
}
Write-Host ""

# Test 4: Test with sample image
Write-Host "[4/5] Testing with sample image data..." -ForegroundColor Yellow
try {
    # 1x1 transparent PNG
    $sampleImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    
    $fullPayload = @{
        image = $sampleImage
        crop = "Tomato"
        timestamp = (Get-Date -Format "o")
        imageType = "image/png"
    } | ConvertTo-Json

    Write-Host "   Sending payload (image size: $($sampleImage.Length) bytes)..." -ForegroundColor Gray
    
    $fullResponse = Invoke-WebRequest -Uri "http://localhost:5678/webhook/disease-detection" `
        -Method Post `
        -ContentType "application/json" `
        -Body $fullPayload `
        -UseBasicParsing `
        -TimeoutSec 30 `
        -ErrorAction Stop

    Write-Host "✅ Full test succeeded!" -ForegroundColor Green
    Write-Host "   Status: $($fullResponse.StatusCode)" -ForegroundColor Gray
    Write-Host "   Response Length: $($fullResponse.Content.Length) bytes" -ForegroundColor Gray
    Write-Host ""
    
    if ($fullResponse.Content.Length -gt 0) {
        Write-Host "   Response Content:" -ForegroundColor Cyan
        try {
            $jsonResponse = $fullResponse.Content | ConvertFrom-Json
            Write-Host "   Disease: $($jsonResponse.disease)" -ForegroundColor White
            Write-Host "   Confidence: $($jsonResponse.confidence)" -ForegroundColor White
            Write-Host "   Severity: $($jsonResponse.severity)" -ForegroundColor White
            Write-Host ""
            Write-Host "🎉 SUCCESS! Webhook is working correctly!" -ForegroundColor Green
        } catch {
            Write-Host "   Raw: $($fullResponse.Content)" -ForegroundColor White
        }
    } else {
        Write-Host "❌ Response is EMPTY!" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Full test failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Workflow node check
Write-Host "[5/5] Diagnostic Summary" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If webhook returns EMPTY response, check:" -ForegroundColor Yellow
Write-Host ""
Write-Host "A) In N8N Workflow Editor:" -ForegroundColor Cyan
Write-Host "   1. Click 'Webhook Trigger' node" -ForegroundColor White
Write-Host "      • Path should be: disease-detection" -ForegroundColor Gray
Write-Host "      • Method should be: POST" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Click 'Respond to Webhook' node (last node)" -ForegroundColor White
Write-Host "      • Respond With: json" -ForegroundColor Gray
Write-Host "      • Response Body: ={{`$json}}" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Check if ALL nodes are connected" -ForegroundColor White
Write-Host "      • Look for broken connections" -ForegroundColor Gray
Write-Host ""
Write-Host "B) In N8N Executions Tab:" -ForegroundColor Cyan
Write-Host "   1. Go to Executions (left sidebar)" -ForegroundColor White
Write-Host "   2. Look for red/failed executions" -ForegroundColor White
Write-Host "   3. Click failed execution to see error" -ForegroundColor White
Write-Host ""
Write-Host "C) Environment Variables:" -ForegroundColor Cyan
Write-Host "   1. Settings → Environment Variables" -ForegroundColor White
Write-Host "   2. Verify:" -ForegroundColor White
Write-Host "      • HUGGINGFACE_API_KEY is set" -ForegroundColor Gray
Write-Host "      • GROQ_API_KEY is set" -ForegroundColor Gray
Write-Host "   3. Restart N8N after setting variables" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs to check:" -ForegroundColor Yellow
Write-Host "  • N8N Dashboard: http://localhost:5678" -ForegroundColor White
Write-Host "  • Workflow: http://localhost:5678/workflow/[your-workflow-id]" -ForegroundColor White
Write-Host "  • Executions: http://localhost:5678/executions" -ForegroundColor White
Write-Host ""

pause
