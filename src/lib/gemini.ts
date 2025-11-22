import { GoogleGenAI } from "@google/genai";

// Initialize the client
// WARNING: In a real production app, call this from a backend to hide your API Key.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });

export const convertUrlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export async function generateNanoBananaImage(
  userImageUrl: string, 
  userInfo: { location: string; time: string; role: string; enviroment: string }
) {
    // 0. Convert the user image URL to Base64
  const userImageBase64 = await convertUrlToBase64(userImageUrl);
  
  // 1. Construct the prompt dynamically
  const promptText = `Create a Backgound for the attached image. 
  Context: The vehicle is located in ${userInfo.location} at ${userInfo.time}.
  The driver is ${userInfo.role}. The enviroment should be ${userInfo.enviroment}.
  Style: Realistic.
  Use the composition of the attached image as a reference.`;

  const prompt = [
    { text: promptText },
    {
      inlineData: {
        mimeType: "image/png",
        data: userImageBase64,
      },
    },
  ];

  // 2. Call the API
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
  });

  // 3. Extract and return the Base64 image string
  // The SDK structure usually places the image in parts -> inlineData
  const part = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
  
  if (part && part.inlineData) {
    return part.inlineData.data; // This is the base64 string
  } else {
    throw new Error("No image generated");
  }
}