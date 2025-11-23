import { IScraperProvider } from './types';

export class ApifyService implements IScraperProvider {
    private apiKey: string;
    private baseUrl = 'https://api.apify.com/v2';
    private instagramActorId = 'apify/instagram-scraper';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async scrape(profileUrl: string): Promise<any> {
        // Only handle Instagram URLs
        if (!profileUrl.includes('instagram.com')) {
            throw new Error(`ApifyService only handles Instagram URLs. Got: ${profileUrl}`);
        }

        console.log(`Apify: Scraping Instagram ${profileUrl}...`);

        // 1. Start Actor Run
        const run = await this.startInstagramActor(profileUrl);

        if (!run) {
            console.log(`Apify: Failed to start Instagram scraper`);
            return null;
        }

        // 2. Poll for finish
        const finishedRun = await this.waitForRun(run.id);

        if (finishedRun.status === 'SKIPPED') return null;

        // 3. Fetch Dataset
        const dataset = await this.fetchDataset(finishedRun.defaultDatasetId);
        console.log(`Apify: Instagram scraping complete`);
        return dataset;
    }

    private async startInstagramActor(url: string): Promise<any> {
        const input = {
            directUrls: [url],
            resultsType: "details"
        };

        const validActorId = this.instagramActorId.replace('/', '~');
        const apiUrl = `${this.baseUrl}/acts/${validActorId}/runs?token=${this.apiKey}`;

        console.log(`Apify: Starting Instagram actor via ${apiUrl}`);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input)
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`Apify: Failed to start actor. Status: ${response.status}, Body: ${errText}`);

            if (response.status === 404) {
                console.warn(`Apify: Instagram actor not found. Skipping.`);
                return null;
            }

            throw new Error(`Failed to start Apify Instagram actor: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Apify: Started actor run: ${data.data.id}`);
        return data.data;
    }

    private async waitForRun(runId: string): Promise<any> {
        if (!runId) return { status: 'SKIPPED' };

        let run;
        do {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
            const response = await fetch(`${this.baseUrl}/actor-runs/${runId}?token=${this.apiKey}`);
            const data = await response.json();
            run = data.data;
        } while (run.status === 'RUNNING' || run.status === 'READY');

        if (run.status !== 'SUCCEEDED') {
            throw new Error(`Apify run failed with status: ${run.status}`);
        }

        return run;
    }

    private async fetchDataset(datasetId: string): Promise<any> {
        const response = await fetch(`${this.baseUrl}/datasets/${datasetId}/items?token=${this.apiKey}`);
        if (!response.ok) throw new Error('Failed to fetch Apify dataset');
        return response.json();
    }
}
