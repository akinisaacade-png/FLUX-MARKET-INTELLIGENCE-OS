import { CompetitorCreative, KeywordClusterData, CrisisAlertItem } from '../types';

export const competitorPriceHistory = [
  { month: 'Jan', FLUX: 149, AdSphere: 179, MarketPulse: 199, GrowthEngine: 99 },
  { month: 'Feb', FLUX: 149, AdSphere: 179, MarketPulse: 199, GrowthEngine: 99 },
  { month: 'Mar', FLUX: 149, AdSphere: 169, MarketPulse: 189, GrowthEngine: 99 },
  { month: 'Apr', FLUX: 149, AdSphere: 152, MarketPulse: 189, GrowthEngine: 99 },
  { month: 'May', FLUX: 149, AdSphere: 152, MarketPulse: 175, GrowthEngine: 99 },
  { month: 'Jun', FLUX: 149, AdSphere: 145, MarketPulse: 175, GrowthEngine: 99 },
  { month: 'Jul', FLUX: 149, AdSphere: 145, MarketPulse: 169, GrowthEngine: 99 },
];

export const competitorAdCreatives: CompetitorCreative[] = [
  {
    id: 'ad-1',
    competitor: 'AdSphere Pro',
    adHeadline: 'Cut Your PPC Ad Spend by 30% with AI Automation',
    format: 'Meta Video Ad',
    ctrEst: '4.8%',
    spendEst: '$28,500/mo',
    angle: 'Cost Reduction & Speed',
    previewText: 'Tired of burning budget on unoptimized Google Search terms? Our AI restructures your ad groups in under 5 minutes.',
  },
  {
    id: 'ad-2',
    competitor: 'MarketPulse AI',
    adHeadline: 'Enterprise Marketing OS — 30-Day Free Trial',
    format: 'Google Search Ad',
    ctrEst: '6.2%',
    spendEst: '$42,000/mo',
    angle: 'Enterprise Trial Hook',
    previewText: 'Full multi-tenant strategy dashboard, unified ROAS analytics & instant A/B test deployment. No credit card required.',
  },
  {
    id: 'ad-3',
    competitor: 'GrowthEngine OS',
    adHeadline: 'Flat $99/mo B2B Growth Engine for Founders',
    format: 'LinkedIn Carousel',
    ctrEst: '3.9%',
    spendEst: '$19,200/mo',
    angle: 'Low Price Anchor',
    previewText: 'Scale B2B customer acquisition without hiring an agency. Get verified lead lists & automated campaign workflows.',
  },
];

export const trendVolumeTrajectories = [
  { week: 'Wk 1', autonomousAgents: 24, predictiveRoas: 18, neuralSeo: 12, abSignificance: 10 },
  { week: 'Wk 2', autonomousAgents: 38, predictiveRoas: 22, neuralSeo: 15, abSignificance: 12 },
  { week: 'Wk 3', autonomousAgents: 55, predictiveRoas: 29, neuralSeo: 21, abSignificance: 14 },
  { week: 'Wk 4', autonomousAgents: 82, predictiveRoas: 36, neuralSeo: 28, abSignificance: 16 },
  { week: 'Wk 5', autonomousAgents: 110, predictiveRoas: 42, neuralSeo: 31, abSignificance: 17 },
  { week: 'Wk 6', autonomousAgents: 142, predictiveRoas: 48, neuralSeo: 35, abSignificance: 18 },
];

export const trendIntentDistribution = [
  { name: 'High Commercial Intent', percentage: 48, color: '#f97316' },
  { name: 'Transactional / Buy Now', percentage: 32, color: '#a855f7' },
  { name: 'Informational Research', percentage: 20, color: '#10b981' },
];

export const seoKeywordClusters: KeywordClusterData[] = [
  {
    cluster: 'Autonomous Marketing Agents',
    searchVolume: 142000,
    difficulty: 32,
    opportunityScore: 94,
    intentGap: 'High demand for hands-off PPC & SEO campaign execution software.',
    topKeywords: ['ai marketing agent', 'autonomous ad manager', 'marketing agent orchestration'],
  },
  {
    cluster: 'Predictive PPC ROAS Calculator',
    searchVolume: 48500,
    difficulty: 24,
    opportunityScore: 88,
    intentGap: 'Users looking for free web tools to forecast return on ad spend before launching.',
    topKeywords: ['roas calculator ai', 'predictive ad return formula', 'ppc budget forecaster'],
  },
  {
    cluster: 'Neural SEO Keyword Clustering',
    searchVolume: 29100,
    difficulty: 18,
    opportunityScore: 91,
    intentGap: 'Searches for semantic keyword mapping tools to beat traditional search algorithms.',
    topKeywords: ['semantic clustering tool', 'neural keyword mapping', 'serp intent gap software'],
  },
  {
    cluster: 'Multi-Tenant Agency Dashboard',
    searchVolume: 18400,
    difficulty: 42,
    opportunityScore: 76,
    intentGap: 'Agencies searching for unified white-label analytics for client reporting.',
    topKeywords: ['white label marketing os', 'agency roas dashboard', 'multi client marketing platform'],
  },
];

export const crisisSentimentTimeline = [
  { hour: '00:00', positive: 88, neutral: 10, negative: 2, anomalyScore: 12 },
  { hour: '04:00', positive: 91, neutral: 7, negative: 2, anomalyScore: 8 },
  { hour: '08:00', positive: 85, neutral: 12, negative: 3, anomalyScore: 18 },
  { hour: '12:00', positive: 79, neutral: 14, negative: 7, anomalyScore: 42 }, // minor anomaly spike on tracking pixel query
  { hour: '16:00', positive: 89, neutral: 9, negative: 2, anomalyScore: 14 },
  { hour: '20:00', positive: 92, neutral: 6, negative: 2, anomalyScore: 6 },
];

export const crisisAlertStream: CrisisAlertItem[] = [
  {
    id: 'cr-1',
    source: 'Reddit /r/MarTech',
    author: 'u/growth_lead_99',
    message: 'Has anyone tested FLUX OS pixel tracking under heavy iOS 18 Safari restrictions? Seeing zero drop in ROAS accuracy.',
    severity: 'positive',
    sentimentPct: 94,
    recommendedResponse: 'Amplify positive sentiment via LinkedIn case study & share technical benchmark paper.',
    timestamp: '18 mins ago',
  },
  {
    id: 'cr-2',
    source: 'Twitter / X',
    author: '@SaaS_Auditor',
    message: 'Querying competitor pricing nodes on AdSphere vs FLUX OS. FLUX detected the 15% price cut within 4 minutes.',
    severity: 'positive',
    sentimentPct: 98,
    recommendedResponse: 'Retweet with breakdown of real-time neural node architecture.',
    timestamp: '42 mins ago',
  },
  {
    id: 'cr-3',
    source: 'HackerNews',
    author: 'dev_analyst',
    message: 'Discussion regarding tracking pixel script size (1.4kb) vs traditional GTM containers.',
    severity: 'low',
    sentimentPct: 76,
    recommendedResponse: 'Provide technical benchmark docs confirming zero page speed impact.',
    timestamp: '2 hours ago',
  },
];
