import { Pipeline } from '../src/lib/pipeline/Pipeline';
import { PipelineConfig } from '../src/lib/pipeline/types';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
dotenv.config({ path: resolve(process.cwd(), '.env') });

async function main() {
    const target = process.argv[2];
    if (!target) {
        console.error('Please provide a target name (e.g., "Iulia Pasov")');
        process.exit(1);
    }

    const config: PipelineConfig = {
        serperApiKey: process.env.SERPER_API_KEY!,
        apifyApiKey: process.env.APIFY_API_KEY!,
        phantombusterApiKey: process.env.PHANTOMBUSTER_API_KEY!,
        geminiApiKey: process.env.GEMINI_API_KEY!
    };

    if (!config.serperApiKey || !config.phantombusterApiKey) {
        console.error('Missing required API keys in .env file');
        process.exit(1);
    }

    const pipeline = new Pipeline(config);

    try {
        const result = await pipeline.run(target);
        console.log('\n-----------------------------------');
        console.log('Analysis Result:');
        console.log('-----------------------------------');
        console.log(result);
    } catch (error) {
        console.error('Pipeline failed:', error);
    }
}

main();
