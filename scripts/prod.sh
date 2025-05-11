#!/bin/bash

# Production mode script for chatbot with Ollama

# Check if Ollama model is specified
if [ -z "$1" ]; then
  echo "Using default model gemma3"
  MODEL="gemma3"
else
  MODEL=$1
  echo "Using model: $MODEL"
fi

# Start in production mode with the selected model
echo "Starting production environment with model $MODEL..."
OLLAMA_MODEL=$MODEL docker-compose up -d

echo "Application started in background. Access at http://localhost:3000"
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down" 