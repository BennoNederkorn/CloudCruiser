import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchService } from './SearchService';
import { ApifyService } from './ApifyService';
import { ISearchProvider, IScraperProvider } from './types';
import { Pipeline } from './Pipeline';

// Mock fetch globally
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('SearchService', () => {
    let searchService: ISearchProvider;
    const apiKey = 'test-api-key';

    beforeEach(() => {
        fetchMock.mockReset();
        searchService = new SearchService(apiKey);
    });

    it('should return formatted search results from Serper.dev', async () => {
        const mockResponse = {
            organic: [
                {
                    title: 'Iulia Pasov - LinkedIn',
                    link: 'https://www.linkedin.com/in/iuliapasov',
                    snippet: 'View Iulia Pasov’s profile on LinkedIn...',
                },
                {
                    title: 'Iulia Pasov (@iuliapasov) • Instagram photos',
                    link: 'https://www.instagram.com/iuliapasov/',
                    snippet: 'See Instagram photos and videos from Iulia Pasov...',
                }
            ]
        };

        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const results = await searchService.search('Iulia Pasov');

        expect(fetchMock).toHaveBeenCalledWith('https://google.serper.dev/search', expect.objectContaining({
            method: 'POST',
            headers: {
                'X-API-KEY': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ q: 'Iulia Pasov' })
        }));

        expect(results).toHaveLength(2);
        expect(results[0].source).toBe('linkedin');
        expect(results[1].source).toBe('instagram');
    });
});

describe('ApifyService', () => {
    let scraperService: IScraperProvider;
    const apiKey = 'test-apify-key';

    beforeEach(() => {
        fetchMock.mockReset();
        scraperService = new ApifyService(apiKey);
    });

    it('should trigger actor and return dataset items', async () => {
        // 1. Start Actor
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: { id: 'run-123' } })
        });

        // 2. Poll (Running -> Succeeded)
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: { status: 'RUNNING' } })
        });
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: { status: 'SUCCEEDED', defaultDatasetId: 'dataset-123' } })
        });

        // 3. Fetch Dataset
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ([{ profilePicUrl: 'http://img.jpg' }])
        });

        const result = await scraperService.scrape('https://instagram.com/test');

        expect(fetchMock).toHaveBeenCalledTimes(4);
        expect(result).toEqual([{ profilePicUrl: 'http://img.jpg' }]);
    });
});

describe('Pipeline', () => {
    it('should delegate all scraping to Apify', async () => {
        const pipeline = new Pipeline({
            serperApiKey: 'key',
            apifyApiKey: 'key',
            geminiApiKey: 'key'
        });

        // 1. Search (returns 1 LinkedIn, 1 Instagram, 1 Twitter)
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                organic: [
                    { link: 'http://linkedin.com/in/test' },
                    { link: 'http://instagram.com/test' },
                    { link: 'http://twitter.com/test' }
                ]
            })
        });

        // 2. Scrape LinkedIn (Apify)
        fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ data: { id: 'run-li' } }) });
        fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ data: { status: 'SUCCEEDED', defaultDatasetId: 'd-li' } }) });
        fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ([{ profilePic: 'http://li.jpg' }]) });

        // 3. Scrape Instagram (Apify)
        fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ data: { id: 'run-ig' } }) });
        fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ data: { status: 'SUCCEEDED', defaultDatasetId: 'd-ig' } }) });
        fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ([{ profilePicUrl: 'http://ig.jpg' }]) });

        // 4. Scrape Twitter (Apify)
        fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ data: { id: 'run-tw' } }) });
        fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ data: { status: 'SUCCEEDED', defaultDatasetId: 'd-tw' } }) });
        fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ([{ profile_image_url_https: 'http://tw.jpg' }]) });

        // 5. Analyze (Image Fetch x3 -> Gemini)
        fetchMock.mockResolvedValueOnce({ ok: true, arrayBuffer: async () => new ArrayBuffer(8), headers: { get: () => 'image/jpeg' } });
        fetchMock.mockResolvedValueOnce({ ok: true, arrayBuffer: async () => new ArrayBuffer(8), headers: { get: () => 'image/jpeg' } });
        fetchMock.mockResolvedValueOnce({ ok: true, arrayBuffer: async () => new ArrayBuffer(8), headers: { get: () => 'image/jpeg' } });

        // Gemini
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ candidates: [{ content: { parts: [{ text: 'Final Report' }] } }] })
        });

        const result = await pipeline.run('Target');

        expect(result).toBe('Final Report');
    });
});
