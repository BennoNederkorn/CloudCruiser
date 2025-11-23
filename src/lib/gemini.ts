import { GoogleGenAI } from "@google/genai";
import { cn } from "./utils";

// Initialize the client
// WARNING: In a real production app, call this from a backend to hide your API Key.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });

export async function generateNanoBananaImage(
  imageUrl: string,
  userInfo: { location: string; time: string; role: string; enviroment: string }
) {
  // We now call OUR local server, not Gemini directly
  const response = await fetch("http://localhost:3000/api/generate-background", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageUrl, // We send the URL, the server handles the fetch
      userInfo,
    }),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to generate image");
  }

  return data.image; // Returns the Base64 string
}