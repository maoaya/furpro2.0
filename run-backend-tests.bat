@echo off
cd /d %~dp0
npx jest --config jest.backend.config.cjs --runInBand --verbose %*
pause
