# ./setup.ps1
$ErrorActionPreference = "Stop"

function Run([string]$cmd, [string[]]$arguments) {
    & $cmd @arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed ($LASTEXITCODE): $cmd $($args -join ' ')"
    }
}

try {
    Run npm @("init", "-y")
    Write-Host "Initialized package.json..." -ForegroundColor White

    if (-not (Test-Path -Path "index.js")) {
        Set-Content -Encoding utf8 -Path "index.js" -Value @(
            '// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1'
            'const { chromium } = require("playwright");'
            ''
            'async function sortHackerNewsArticles() {'
            '// launch browser'
            'const browser = await chromium.launch({ headless: false });'
            'const context = await browser.newContext();'
            'const page = await context.newPage();'
            ''
            '// go to Hacker News'
            'await page.goto("https://news.ycombinator.com/newest");'
            ''
            '}'
            ''
            '(async () => {'
            'await sortHackerNewsArticles();'
            '})();'
        )
        Write-Host "Created index.js..." -ForegroundColor White
    }
    else {
        Write-Host "index.js already exists; skipping." -ForegroundColor Yellow
    }
    
    if (-not (Test-Path -Path "playwright.config.js")) {
        Set-Content -Encoding utf8 -Path "playwright.config.js" -Value @(
            '// @ts-check'
            "const { defineConfig, devices } = require('@playwright/test');"
            ''
            "/**"
            '* Read environment variables from file.'
            '* https://github.com/motdotla/dotenv'
            '*/'
            "// require('dotenv').config();"
            ''
            '/**'
            '* @see https://playwright.dev/docs/test-configuration'
            '*/'
            'module.exports = defineConfig({'
            "testDir: './tests',"
            '/* Run tests in files in parallel */'
            'fullyParallel: true,'
            '/* Fail the build on CI if you accidentally left test.only in the source code. */'
            'forbidOnly: !!process.env.CI,'
            '/* Retry on CI only */'
            'retries: process.env.CI ? 2 : 0,'
            '/* Opt out of parallel tests on CI. */'
            'workers: process.env.CI ? 1 : undefined,'
            '/* Reporter to use. See https://playwright.dev/docs/test-reporters */'
            "reporter: 'html',"
            '/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */'
            'use: {'
            "/* Base URL to use in actions like 'await page.goto(' / ')'. */"
            "// baseURL: 'http://127.0.0.1:3000',"
            ''
            '/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */'
            "trace: 'on-first-retry',"
            '},'
            ''
            '/* Configure projects for major browsers */'
            'projects: ['
            '{'
            "name: 'chromium',"
            "use: { ...devices['Desktop Chrome'] },"
            '},'
            ''
            '{'
            "name: 'firefox',"
            "use: { ...devices['Desktop Firefox'] },"
            '},'
            ''
            '{'
            "name: 'webkit',"
            "use: { ...devices['Desktop Safari'] },"
            '},'
            ''
            '/* Test against mobile viewports. */'
            '// {'
            "//   name: 'Mobile Chrome',"
            "//   use: { ...devices['Pixel 5'] },"
            '// },'
            '// {'
            "//   name: 'Mobile Safari',"
            "//   use: { ...devices['iPhone 12'] },"
            '// },'
            ''
            '/* Test against branded browsers. */'
            '// {'
            "//   name: 'Microsoft Edge',"
            "//   use: { ...devices['Desktop Edge'], channel: 'msedge' },"
            '// },'
            '// {'
            "//   name: 'Google Chrome',"
            "//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },"
            '// },'
            '],'
            ''
            '/* Run your local dev server before starting the tests */'
            '// webServer: {'
            "//   command: 'npm run start',"
            "//   url: 'http://127.0.0.1:3000',"
            '//   reuseExistingServer: !process.env.CI,'
            '// },'
            '});'
        )
        Write-Host "Created playwright.config.js..." -ForegroundColor White
    }
    else {
        Write-Host "Skipping playwright.config.js..." -ForegroundColor White
    }
   

    if (Get-Command git -ErrorAction SilentlyContinue) {
        Run git @("init")
        Write-Host "Initialized repo..." -ForegroundColor White
    }

    if (-not (Test-Path -Path ".gitignore")) {
        Set-Content -Encoding utf8 -Path ".gitignore" -Value @(
            "node_modules"
            "dotenv"
        )
        Write-Host "Created .gitignore..." -ForegroundColor White
    }
    else {
        Write-Host "Skipping .gitignore..." -ForegroundColor White
    }
    
    if (-not (Test-Path -Path "README.md")) {
        $repoUrl = "https://github.com/TechWithTy/QA_Tester_Example_Project.git"
        $temp = Join-Path $env:TEMP ("seed-" + [guid]::NewGuid())

        git clone --depth 1 $repoUrl $temp
        Copy-Item (Join-Path $temp "README.md") -Destination ".\README.md" -Force
        Remove-Item $temp -Recurse -Force

        Write-Host "Created README.md" -ForegroundColor White
    }
    else {
        Write-Host "Skipping README.md..." -ForegroundColor White
    }
    
    Run npm @("pkg", "set", "scripts.setup=powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\install.ps1") 
    Write-Host "Added install script..." -ForegroundColor White
    Write-Host "Running install script..."
    npm run setup

    Run npm @("pkg", "set", "scripts.start=node index.js") 
    Write-Host "Added start script..." -ForegroundColor White

    Write-Host "Done!"  -ForegroundColor Green
}
catch {
    Write-Host "Setup failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You were in: $(Get-Location)" -ForegroundColor DarkGray
    exit 1
}

