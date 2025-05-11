@echo off
echo Starting development environment for ChatBot with Ollama...

REM Check if a model was specified
if "%1"=="" (
    echo Using default model gemma3:1b
    set MODEL=gemma3:1b
) else (
    echo Using model: %1
    set MODEL=%1
)

REM Pull the model first
echo Making sure model %MODEL% is available...
docker-compose -f docker-compose.dev.yml run --rm ollama ollama pull %MODEL%

REM Set environment variable and start in development mode
echo Starting development environment...
set OLLAMA_MODEL=%MODEL%
docker-compose -f docker-compose.dev.yml up

echo Development environment stopped. 