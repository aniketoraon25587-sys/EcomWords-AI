import { GoogleGenAI, GenerateContentResponse, Part, Type } from '@google/genai';
import { type GenerationOptions, type GeneratedContent, DescriptionLength } from '../types';

export const generateListing = async (options: GenerationOptions): Promise<GeneratedContent> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const descriptionInstruction = options.descriptionLength === DescriptionLength.SHORT
    ? 'Create a short, concise, and punchy product description (around 50-100 words).'
    : 'Create a long, detailed, SEO-rich product description that is engaging and persuasive (around 200-300 words).';

  const prompt = `
    You are an expert e-commerce copywriter specializing in creating high-conversion, SEO-optimized product listings.

    Your task is to generate a complete product listing based on the user's input.

    **Product Details:**
    *   **Name:** ${options.productName}
    *   **Key Features/Description:** ${options.features || 'Not provided. Rely on product name and image if available.'}

    **Listing Requirements:**
    *   **Platform:** ${options.template}
    *   **Tone of Voice:** ${options.tone}
    *   **Language:** ${options.language}

    **IMPORTANT INSTRUCTIONS:**
    1.  Generate 5-10 high-click-through product titles.
    2.  ${descriptionInstruction}
    3.  Write 3-5 key feature bullet points, formatted appropriately for the selected platform. (e.g., Amazon bullets are benefit-driven).
    4.  List highly searched SEO keywords and meta tags relevant to the product.
    5.  You MUST provide the output in a valid JSON format. Do not include any text, markdown, or code block syntax outside of the JSON object. The JSON object must be the only thing you output.
  `;

  const modelName = options.image ? 'gemini-2.5-flash-image' : 'gemini-2.5-flash';
  const parts: Part[] = [{ text: prompt }];

  if (options.image) {
    const mimeType = options.image.match(/data:(image\/\w+);base64,/)?.[1];
    if (!mimeType) {
      throw new Error('Invalid image format. Could not determine MIME type.');
    }
    const data = options.image.replace(/^data:image\/\w+;base64,/, '');

    parts.unshift({
      text: "Analyze the following product image and use it as the primary source of information for generating the product listing. The user's text input should supplement the image details.\n\n"
    }, {
      inlineData: {
        mimeType,
        data,
      },
    });
  }

  try {
    // FIX: Conditionally set config for JSON output as it's not supported by image models.
    const config: any = {
        temperature: 0.7,
    };

    if (modelName !== 'gemini-2.5-flash-image') {
        config.responseMimeType = "application/json";
        config.responseSchema = {
          type: Type.OBJECT,
          properties: {
            titles: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING },
            bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["titles", "description", "bullets", "keywords"],
        };
    }
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: { parts: parts },
      config,
    });

    // FIX: Handle potentially empty response and strip markdown fences from JSON.
    const text = response.text;
    if (!text) {
        throw new Error("The AI model returned an empty response.");
    }
    
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
        jsonText = jsonText.substring(7);
        if (jsonText.endsWith('```')) {
            jsonText = jsonText.slice(0, -3);
        }
    }

    return JSON.parse(jsonText.trim()) as GeneratedContent;
  } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw new Error("Failed to get a valid response from the AI model.");
  }
};