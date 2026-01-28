
import { GoogleGenAI } from "@google/genai";

// This service is configured to use the official @google/genai SDK following developer standards.

export const getLegalAdvice = async (query: string, lang: string) => {
  // Create a new GoogleGenAI instance using the required apiKey parameter from environment variables.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: query,
    config: {
      systemInstruction: `És o "Vigilante Legal", um assistente jurídico especializado no Código da Estrada (Portugal, Espanha, Reino Unido). 
      Língua de resposta: ${lang}. 
      Regras: Sê técnico mas acessível. Cita artigos se possível. 
      Contexto: O utilizador pode estar a contestar uma multa ou a pedir esclarecimentos sobre condução.`,
      temperature: 0.7,
    },
  });

  // Correctly access the .text property instead of calling a text() method.
  return response.text || "Não foi possível obter resposta legal no momento.";
};

export const processVoiceCopilot = async (command: string, context: { location: any, weather: any, alerts: any }) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Comando de voz do condutor: "${command}".
  Contexto atual:
  - Localização: ${JSON.stringify(context.location)}
  - Clima: ${JSON.stringify(context.weather)}
  - Alertas próximos: ${JSON.stringify(context.alerts)}
  
  Responde como um copiloto inteligente. Sê extremamente breve (máximo 15 palavras). 
  Se houver perigo, avisa imediatamente. Se não houver radares, confirma.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text || "Copiloto indisponível.";
};
