import { SearchService } from '../src/lib/pipeline/SearchService';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

async function testSearches() {
    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
        console.error('No SERPER_API_KEY found in .env');
        return;
    }

    const service = new SearchService(apiKey);
    const queries = [
        'Iulia Pasov LinkedIn',
        'Iulia Pasov Instagram',
        'Iulia Pasov X'
    ];

    console.log('Testing Search Queries...\n');

    for (const query of queries) {
        console.log(`--- Query: "${query}" ---`);
        try {
            const results = await service.search(query);
            if (results.length === 0) {
                console.log('No results found.');
            } else {
                results.slice(0, 3).forEach((r, i) => {
                    console.log(`[${i + 1}] ${r.title}`);
                    console.log(`    Link: ${r.link}`);
                    console.log(`    Source: ${r.source}`);
                });
            }
        } catch (error) {
            console.error(`Error searching for "${query}":`, error);
        }
        console.log('\n');
    }
}

testSearches();
