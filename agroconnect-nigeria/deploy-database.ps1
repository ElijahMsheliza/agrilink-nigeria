# AgroConnect Nigeria - Database Deployment Script (PowerShell)
# This script automates the deployment of the database schema to Supabase

param(
    [switch]$SkipPrereq,
    [switch]$SkipLink,
    [switch]$SkipTypes,
    [switch]$VerifyOnly,
    [switch]$Help
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

# Function to check if command exists
function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to check environment variables
function Test-EnvironmentVariables {
    Write-Status "Checking environment variables..."
    
    $requiredVars = @(
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "SUPABASE_SERVICE_ROLE_KEY"
    )
    
    foreach ($var in $requiredVars) {
        if (-not (Test-Path "env:$var")) {
            Write-Error "$var is not set"
            exit 1
        }
    }
    
    Write-Success "Environment variables are set"
}

# Function to check prerequisites
function Test-Prerequisites {
    Write-Status "Checking prerequisites..."
    
    # Check if Node.js is installed
    if (-not (Test-Command "node")) {
        Write-Error "Node.js is not installed. Please install Node.js first."
        exit 1
    }
    
    # Check if npm is installed
    if (-not (Test-Command "npm")) {
        Write-Error "npm is not installed. Please install npm first."
        exit 1
    }
    
    # Check if Supabase CLI is available via npx
    Write-Status "Checking Supabase CLI availability..."
    try {
        $null = npx supabase --version
        Write-Success "Supabase CLI is available via npx"
    }
    catch {
        Write-Error "Supabase CLI is not available. Please ensure npx is working."
        exit 1
    }
    
    Write-Success "Prerequisites check completed"
}

# Function to load environment variables
function Load-EnvironmentVariables {
    Write-Status "Loading environment variables..."
    
    if (Test-Path ".env.local") {
        Get-Content ".env.local" | ForEach-Object {
            if ($_ -match "^([^#][^=]+)=(.*)$") {
                [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
            }
        }
        Write-Success "Loaded environment variables from .env.local"
    }
    elseif (Test-Path ".env") {
        Get-Content ".env" | ForEach-Object {
            if ($_ -match "^([^#][^=]+)=(.*)$") {
                [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
            }
        }
        Write-Success "Loaded environment variables from .env"
    }
    else {
        Write-Warning "No .env.local or .env file found. Make sure environment variables are set."
    }
}

# Function to initialize Supabase project
function Initialize-Supabase {
    Write-Status "Initializing Supabase project..."
    
    if (-not (Test-Path "supabase/config.toml")) {
        Write-Status "Creating Supabase configuration..."
        npx supabase init
    }
    else {
        Write-Success "Supabase project already initialized"
    }
}

# Function to link to Supabase project
function Link-Supabase {
    Write-Status "Linking to Supabase project..."
    
    # Check if already linked
    if (Test-Path "supabase/.temp/project_id") {
        Write-Success "Already linked to Supabase project"
        return
    }
    
    # Extract project ID from URL
    $url = [Environment]::GetEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL")
    $projectId = $url -replace "https://", "" -replace "\.supabase\.co", ""
    
    if (-not $projectId) {
        Write-Error "Could not extract project ID from NEXT_PUBLIC_SUPABASE_URL"
        Write-Status "Please run: supabase link --project-ref YOUR_PROJECT_ID"
        exit 1
    }
    
    Write-Status "Linking to project: $projectId"
    npx supabase link --project-ref $projectId
}

# Function to deploy database schema
function Deploy-Schema {
    Write-Status "Deploying database schema..."
    
    # Push the schema to Supabase
    npx supabase db push
    
    Write-Success "Database schema deployed successfully"
}

# Function to generate TypeScript types
function Generate-Types {
    Write-Status "Generating TypeScript types..."
    
    # Extract project ID from URL
    $url = [Environment]::GetEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL")
    $projectId = $url -replace "https://", "" -replace "\.supabase\.co", ""
    
    # Generate types
    npx supabase gen types typescript --project-id $projectId > lib/supabase-types.ts
    
    Write-Success "TypeScript types generated successfully"
}

# Function to verify deployment
function Verify-Deployment {
    Write-Status "Verifying deployment..."
    
    # Check if migration files exist
    if ((Test-Path "supabase/migrations/001_initial_schema.sql") -and (Test-Path "supabase/migrations/002_sample_data.sql")) {
        Write-Success "Migration files are present"
    }
    else {
        Write-Error "Migration files are missing"
        exit 1
    }
    
    Write-Success "Deployment verification completed"
}

# Function to show usage
function Show-Usage {
    Write-Host "Usage: .\deploy-database.ps1 [OPTIONS]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -SkipPrereq       Skip prerequisites check"
    Write-Host "  -SkipLink         Skip Supabase project linking"
    Write-Host "  -SkipTypes        Skip TypeScript types generation"
    Write-Host "  -VerifyOnly       Only verify deployment (skip deployment)"
    Write-Host "  -Help             Show this help message"
    Write-Host ""
    Write-Host "Environment Variables Required:"
    Write-Host "  NEXT_PUBLIC_SUPABASE_URL"
    Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY"
    Write-Host "  SUPABASE_SERVICE_ROLE_KEY"
    Write-Host ""
    Write-Host "Example:"
    Write-Host "  .\deploy-database.ps1"
    Write-Host "  .\deploy-database.ps1 -SkipPrereq"
}

# Main execution
function Main {
    Write-Host "🚀 AgroConnect Nigeria - Database Deployment Script" -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Load environment variables
    Load-EnvironmentVariables
    
    # Check environment variables
    Test-EnvironmentVariables
    
    if ($VerifyOnly) {
        Verify-Deployment
        exit 0
    }
    
    # Check prerequisites
    if (-not $SkipPrereq) {
        Test-Prerequisites
    }
    
    # Initialize Supabase project
    Initialize-Supabase
    
    # Link to Supabase project
    if (-not $SkipLink) {
        Link-Supabase
    }
    
    # Deploy database schema
    Deploy-Schema
    
    # Generate TypeScript types
    if (-not $SkipTypes) {
        Generate-Types
    }
    
    # Verify deployment
    Verify-Deployment
    
    Write-Host ""
    Write-Success "🎉 Database deployment completed successfully!"
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Start your development server: npm run dev"
    Write-Host "2. Test the database connection"
    Write-Host "3. Create your first user profile"
    Write-Host ""
    Write-Host "For more information, see: supabase/README.md"
}

# Show help if requested
if ($Help) {
    Show-Usage
    exit 0
}

# Run main function
Main