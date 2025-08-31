# CollabNote API end-to-end test (PowerShell)
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Users\user\Desktop\web-challenges\project\backend\scripts\test-api.ps1"

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
function Assert-Fail($resp, $name) {
  if (-not $resp) { Pass $name; return }
  if ($null -ne $resp.success -and $resp.success -eq $false) { Pass $name; return }
  Fail $name $resp
}
function Assert-ErrorCode($resp, $code, $name) {
  $got = $null
  if ($resp.error -and $resp.error.code) { $got = $resp.error.code } elseif ($resp.code) { $got = $resp.code }
  if ($got -ne $code) { Fail $name @{ expected=$code; actual=$got; resp=$resp } }
  Pass $name
}
function Assert-AnyErrorCode($resp, $codes, $name) {
  $got = $null
  if ($resp.error -and $resp.error.code) { $got = $resp.error.code } elseif ($resp.code) { $got = $resp.code }
  if (-not ($codes -contains $got)) { Fail $name @{ expectedAny=$codes; actual=$got; resp=$resp } }
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
function GetJson($url, $headers=@{}) {
  try {
    $r = Invoke-WebRequest -Method GET -Uri $url -Headers $headers -ErrorAction Stop
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
function DeleteJson($url, $headers=@{}) {
  try {
    $r = Invoke-WebRequest -Method DELETE -Uri $url -Headers $headers -ErrorAction Stop
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
  # Ensure refresh token rotated
  $refreshResp2 = PostJson "$BaseUrl/auth/refresh" @{ refreshToken=$Refresh1 }
  Assert-Success $refreshResp2 "refresh rotate again"
  if ($refreshResp2.refreshToken -eq $Refresh1) { Fail "refresh rotation changed" $refreshResp2 }
  $Access1 = $refreshResp2.token
  $Refresh1 = $refreshResp2.refreshToken
  $Auth1 = @{ Authorization = "Bearer $Access1" }

  Write-Title "Create note (sanitized content)"
  $createNote = PostJson "$BaseUrl/notes" @{ title="Project ideas"; content="<script>alert('XSS')</script> and some safe text afterwards"; isPublic=$false } $Auth1
  if (-not $createNote) { Fail "create note (no response)" "null" }
  Write-Host ($createNote | ConvertTo-Json -Depth 10)
  if ($null -ne $createNote.success -and -not $createNote.success) { Fail "create note" $createNote }
  $NoteId = $createNote.id
  if ($createNote.content -match "<script") { Fail "sanitization check" $createNote }
  Write-Host ("Sanitized content: {0}" -f $createNote.content) -ForegroundColor DarkGray

  Write-Title "Create note validation (missing title)"
  $badCreate = PostJson "$BaseUrl/notes" @{ content="too short"; isPublic=$true } $Auth1
  Assert-Fail $badCreate "create note should fail"
  Assert-ErrorCode $badCreate "VALIDATION_ERROR" "create note validation code"

  Write-Title "List notes"
  $list = Invoke-RestMethod -Method GET -Uri "$BaseUrl/notes" -Headers $Auth1
  Assert-Success $list "list notes"

  Write-Title "Get note by id"
  $getById = GetJson "$BaseUrl/notes/$NoteId" $Auth1
  Assert-Success $getById "get note by id"

  Write-Title "Update note"
  # Keep isPublic=false here to test share permissions later
  $update = PutJson "$BaseUrl/notes/$NoteId" @{ title="Updated title" } $Auth1
  Assert-Success $update "update note"
  Write-Title "Update note validation (no fields)"
  $updateEmpty = PutJson "$BaseUrl/notes/$NoteId" @{} $Auth1
  Assert-Fail $updateEmpty "update should fail when body empty"
  Assert-ErrorCode $updateEmpty "VALIDATION_ERROR" "update validation code"

  Write-Title "Register user2 for sharing"
  $register2 = PostJson "$BaseUrl/auth/register" @{ email=$Email2; password=$Password; confirmPassword=$Password; name="Tester Two"; age=24 }
  Assert-Success $register2 "register user2"
  $User2Id = $register2.data.user.id
  Write-Title "Login user2"
  $login2 = PostJson "$BaseUrl/auth/login" @{ email=$Email2; password=$Password }
  Assert-Success $login2 "login user2"
  $Access2 = $login2.data.token
  $Auth2 = @{ Authorization = "Bearer $Access2" }

  Write-Title "User2 cannot view private note before share"
  $getByIdU2Before = GetJson "$BaseUrl/notes/$NoteId" $Auth2
  Assert-Fail $getByIdU2Before "user2 cannot view before share"
  Assert-AnyErrorCode $getByIdU2Before @("FORBIDDEN","NOT_FOUND") "user2 forbidden/notfound before share"

  Write-Title "Share note with user2"
  $share = PostJson "$BaseUrl/notes/$NoteId/share" @{ userId=$User2Id; canEdit=$false } $Auth1
  Assert-Success $share "share note"

  Write-Title "User2 can view after share (read-only)"
  $getByIdU2 = GetJson "$BaseUrl/notes/$NoteId" $Auth2
  Assert-Success $getByIdU2 "user2 can view after share"
  Write-Title "User2 cannot edit when canEdit=false"
  $u2EditDeny = PutJson "$BaseUrl/notes/$NoteId" @{ title="u2 edit attempt" } $Auth2
  Assert-Fail $u2EditDeny "user2 edit denied"
  Assert-AnyErrorCode $u2EditDeny @("FORBIDDEN","NOT_FOUND") "user2 edit forbidden/notfound code"

  Write-Title "Grant edit to user2"
  $shareEdit = PostJson "$BaseUrl/notes/$NoteId/share" @{ userId=$User2Id; canEdit=$true } $Auth1
  Assert-Success $shareEdit "grant edit"
  Write-Title "User2 can edit after canEdit=true"
  $u2EditOk = PutJson "$BaseUrl/notes/$NoteId" @{ title="Edited by user2" } $Auth2
  Assert-Success $u2EditOk "user2 edit success"

  Write-Title "Unshare note from user2"
  $unshare = Invoke-RestMethod -Method DELETE -Uri "$BaseUrl/notes/$NoteId/share/$User2Id" -Headers $Auth1
  Assert-Success $unshare "unshare note"

  Write-Title "Delete note"
  $delete = DeleteJson "$BaseUrl/notes/$NoteId" $Auth1
  Assert-Success $delete "delete note"

  Write-Title "Create more notes for search/pagination"
  $n1 = PostJson "$BaseUrl/notes" @{ title="Alpha Test"; content="Alpha content is here"; isPublic=$true } $Auth1
  $n2 = PostJson "$BaseUrl/notes" @{ title="Beta Plans"; content="Beta content is here"; isPublic=$true } $Auth1
  Assert-Success $n1 "create note alpha"
  Assert-Success $n2 "create note beta"

  Write-Title "Search notes by title"
  $search = GetJson "$BaseUrl/notes?search=Alpha" $Auth1
  Assert-Success $search "search notes"
  $hasAlpha = $false
  foreach ($note in $search.notes) { if ($note.title -match "Alpha") { $hasAlpha = $true } }
  if (-not $hasAlpha) { Fail "search results contain Alpha" $search }

  Write-Title "Pagination test"
  $page1 = GetJson "$BaseUrl/notes?limit=1&page=1" $Auth1
  $page2 = GetJson "$BaseUrl/notes?limit=1&page=2" $Auth1
  Assert-Success $page1 "pagination page1"
  Assert-Success $page2 "pagination page2"
  if ($page1.pagination.pages -lt 2) { Write-Host "Only one page of results; pagination minimal" -ForegroundColor DarkYellow }
  if ($page1.notes.Length -gt 0 -and $page2.notes.Length -gt 0) {
    if ($page1.notes[0].id -eq $page2.notes[0].id) { Fail "pagination different pages" @{ page1=$page1; page2=$page2 } }
  }

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
