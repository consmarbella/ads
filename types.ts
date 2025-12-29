
export interface ClientData {
  businessName: string;
  url: string;
  location: string;
  mainService: string;
  excludedServices: string;
  clientType: 'B2B' | 'B2C' | '';
  valueProposition: string;
  brandTone: string;
  objective: 'Traffic' | 'Leads' | 'Calls' | 'Sales' | '';
  budget: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface AdCopy {
  headlines: string[];
  descriptions: string[];
  path1: string;
  path2: string;
}

export interface Sitelink {
  text: string;
  description1: string;
  description2: string;
}

export interface AdGroup {
  name: string;
  userIntent: string;
  keywords: string[];
  negatives: string[];
  ads: AdCopy[];
}

export interface CampaignSettings {
  dailyBudget: number;
  bidStrategyType: string; 
  targetLanguages: string[]; 
  targetLocations: string[]; 
}

export interface CampaignStructure {
  campaignName: string;
  campaignGoal: string;
  campaignOverview: string;
  competitorAnalysis: string;
  strategicRationale: string;
  language: 'es' | 'en';
  settings: CampaignSettings; 
  manualConfigInstructions: string[]; 
  adGroups: AdGroup[];
  sitelinks: Sitelink[];
  callouts: string[];
}

export interface StrategyResponse {
  campaign: CampaignStructure;
  groundingChunks: GroundingChunk[];
}

export enum AppState {
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
