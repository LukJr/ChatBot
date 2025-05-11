#!/bin/bash

# Development mode script for chatbot with Ollama

# Check if Ollama model is specified
if [ -z "$1" ]; then
  echo "Using default model gemma3" #gemma3:1b"
  MODEL="gemma3"
else
  MODEL=$1
  echo "Using model: $MODEL"
fi

# Pull the model first in case it doesn't exist
echo "Making sure model $MODEL is available..."
docker-compose -f docker-compose.dev.yml run --rm ollama ollama pull $MODEL

# Set environment variable and start in development mode
echo "Starting development environment..."
OLLAMA_MODEL=$MODEL docker-compose -f docker-compose.dev.yml up

# This will show logs in real-time and allow you to edit files with hot-reloading 