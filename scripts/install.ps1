$ErrorActionPreference = "Stop"

function Run([string]$cmd, [string[]]$arguments) {
    & $cmd @arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed ($LASTEXITCODE): $cmd $($args -join ' ')"
    }
}

try {
    Write-Host "Installing dependencies..." -ForegroundColor White
    Run npm @("i", "-D", "playwright", "@playwright/test")
    Run npx @("playwright", "install")

    Write-Host "Done!"  -ForegroundColor Green
    Write-Host "Next:"  -ForegroundColor White
    Write-Host "  cd $Name"
    Write-Host "  npm start" -ForegroundColor White
}
catch {
    Write-Host "Setup failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You were in: $(Get-Location)" -ForegroundColor DarkGray
    exit 1
}
