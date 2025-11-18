@echo off
cd /d %~dp0
npx jest --config jest.frontend.config.cjs --runInBand --verbose %*
pause
