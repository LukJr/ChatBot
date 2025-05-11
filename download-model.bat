@echo off
echo Ollama Model Downloader

REM Check if a model was specified
if "%1"=="" (
    echo Usage: download-model.bat MODEL_NAME
    echo Example: download-model.bat gemma3:1b
    exit /b 1
)

set MODEL=%1
echo Downloading model: %MODEL%

REM Wait for Ollama to be ready
echo Checking if Ollama is running...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Ollama is not running! Please start Ollama first.
    exit /b 1
)

echo Ollama is running. Downloading model...
curl -X POST http://localhost:11434/api/pull -H "Content-Type: application/json" -d "{\"name\":\"%MODEL%\"}"

echo.
echo Done! You can now use model: %MODEL% 