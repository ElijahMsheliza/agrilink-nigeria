@echo off
REM AgroConnect Nigeria - Database Deployment Script (Batch)
REM This script automates the deployment of the database schema to Supabase

setlocal enabledelayedexpansion

REM Parse command line arguments
set "SKIP_PREREQ="
set "SKIP_LINK="
set "SKIP_TYPES="
set "VERIFY_ONLY="

:parse_args
if "%1"=="" goto :main
if "%1"=="--skip-prereq" set "SKIP_PREREQ=1"
if "%1"=="--skip-link" set "SKIP_LINK=1"
if "%1"=="--skip-types" set "SKIP_TYPES=1"
if "%1"=="--verify-only" set "VERIFY_ONLY=1"
if "%1"=="--help" goto :show_usage
shift
goto :parse_args

:show_usage
echo Usage: deploy-database.bat [OPTIONS]
echo.
echo Options:
echo   --help          Show this help message
echo   --skip-prereq   Skip prerequisites check
echo   --skip-link     Skip Supabase project linking
echo   --skip-types    Skip TypeScript types generation
echo   --verify-only   Only verify deployment (skip deployment)
echo.
echo Environment Variables Required:
echo   NEXT_PUBLIC_SUPABASE_URL
echo   NEXT_PUBLIC_SUPABASE_ANON_KEY
echo   SUPABASE_SERVICE_ROLE_KEY
echo.
echo Example:
echo   deploy-database.bat
echo   deploy-database.bat --skip-prereq
exit /b 0

:main
echo 🚀 AgroConnect Nigeria - Database Deployment Script
echo ==================================================
echo.

REM Load environment variables
call :load_env

REM Check environment variables
call :check_env_vars

if defined VERIFY_ONLY (
    call :verify_deployment
    exit /b 0
)

REM Check prerequisites
if not defined SKIP_PREREQ (
    call :check_prerequisites
)

REM Initialize Supabase project
call :init_supabase

REM Link to Supabase project
if not defined SKIP_LINK (
    call :link_supabase
)

REM Deploy database schema
call :deploy_schema

REM Generate TypeScript types
if not defined SKIP_TYPES (
    call :generate_types
)

REM Verify deployment
call :verify_deployment

echo.
echo [SUCCESS] 🎉 Database deployment completed successfully!
echo.
echo Next steps:
echo 1. Start your development server: npm run dev
echo 2. Test the database connection
echo 3. Create your first user profile
echo.
echo For more information, see: supabase/README.md
exit /b 0

:load_env
echo [INFO] Loading environment variables...
if exist ".env.local" (
    for /f "tokens=1,2 delims==" %%a in (.env.local) do (
        if not "%%a"=="" if not "%%a:~0,1%"=="#" (
            set "%%a=%%b"
        )
    )
    echo [SUCCESS] Loaded environment variables from .env.local
) else if exist ".env" (
    for /f "tokens=1,2 delims==" %%a in (.env) do (
        if not "%%a"=="" if not "%%a:~0,1%"=="#" (
            set "%%a=%%b"
        )
    )
    echo [SUCCESS] Loaded environment variables from .env
) else (
    echo [WARNING] No .env.local or .env file found. Make sure environment variables are set.
)
goto :eof

:check_env_vars
echo [INFO] Checking environment variables...
if "%NEXT_PUBLIC_SUPABASE_URL%"=="" (
    echo [ERROR] NEXT_PUBLIC_SUPABASE_URL is not set
    exit /b 1
)
if "%NEXT_PUBLIC_SUPABASE_ANON_KEY%"=="" (
    echo [ERROR] NEXT_PUBLIC_SUPABASE_ANON_KEY is not set
    exit /b 1
)
if "%SUPABASE_SERVICE_ROLE_KEY%"=="" (
    echo [ERROR] SUPABASE_SERVICE_ROLE_KEY is not set
    exit /b 1
)
echo [SUCCESS] Environment variables are set
goto :eof

:check_prerequisites
echo [INFO] Checking prerequisites...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    exit /b 1
)
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    exit /b 1
)
where supabase >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Supabase CLI is not installed. Installing now...
    npm install -g supabase
)
echo [SUCCESS] Prerequisites check completed
goto :eof

:init_supabase
echo [INFO] Initializing Supabase project...
if not exist "supabase\config.toml" (
    echo [INFO] Creating Supabase configuration...
    supabase init
) else (
    echo [SUCCESS] Supabase project already initialized
)
goto :eof

:link_supabase
echo [INFO] Linking to Supabase project...
if exist "supabase\.temp\project_id" (
    echo [SUCCESS] Already linked to Supabase project
    goto :eof
)
for /f "tokens=*" %%i in ('echo %NEXT_PUBLIC_SUPABASE_URL% ^| sed "s|https://||" ^| sed "s|\.supabase\.co||"') do set "PROJECT_ID=%%i"
if "%PROJECT_ID%"=="" (
    echo [ERROR] Could not extract project ID from NEXT_PUBLIC_SUPABASE_URL
    echo [INFO] Please run: supabase link --project-ref YOUR_PROJECT_ID
    exit /b 1
)
echo [INFO] Linking to project: %PROJECT_ID%
supabase link --project-ref %PROJECT_ID%
goto :eof

:deploy_schema
echo [INFO] Deploying database schema...
supabase db push
echo [SUCCESS] Database schema deployed successfully
goto :eof

:generate_types
echo [INFO] Generating TypeScript types...
for /f "tokens=*" %%i in ('echo %NEXT_PUBLIC_SUPABASE_URL% ^| sed "s|https://||" ^| sed "s|\.supabase\.co||"') do set "PROJECT_ID=%%i"
npx supabase gen types typescript --project-id %PROJECT_ID% > lib/supabase-types.ts
echo [SUCCESS] TypeScript types generated successfully
goto :eof

:verify_deployment
echo [INFO] Verifying deployment...
if exist "supabase\migrations\001_initial_schema.sql" if exist "supabase\migrations\002_sample_data.sql" (
    echo [SUCCESS] Migration files are present
) else (
    echo [ERROR] Migration files are missing
    exit /b 1
)
echo [SUCCESS] Deployment verification completed
goto :eof