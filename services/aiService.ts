
import { GoogleGenAI } from "@google/genai";

// Gemini models are used instead of local LLMs for production reliability and reasoning quality.
// The SDK @google/genai is used following the official developer guidelines.

export const initAI = async (onProgress?: (progress: number) => void) => {
  // Gemini API is cloud-based and doesn't require local model loading.
  // We simulate immediate completion to maintain UI compatibility with LegalAI and VoiceCopilot components.
  if (onProgress) {
    onProgress(100);
  }
  return true;
};

export const getLegalAdvice = async (query: string, lang: string, onProgress?: (p: number) => void) => {
  // Simulate immediate initialization progress for UI feedback.
  if (onProgress) onProgress(100);
  
  // Always initialize with the pre-configured API_KEY from environment variables.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use gemini-3-pro-preview for complex reasoning tasks like legal consultation.
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: query,
    config: {
      systemInstruction: `És o "Vigilante Pro", um assistente jurídico especializado no Código da Estrada (Portugal, Espanha, Reino Unido). 
      Língua de resposta: ${lang}. 
      Regras: Sê técnico mas acessível. Cita artigos se possível. 
      Contexto: O utilizador pode estar a contestar uma multa ou a pedir esclarecimentos sobre condução.`,
    },
  });

  // Returns extracted text property from GenerateContentResponse.
  return response.text || "Não foi possível obter resposta legal no momento.";
};

export const processVoiceCopilot = async (command: string, context: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use gemini-3-flash-preview for high-speed, low-latency conversational responses.
  const prompt = `Condutor: "${command}". Local: ${context.location}. Clima: ${context.weather?.condition || 'Desconhecido'}. 
  Responde como um copiloto rápido (máx 12 palavras).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text || "Entendido.";
};
