import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Pipeline } from './Pipeline';

// Mock fetch globally
const fetchMock = vi.fn();
global.fetch = fetchMock;

// Mock the service modules with explicit factories
vi.mock('./PhantombusterService', () => ({
    PhantombusterService: vi.fn()
}));
vi.mock('./ApifyService', () => ({
    ApifyService: vi.fn()
}));

// Import the mocked classes to configure them
import { PhantombusterService } from './PhantombusterService';
import { ApifyService } from './ApifyService';

describe('Pipeline Integration', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        fetchMock.mockReset();
    });

    it('should delegate Instagram to Apify and others to Phantombuster', async () => {
        // Configure the mock implementations
        // @ts-ignore
        PhantombusterService.mockImplementation(() => ({
            scrape: vi.fn().mockResolvedValue([{ img: 'http://li.jpg' }])
        }));

        // @ts-ignore
        ApifyService.mockImplementation(() => ({
            scrape: vi.fn().mockResolvedValue([{ profilePicUrl: 'http://ig.jpg' }])
        }));

        const pipeline = new Pipeline({
            serperApiKey: 'key',
            phantombusterApiKey: 'key',
            apifyApiKey: 'key',
            geminiApiKey: 'key'
        });

        // 1. Search (using global fetch mock)
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                organic: [
                    { link: 'http://linkedin.com/in/test' },
                    { link: 'http://instagram.com/test' }
                ]
            })
        });

        // 2. Analyze (Image Fetch x2 -> Gemini)
        // Fetch images
        fetchMock.mockResolvedValueOnce({ ok: true, arrayBuffer: async () => new ArrayBuffer(8), headers: { get: () => 'image/jpeg' } });
        fetchMock.mockResolvedValueOnce({ ok: true, arrayBuffer: async () => new ArrayBuffer(8), headers: { get: () => 'image/jpeg' } });

        // Gemini
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ candidates: [{ content: { parts: [{ text: 'Final Report' }] } }] })
        });

        const result = await pipeline.run('Target');

        expect(result).toBe('Final Report');

        expect(PhantombusterService).toHaveBeenCalled();
        expect(ApifyService).toHaveBeenCalled();
    });
});
