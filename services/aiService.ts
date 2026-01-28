
import * as webllm from "@mlc-ai/web-llm";

let engine: webllm.MLCEngine | null = null;
const modelId = "Phi-3-mini-4k-instruct-q4f16_1-MLC";

export const initAI = async (onProgress?: (progress: number) => void) => {
  if (engine) return engine;

  if (!("gpu" in navigator)) {
    throw new Error("O seu navegador não suporta WebGPU. Use um navegador moderno (Chrome/Edge).");
  }

  engine = await webllm.CreateMLCEngine(modelId, {
    initProgressCallback: (report) => {
      if (onProgress) onProgress(Math.floor(report.progress * 100));
      console.log("AI Init:", report.text);
    },
  });

  return engine;
};

export const getLegalAdvice = async (query: string, lang: string, onProgress?: (p: number) => void) => {
  const ai = await initAI(onProgress);
  
  const systemPrompt = `És o "Vigilante Pro", um assistente jurídico local e privado especializado no Código da Estrada. 
  Língua: ${lang}. Responde de forma técnica mas breve.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: query },
  ];

  const reply = await ai.chat.completions.create({ messages });
  return reply.choices[0].message.content || "Sem resposta.";
};

export const processVoiceCopilot = async (command: string, context: any) => {
  const ai = await initAI();
  const prompt = `Condutor: "${command}". Local: ${context.location}. Clima: ${context.weather.condition}. 
  Responde como um copiloto rápido (máx 12 palavras).`;

  const messages = [{ role: "user", content: prompt }];
  const reply = await ai.chat.completions.create({ messages });
  return reply.choices[0].message.content || "Entendido.";
};
