export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  source: 'linkedin' | 'instagram' | 'twitter' | 'other';
}

export interface ISearchProvider {
  search(query: string): Promise<SearchResult[]>;
}

export interface IScraperProvider {
  scrape(profileUrl: string): Promise<any>;
}
export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  source: 'linkedin' | 'instagram' | 'twitter' | 'other';
}

export interface ISearchProvider {
  search(query: string): Promise<SearchResult[]>;
}

export interface IScraperProvider {
  scrape(profileUrl: string): Promise<any>;
}

export interface IAnalyzer {
  analyzeImages(imageUrls: string[]): Promise<string>;
}

export interface PipelineConfig {
  serperApiKey: string;
  apifyApiKey: string;
  phantombusterApiKey: string;
  geminiApiKey: string;
}
