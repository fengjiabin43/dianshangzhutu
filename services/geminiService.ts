
import { GoogleGenAI } from "@google/genai";
import { RETOUCH_PROMPT } from "../constants";

export const retouchImage = async (base64Image: string, mimeType: string, apiKey: string): Promise<string> => {
  if (!apiKey.trim()) {
    throw new Error("API Key is missing. Please enter your Gemini API key.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Extract base64 data (strip prefix)
  const dataOnly = base64Image.split(",")[1];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: dataOnly,
            mimeType: mimeType,
          },
        },
        {
          text: RETOUCH_PROMPT,
        },
      ],
    },
  });

  if (!response.candidates || response.candidates.length === 0) {
    throw new Error("No response generated from the model.");
  }

  // Iterate through parts to find the image data
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("The model did not return an image part in its response.");
};
