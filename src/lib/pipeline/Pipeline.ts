import { ISearchProvider, IScraperProvider, IAnalyzer, PipelineConfig } from './types';
import { SearchService } from './SearchService';
import { ApifyService } from './ApifyService';
import { PhantombusterService } from './PhantombusterService';
import { GeminiService } from './GeminiService';

export class Pipeline {
    private searchService: ISearchProvider;
    private apifyService: IScraperProvider;
    private phantombusterService: IScraperProvider;
    private analyzer: IAnalyzer;

    constructor(config: PipelineConfig) {
        this.searchService = new SearchService(config.serperApiKey);
        this.apifyService = new ApifyService(config.apifyApiKey);
        this.phantombusterService = new PhantombusterService(config.phantombusterApiKey);
        this.analyzer = new GeminiService(config.geminiApiKey);
    }

    async run(targetName: string): Promise<string> {
        console.log(`Starting pipeline for: ${targetName}`);

        // LinkedIn via Phantombuster, Instagram via Apify
        const platforms = [
            { name: 'LinkedIn', querySuffix: 'LinkedIn', domain: 'linkedin.com' },
            { name: 'Instagram', querySuffix: 'Instagram', domain: 'instagram.com' }
        ];

        const profileUrls: string[] = [];

        // 1. Targeted Search
        for (const platform of platforms) {
            console.log(`Searching for ${targetName} on ${platform.name}...`);
            const query = `${targetName} ${platform.querySuffix}`;
            const results = await this.searchService.search(query);

            // Find the first fitting link
            const bestMatch = results.find(r => {
                const link = r.link.toLowerCase();
                return link.includes(platform.domain);
            });

            if (bestMatch) {
                // Filter out LinkedIn directory URLs if needed
                if (platform.name === 'LinkedIn' && bestMatch.link.includes('/pub/dir/')) {
                    console.log(`Skipping LinkedIn directory URL: ${bestMatch.link}`);
                } else {
                    console.log(`Found ${platform.name} profile: ${bestMatch.link}`);
                    profileUrls.push(bestMatch.link);
                }
            } else {
                console.log(`No matching ${platform.name} profile found.`);
            }
        }

        if (profileUrls.length === 0) {
            return 'No profiles found.';
        }

        // 2. Scrape (Parallel)
        console.log('Triggering scrapers...');
        const scrapePromises = profileUrls.map(async (url) => {
            try {
                console.log(`Scraping ${url}...`);

                // Route to appropriate service based on URL
                if (url.includes('linkedin.com')) {
                    return await this.phantombusterService.scrape(url);
                } else if (url.includes('instagram.com')) {
                    return await this.apifyService.scrape(url);
                }

                return null;
            } catch (e) {
                console.error(`Failed to scrape ${url}:`, e);
                return null;
            }
        });

        const scrapeResults = await Promise.all(scrapePromises);
        const validResults = scrapeResults.filter(r => r !== null);

        console.log('DEBUG: Scraper Results:', JSON.stringify(validResults, null, 2));

        // Extract image URLs from scrape results
        const imageUrls: string[] = [];

        const extractImagesRecursively = (obj: any) => {
            if (!obj || typeof obj !== 'object') return;

            if (Array.isArray(obj)) {
                obj.forEach(item => extractImagesRecursively(item));
                return;
            }

            // Check for image fields
            if (obj.img) imageUrls.push(obj.img);
            if (obj.profilePic) imageUrls.push(obj.profilePic);
            if (obj.avatar) imageUrls.push(obj.avatar);
            if (obj.displayUrl) imageUrls.push(obj.displayUrl);
            if (obj.profilePicUrl) imageUrls.push(obj.profilePicUrl);
            if (obj.profile_pic_url) imageUrls.push(obj.profile_pic_url);
            if (obj.profile_image_url_https) imageUrls.push(obj.profile_image_url_https);
            if (obj.media_url_https) imageUrls.push(obj.media_url_https);
            if (obj.profilePicture) imageUrls.push(obj.profilePicture);
            if (obj.pictureUrl) imageUrls.push(obj.pictureUrl);

            // Recursively check all properties
            Object.values(obj).forEach(value => {
                if (typeof value === 'object') {
                    extractImagesRecursively(value);
                }
            });
        };

        validResults.forEach(result => extractImagesRecursively(result));

        console.log(`Extracted ${imageUrls.length} images for analysis.`);

        if (imageUrls.length === 0) {
            return 'No images found to analyze.';
        }

        // 3. Analyze
        console.log('Analyzing images with Gemini...');
        // Limit to 5 images for analysis
        const analysis = await this.analyzer.analyzeImages(imageUrls.slice(0, 5));

        return analysis;
    }
}
