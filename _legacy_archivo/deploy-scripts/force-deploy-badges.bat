@echo off
echo ============================================
echo  FORZAR DEPLOY EN NETLIFY - FutPro 2.0
echo ============================================
echo.

echo [1/4] Verificando cambios locales...
git status --short
echo.

echo [2/4] Creando commit vacio para forzar rebuild...
git commit --allow-empty -m "chore: forzar rebuild Netlify - badges homepage"
echo.

echo [3/4] Pusheando a origin/master...
git push origin master
echo.

echo [4/4] Deploy iniciado en Netlify
echo.
echo Monitorea el progreso en:
echo https://app.netlify.com/sites/futpro/deploys
echo.
echo Espera 2-3 minutos y ejecuta:
echo   node testing/validate-deploy-auto.cjs
echo.
echo ============================================
pause
