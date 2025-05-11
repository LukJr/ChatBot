# Next.js Chatbot with Ollama Integration

This project is a simple chatbot that integrates with Ollama to provide AI-powered responses.

## Features

- Chat interface with Ollama LLM models
- Support for conversation context
- Docker setup for easy deployment
- Ability to pass JSON data for context
- Static configuration for Ollama models
- Automatic model downloading on startup
- Uses Gemma3 1B (~815MB) for efficient operation
- Development mode with hot reloading

## Prerequisites

- Docker and Docker Compose
- Node.js and npm (for local development)

## Getting Started

### Downloading Models Manually

If you're experiencing issues with automatic model downloading, you can download models manually:

#### On Windows:
```cmd
# Use the provided batch file
download-model.bat gemma3:1b
```

#### On Linux/Mac:
```bash
# Use curl directly
curl -X POST http://localhost:11434/api/pull -H "Content-Type: application/json" -d '{"name":"gemma3:1b"}'
```

### Using Convenience Scripts

The project includes scripts to make running the app easier:

#### Development Mode (Linux/Mac)
```bash
# Make the script executable (first time only)
chmod +x scripts/dev.sh

# Run with default model (gemma3:1b)
./scripts/dev.sh

# Or specify a different model
./scripts/dev.sh tinyllama:1.1b
```

#### Development Mode (Windows)
```cmd
# Run with default model (gemma3:1b)
dev-windows.bat

# Or specify a different model
dev-windows.bat tinyllama:1.1b
```

#### Production Mode (Linux/Mac)
```bash
# Make the script executable (first time only)
chmod +x scripts/prod.sh

# Run with default model (gemma3:1b)
./scripts/prod.sh

# Or specify a different model
./scripts/prod.sh mistral
```

#### Production Mode (Windows)
```cmd
# Run with default model
docker-compose up -d

# Or specify a different model
set OLLAMA_MODEL=mistral
docker-compose up -d
```

### Running with Docker (Production)

1. Clone this repository
2. Run the application with Docker Compose:

```bash
docker-compose up -d
```

3. Wait for the initialization to complete (the Gemma3 1B model will be automatically downloaded, ~815MB)
4. Access the application at http://localhost:3000

The Docker setup includes an initialization container that automatically downloads the Gemma3 1B model when the application starts for the first time. You don't need to manually pull the model.

### Development Mode with Docker

For development with hot reloading (changes are applied as you edit files):

#### On Linux/Mac:
```bash
docker-compose -f docker-compose.dev.yml up
```

#### On Windows:
```cmd
# Use the provided batch file
dev-windows.bat

# Or run directly with Docker Compose
docker-compose -f docker-compose.dev.yml up
```

Make changes to your Next.js app files, and they will automatically be applied. Access the application at http://localhost:3000 and view logs in real-time as you develop.

This development setup mounts your local directory to the container, so any changes you make to your code will be immediately reflected in the running application.

#### Troubleshooting Windows Development

If you experience issues with file change detection on Windows:

1. The development setup uses polling to detect file changes on Windows
2. Changes might take a few seconds longer to be detected than on Linux/Mac
3. If changes aren't being detected, try restarting the containers:
   ```cmd
   docker-compose -f docker-compose.dev.yml down
   docker-compose -f docker-compose.dev.yml up
   ```

#### Troubleshooting Model Loading

If you're experiencing "model not found" errors:

1. Make sure Ollama is running
2. Download the model manually using the provided batch file:
   ```cmd
   download-model.bat gemma3:1b
   ```
3. Check available models:
   ```cmd
   curl http://localhost:11434/api/tags
   ```

## Configuration

The Ollama integration is configured in `app/config/ollama.ts`. You can modify this file to change settings:

```typescript
// Default configuration for Ollama
const ollamaConfig: OllamaConfig = {
  // The default model to use
  model: process.env.OLLAMA_MODEL || "gemma3:1b", // Change to your preferred model (e.g., "mistral", "llama3")
  
  // The host URL for Ollama API
  host: process.env.OLLAMA_HOST || "http://ollama:11434"
};
```

You can also change the model by setting the `OLLAMA_MODEL` environment variable when starting the application:

```bash
# Linux/Mac
OLLAMA_MODEL=mistral docker-compose up -d

# Windows
set OLLAMA_MODEL=mistral
docker-compose up -d
```

This will automatically download the specified model on startup.

### Available models and sizes

Some popular models and their approximate sizes:
- `gemma3:1b` - 815MB (default, good balance of size and capability)
- `llama3:8b` - 4.7GB
- `mistral:7b` - 4.1GB
- `tinyllama:1.1b` - 700MB (smallest option)

For a full list of models: https://ollama.com/library

## Development

### Local Development (without Docker)

To run the application locally without Docker:

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Make sure Ollama is running locally and accessible

## Adding Custom Context or Vector Search

The API route is set up to accept context data. You can modify `app/api/chat/route.ts` to include additional processing for vector search or custom context.

## License

[Add your license information here]

