# CollabNote API end-to-end test (PowerShell)
# Usage: powershell -ExecutionPolicy Bypass -File "<path>/test-api.ps1"

Param(
  [string]$BaseUrl = "http://localhost:5000/api"
)

Set-Variable -Name ErrorActionPreference -Value Stop -Scope Script

function Write-Title($text) { Write-Host "=== $text ===" -ForegroundColor Cyan }
function Pass($name) { Write-Host "PASS: $name" -ForegroundColor Green }
function Fail($name, $obj) {
  Write-Host "FAIL: $name" -ForegroundColor Red
  $out = $null
  try { $out = ($obj | ConvertTo-Json -Depth 10) } catch { $out = ("$obj") }
  if ($out) { Write-Host $out } else { Write-Host "$obj" }
  throw $name
}
function Assert-Success($resp, $name) {
  if (-not $resp) { Fail $name "No response" }
  if ($null -ne $resp.success -and -not $resp.success) { Fail $name $resp }
  Pass $name
}
function PostJson($url, $bodyObj, $headers=@{}) {
  $json = ($bodyObj | ConvertTo-Json -Depth 12 -Compress)
  try {
    $r = Invoke-WebRequest -Method POST -Uri $url -Headers $headers -ContentType "application/json" -Body $json -ErrorAction Stop
    if ($r.Content) { try { return $r.Content | ConvertFrom-Json } catch { return @{ success=$true; raw=$r.Content } } }
    return @{ success=$true }
  } catch {
    if ($_.ErrorDetails -and $_.ErrorDetails.Message) {
      $msg = $_.ErrorDetails.Message
      try { return $msg | ConvertFrom-Json } catch { return @{ success=$false; message=$msg } }
    }
    $ex = $_.Exception
    try {
      $resp = $ex.Response
      if ($resp) {
        $stream = $resp.GetResponseStream()
        if ($stream) {
          $reader = New-Object System.IO.StreamReader($stream)
          $text = $reader.ReadToEnd()
          try { return $text | ConvertFrom-Json } catch { return @{ success=$false; message=$text } }
        }
      }
    } catch { }
    return @{ success=$false; message=$ex.Message }
  }
}
function PutJson($url, $bodyObj, $headers=@{}) {
  $json = ($bodyObj | ConvertTo-Json -Depth 12 -Compress)
  try {
    $r = Invoke-WebRequest -Method PUT -Uri $url -Headers $headers -ContentType "application/json" -Body $json -ErrorAction Stop
    if ($r.Content) { try { return $r.Content | ConvertFrom-Json } catch { return @{ success=$true; raw=$r.Content } } }
    return @{ success=$true }
  } catch {
    if ($_.ErrorDetails -and $_.ErrorDetails.Message) {
      $msg = $_.ErrorDetails.Message
      try { return $msg | ConvertFrom-Json } catch { return @{ success=$false; message=$msg } }
    }
    $ex = $_.Exception
    try {
      $resp = $ex.Response
      if ($resp) {
        $stream = $resp.GetResponseStream()
        if ($stream) {
          $reader = New-Object System.IO.StreamReader($stream)
          $text = $reader.ReadToEnd()
          try { return $text | ConvertFrom-Json } catch { return @{ success=$false; message=$text } }
        }
      }
    } catch { }
    return @{ success=$false; message=$ex.Message }
  }
}

# Randomized emails to avoid unique conflicts across runs
$Email1 = "tester1+$(Get-Random)@example.com"
$Email2 = "tester2+$(Get-Random)@example.com"
$Password = "TestPass123"

