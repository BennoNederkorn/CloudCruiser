import { IAnalyzer } from './types';
import { Buffer } from 'node:buffer';

export class GeminiService implements IAnalyzer {
    private apiKey: string;
    private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async analyzeImages(imageUrls: string[]): Promise<string> {
        if (imageUrls.length === 0) return 'No images to analyze.';

        console.log(`DEBUG: Fetching ${imageUrls.length} images for analysis...`);

        const imageParts = await Promise.all(imageUrls.map(async (url) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.warn(`Failed to fetch image ${url}: ${response.statusText}`);
                    return null;
                }
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const base64 = buffer.toString('base64');
                const mimeType = response.headers.get('content-type') || 'image/jpeg';

                console.log(`DEBUG: Fetched image. Type: ${mimeType}, Size: ${buffer.length} bytes`);

                return {
                    inlineData: {
                        data: base64,
                        mimeType: mimeType
                    }
                };
            } catch (e) {
                console.error(`Failed to process image ${url}:`, e);
                return null;
            }
        }));

        const validParts = imageParts.filter(p => p !== null);

        if (validParts.length === 0) {
            return "Failed to retrieve any images for analysis.";
        }

        console.log(`DEBUG: Sending ${validParts.length} images to Gemini.`);

        const payload = {
            contents: [{
                parts: [
                    { text: "Analyze these profile images. Describe the person, the context, and any notable details." },
                    ...validParts
                ]
            }]
        };

        const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`DEBUG: Gemini API Error. Status: ${response.status}, Body: ${errText}`);
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No analysis generated.';
    }
}
