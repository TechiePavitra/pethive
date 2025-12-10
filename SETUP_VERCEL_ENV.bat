@echo off
REM Vercel Environment Variables Setup for PetHive (Windows)

setlocal enabledelayedexpansion

set "VERCEL_URL=https://pethive-psi.vercel.app"
set "API_URL=!VERCEL_URL!/api"

echo.
echo ========================================
echo ^| PetHive Vercel Setup                   ^|
echo ^| Environment Variables Configuration   ^|
echo ========================================
echo.
echo Your Deployment URL: !VERCEL_URL!
echo Your API URL: !API_URL!
echo.
echo REQUIRED STEPS:
echo.
echo 1. Go to https://vercel.com/dashboard
echo 2. Click on 'pethive-psi' project
echo 3. Go to Settings ^> Environment Variables
echo.
echo 4. Add the following environment variables:
echo.
echo    [REQUIRED] VITE_API_URL
echo    Value: !API_URL!
echo    Environment: Production
echo.
echo    [REQUIRED] CLIENT_URL
echo    Value: !VERCEL_URL!
echo    Environment: Production
echo.
echo    [REQUIRED] DATABASE_URL
echo    Value: ^<YOUR_POSTGRES_URL^>
echo    Get from: Vercel Postgres, Neon, or Supabase
echo    Environment: Production
echo.
echo    [REQUIRED] SESSION_SECRET
echo    Value: ^<RANDOM_SECURE_STRING^>
echo    Can use: openssl rand -base64 32
echo    Environment: Production
echo.
echo    [OPTIONAL] NODE_ENV
echo    Value: production
echo    Environment: Production
echo.
echo 5. After adding all variables, go to Deployments tab
echo    and click the 3-dot menu ^> Redeploy
echo.
echo 6. Wait for deployment to complete
echo.
echo 7. Test the deployment:
echo    - Visit: !API_URL!
echo    - Visit: !VERCEL_URL!/health
echo.
echo If you still see 404, check:
echo   - Vercel build logs for errors
echo   - All environment variables are set to "Production"
echo   - Database URL is correct
echo.
