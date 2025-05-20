export interface OllamaConfig {
  model: string;
  host: string;
}

// Default configuration for Ollama
const ollamaConfig: OllamaConfig = {
  // The default model to use - override with OLLAMA_MODEL env var
  model: process.env.OLLAMA_MODEL || "gemma3:latest",
  
  // The host URL for Ollama API
  host: process.env.OLLAMA_HOST || "http://ollama:11434"
};

export default ollamaConfig; 