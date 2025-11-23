import { ISearchProvider, SearchResult } from './types';

export class SearchService implements ISearchProvider {
    private apiKey: string;
    private baseUrl = 'https://google.serper.dev/search';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async search(query: string): Promise<SearchResult[]> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'X-API-KEY': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ q: query })
            });

            if (!response.ok) {
                throw new Error(`Serper API error: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.organic) {
                return [];
            }

            return data.organic.map((item: any) => ({
                title: item.title,
                link: item.link,
                snippet: item.snippet,
                source: this.detectSource(item.link)
            }));
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Unknown error occurred during search');
        }
    }

    private detectSource(link: string): SearchResult['source'] {
        if (link.includes('linkedin.com')) return 'linkedin';
        if (link.includes('instagram.com')) return 'instagram';
        if (link.includes('twitter.com') || link.includes('x.com')) return 'twitter';
        return 'unknown';
    }
}