try {
  Write-Title "Health"
  $apiRoot = ($BaseUrl -replace "/api$", "/")
  $health = Invoke-RestMethod -Method GET -Uri $apiRoot
  Write-Host ($health | ConvertTo-Json -Depth 6)

  Write-Title "Register user1"
  $register1 = PostJson "$BaseUrl/auth/register" @{ email=$Email1; password=$Password; confirmPassword=$Password; name="Tester One"; age=25 }
  Assert-Success $register1 "register user1"
  $User1Id = $register1.data.user.id
  $Access1 = $register1.data.token
  $Refresh1 = $register1.data.refreshToken
  $Auth1 = @{ Authorization = "Bearer $Access1" }

  Write-Title "Login user1"
  $login1 = PostJson "$BaseUrl/auth/login" @{ email=$Email1; password=$Password }
  Assert-Success $login1 "login user1"
  $Access1 = $login1.data.token
  $Refresh1 = $login1.data.refreshToken
  $Auth1 = @{ Authorization = "Bearer $Access1" }

  Write-Title "Refresh token user1"
  $refreshResp = PostJson "$BaseUrl/auth/refresh" @{ refreshToken=$Refresh1 }
  Assert-Success $refreshResp "refresh token user1"
  $Access1 = $refreshResp.token
  $Refresh1 = $refreshResp.refreshToken
  $Auth1 = @{ Authorization = "Bearer $Access1" }

  Write-Title "Create note (sanitized content)"
  $createNote = PostJson "$BaseUrl/notes" @{ title="Project ideas"; content="<script>alert('XSS')</script> and some safe text afterwards"; isPublic=$false } $Auth1
  if (-not $createNote) { Fail "create note (no response)" "null" }
  Write-Host ($createNote | ConvertTo-Json -Depth 10)
  if ($null -ne $createNote.success -and -not $createNote.success) { Fail "create note" $createNote }
  $NoteId = $createNote.id
  if ($createNote.content -match "<script") { Fail "sanitization check" $createNote }
  Write-Host ("Sanitized content: {0}" -f $createNote.content) -ForegroundColor DarkGray

  Write-Title "List notes"
  $list = Invoke-RestMethod -Method GET -Uri "$BaseUrl/notes" -Headers $Auth1
  Assert-Success $list "list notes"

  Write-Title "Get note by id"
  $getById = Invoke-RestMethod -Method GET -Uri "$BaseUrl/notes/$NoteId" -Headers $Auth1
  Assert-Success $getById "get note by id"

  Write-Title "Update note"
  $update = PutJson "$BaseUrl/notes/$NoteId" @{ title="Updated title"; isPublic=$true } $Auth1
  Assert-Success $update "update note"

  Write-Title "Register user2 for sharing"
  $register2 = PostJson "$BaseUrl/auth/register" @{ email=$Email2; password=$Password; confirmPassword=$Password; name="Tester Two"; age=24 }
  Assert-Success $register2 "register user2"
  $User2Id = $register2.data.user.id

  Write-Title "Share note with user2"
  $share = PostJson "$BaseUrl/notes/$NoteId/share" @{ userId=$User2Id; canEdit=$false } $Auth1
  Assert-Success $share "share note"

  Write-Title "Unshare note from user2"
  $unshare = Invoke-RestMethod -Method DELETE -Uri "$BaseUrl/notes/$NoteId/share/$User2Id" -Headers $Auth1
  Assert-Success $unshare "unshare note"

  Write-Title "Delete note"
  $delete = Invoke-RestMethod -Method DELETE -Uri "$BaseUrl/notes/$NoteId" -Headers $Auth1
  Assert-Success $delete "delete note"

  Write-Title "Forgot password (user1)"
  $forgot = PostJson "$BaseUrl/auth/forgot-password" @{ email=$Email1 }
  Assert-Success $forgot "forgot password"
  $ResetToken = $forgot.token
  if ($ResetToken) {
    Write-Title "Reset password (user1)"
    $newPass = "NewPass123"
  $reset = PostJson "$BaseUrl/auth/reset-password" @{ token=$ResetToken; password=$newPass; confirmPassword=$newPass }
    Assert-Success $reset "reset password"

    Write-Title "Re-login with new password"
    $relogin = PostJson "$BaseUrl/auth/login" @{ email=$Email1; password=$newPass }
    Assert-Success $relogin "re-login"
  } else {
    Write-Host "Reset token not returned (prod mode). Skipping reset-password." -ForegroundColor DarkYellow
  }

  Write-Title "Logout user1"
  $logout = PostJson "$BaseUrl/auth/logout" @{ refreshToken = $Refresh1 }
  Assert-Success $logout "logout user1"

  Write-Host "All tests completed successfully." -ForegroundColor Green
} catch {
  $errMsg = $_.Exception.Message
  Write-Host ("Test run failed: {0}" -f $errMsg) -ForegroundColor Red
  exit 1
}
