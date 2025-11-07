@echo off
echo Ejecutando test de SeleccionCategoria...
npx jest -c jest.frontend.config.cjs src/pages/__tests__/SeleccionCategoria.test.jsx --runInBand --no-coverage --verbose 2>&1
echo.
echo Test completado - Exit code: %ERRORLEVEL%
