import { NextResponse } from 'next/server';
import ollamaConfig from '../../config/ollama';
import { getRelevantDocumentContext } from '@/utils/document-context';

interface OllamaModel {
  name: string;
  [key: string]: any;
}

interface OllamaModelList {
  models?: OllamaModel[];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, contextData } = body;
    
    // Get configuration from the static config
    const { host, model } = ollamaConfig;
    
    console.log(`Attempting to communicate with Ollama at ${host} using model ${model}`);
    
    // Search for relevant document context based on the user's message
    const documentContext = getRelevantDocumentContext(message);
    console.log(`Document context found: ${documentContext !== "No relevant information found in the documents."}`);
    if (documentContext !== "No relevant information found in the documents.") {
      console.log(`Document context: ${documentContext.substring(0, 300)}...`);
    }
    
    // Create a system prompt that emphasizes using document content directly
    const systemPrompt = `Tu esi izpalīdzīgs asistents Rīgas iedzīvotājiem. 

Kad atbildi uz jautājumiem, izmanto TIKAI informāciju, kas sniegta dokumentu izvilkumos (ENTRY sekcijās). 
Nekad neizdomā informāciju vai neatbildi ar "Man nav šādas informācijas", ja tev ir pieejama atbilde dokumentos.

Ja tev ir sniegta informācija ar ENTRY sekcijām, tad izmanto Answer lauku, lai atbildētu uz jautājumu.
Ja dokumentu izvilkumos nav attiecīgās informācijas, tikai tad atbildi: "Man nav šādas informācijas manos dokumentos."

Atbildi tajā pašā valodā, kurā uzdots lietotāja jautājums.`;
    
    // Create a prompt that includes document context if available
    let userMessage = message;
    const messages = [];
    
    // Add system prompt
    messages.push({ role: "system", content: systemPrompt });
    
    // Add document context if available
    if (documentContext && documentContext !== "No relevant information found in the documents.") {
      userMessage = `Mans jautājums ir: "${message}"

Lūdzu, atbildi uz manu jautājumu, izmantojot TIKAI šo informāciju no oficiāliem dokumentiem:

${documentContext}

Izmanto tikai augstāk minēto informāciju. Neizdomā un nepievieno nekādas detaļas, kas nav atrodamas šajā sniegtajā informācijā.`;
      
      console.log('Enhanced prompt with document context');
    }
    
    // Add user message
    messages.push({ role: "user", content: userMessage });
    
    // First try the /api/chat endpoint (newer Ollama versions)
    try {
      console.log(`Trying /api/chat endpoint...`);
      console.log(`Sending messages: ${JSON.stringify(messages)}`);
      
      const chatResponse = await fetch(`${host}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          stream: false,
          context: contextData || undefined,
        }),
      });
      
      if (chatResponse.ok) {
        const data = await chatResponse.json();
        console.log(`Chat endpoint successful, response:`, data);
        return NextResponse.json({
          response: data.message?.content || "No response content",
          context: data.context,
          usedDocumentContext: documentContext !== "No relevant information found in the documents."
        });
      } else {
        console.log(`Chat endpoint failed with status: ${chatResponse.status}`);
      }
    } catch (chatError) {
      console.error(`Error with /api/chat endpoint:`, chatError);
    }
    
    // If chat endpoint failed, try the /api/generate endpoint (older Ollama versions)
    console.log(`Trying /api/generate endpoint...`);
    
    // Format messages for legacy generate endpoint
    const legacyPrompt = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');
    
    const generateResponse = await fetch(`${host}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: legacyPrompt,
        stream: false,
        context: contextData || undefined,
      }),
    });
    
    if (!generateResponse.ok) {
      // Try one more option - list available models to check if Ollama is working
      try {
        const modelListResponse = await fetch(`${host}/api/tags`, {
          method: 'GET',
        });
        
        if (modelListResponse.ok) {
          const models: OllamaModelList = await modelListResponse.json();
          console.log(`Available models:`, models);
          const modelNames = models.models?.map((m: OllamaModel) => m.name) || [];
          throw new Error(`Model ${model} might not be available. Available models: ${JSON.stringify(modelNames)}`);
        }
      } catch (modelListError) {
        console.error(`Error checking available models:`, modelListError);
      }
      
      throw new Error(`Ollama API error: ${generateResponse.status}. Make sure the model "${model}" is downloaded.`);
    }
    
    const data = await generateResponse.json();
    console.log(`Generate endpoint successful, response:`, data);
    
    return NextResponse.json({
      response: data.response,
      context: data.context,
      usedDocumentContext: documentContext !== "No relevant information found in the documents."
    });
    
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: `Failed to communicate with the LLM service: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
} 