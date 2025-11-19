
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateJobDescription = async (role: string, requirements: string): Promise<string> => {
  try {
    const prompt = `Crie uma descrição de vaga de emprego detalhada e atraente para a posição de ${role}. Requisitos: ${requirements}. A descrição deve ser profissional, clara e incluir responsabilidades, qualificações e benefícios. Formate a resposta em markdown.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating job description:", error);
    return "Não foi possível gerar a descrição da vaga. Tente novamente.";
  }
};

export const summarizeResume = async (resumeText: string): Promise<string> => {
  try {
    const prompt = `Resuma o seguinte currículo em 3 pontos principais, destacando as experiências e habilidades mais relevantes. Currículo: """${resumeText}"""`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing resume:", error);
    return "Não foi possível resumir o currículo.";
  }
};

export const generatePerformanceFeedback = async (employeeName: string, role: string, performanceData: string): Promise<string> => {
  try {
    const prompt = `Gere um feedback construtivo para a avaliação de desempenho de ${employeeName}, que atua como ${role}. Dados de desempenho: "${performanceData}". O feedback deve ser equilibrado, destacando pontos fortes e áreas para desenvolvimento, com sugestões de melhoria claras e acionáveis.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating performance feedback:", error);
    return "Não foi possível gerar o feedback de desempenho.";
  }
};

export const getAIAssistantResponse = async (question: string): Promise<string> => {
    try {
        const prompt = `Você é um assistente de RH. Responda à seguinte pergunta de forma clara e concisa: "${question}"`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting AI assistant response:", error);
        return "Desculpe, não consegui processar sua pergunta no momento.";
    }
};
