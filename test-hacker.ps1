# =========================================================
# Hacker Penetration Simulation Script
# Tests all vectors: Signup bypass, Admin discovery, DB RLS
# =========================================================

$supabaseUrl = "https://qnszmczdofeahyxitgtn.supabase.co"
$anonKey = "sb_publishable_vu_Gu4XfmNKYLnD6Y-nbog_ibSQv1S9"

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " [ATTACK 1] Trying to create an account via Supabase API" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

$signupBody = @{
    email = "hacker_test_account@evil.com"
    password = "HackerPassword123!"
} | ConvertTo-Json

$headers = @{
    "apikey" = $anonKey
    "Content-Type" = "application/json"
}

try {
    $res = Invoke-RestMethod -Uri "$supabaseUrl/auth/v1/signup" -Method Post -Headers $headers -Body $signupBody
    Write-Host "[FAIL] Account was created! Vulnerability still exists!" -ForegroundColor Red
    $res
} catch {
    Write-Host "[BLOCKED SUCCESS] Database rejected the registration!" -ForegroundColor Green
    Write-Host "Server Response: " -NoNewline
    Write-Host $_.Exception.Response.StatusCode " " -NoNewline -ForegroundColor Magenta
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Yellow
    } else {
        Write-Host $_.Exception.Message -ForegroundColor Yellow
    }
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " [ATTACK 2] Trying to insert fake data directly into database" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

$fakeProject = @{
    title = "HACKED BY EVIL"
    description = "Defaced portfolio"
} | ConvertTo-Json

try {
    $dbRes = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/projects" -Method Post -Headers $headers -Body $fakeProject
    Write-Host "[FAIL] Database allowed unauthorized INSERT!" -ForegroundColor Red
} catch {
    Write-Host "[BLOCKED SUCCESS] RLS Policy rejected unauthorized INSERT!" -ForegroundColor Green
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Yellow
    } else {
        Write-Host $_.Exception.Message -ForegroundColor Yellow
    }
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " [ATTACK 3] Testing old admin path discovery" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

try {
    $webRes = Invoke-WebRequest -Uri "http://localhost:3000/admin" -Method Get -MaximumRedirection 0 -ErrorAction Stop
    Write-Host "Status: " $webRes.StatusCode
} catch {
    if ($_.Exception.Response) {
        $code = [int]$_.Exception.Response.StatusCode
        if ($code -eq 404) {
            Write-Host "[HIDDEN SUCCESS] /admin returned 404 Not Found! Stealth path active." -ForegroundColor Green
        } else {
            Write-Host "HTTP Status: $code" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Next.js dev server not running on port 3000 (Start with 'npm run dev' to test web routes)" -ForegroundColor Gray
    }
}

Write-Host "`n========================================================`n" -ForegroundColor Cyan
