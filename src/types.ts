export type NavTab =
  | 'overview'
  | 'omni-calendar'
  | 'service-ecosystem'
  | 'market-intelligence'
  | 'content-assistant'
  | 'strategy-ai'
  | 'ab-testing'
  | 'roi-analytics'
  | 'canvas-editor'
  | 'multilingual'
  | 'maintenance'
  | 'subscription';

export type NodeType = 'competitor' | 'trend' | 'seo' | 'crisis';

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  iconName: string;
  chartData: number[];
  previousValue?: string;
  previousChange?: string;
  delta?: string;
  calculationFormula?: string;
  calculationDescription?: string;
  dataSources?: string[];
  numericValue?: number;
  minThreshold?: number;
  maxThreshold?: number;
  thresholdUnit?: string;
}

export interface NodeProtocolActivity {
  id: string;
  nodeType: NodeType;
  nodeName: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low' | 'positive';
  status: 'active' | 'synced' | 'alert' | 'idle';
  timestamp: string;
  actionRequired?: string;
  metadata?: {
    label: string;
    value: string;
  }[];
}

export interface SystemUpdateItem {
  id: string;
  title: string;
  type: 'milestone' | 'feedback' | 'alert' | 'patch';
  status: 'open' | 'resolved';
  author: string;
  avatar: string;
  timestamp: string;
  description: string;
  comments: {
    id: string;
    user: string;
    text: string;
    time: string;
  }[];
}

export interface RevenueDataPoint {
  week: string;
  revenue: number; // in USD
  roas: number; // e.g. 4.8
  adSpend: number; // in USD
  activeLeads: number;
  ppcRevenue: number;
  seoRevenue: number;
  socialRevenue: number;
}

export interface CampaignEvent {
  id: string;
  title: string;
  category: 'PPC Campaign' | 'Content Launch' | 'A/B Test' | 'Product Release' | 'SEO Push';
  date: string;
  time: string;
  status: 'scheduled' | 'live' | 'completed' | 'draft';
  assignee: string;
  channel: string;
  budget?: string;
}

export interface ServiceEcosystemItem {
  id: string;
  name: string;
  category: string;
  mrr: string;
  activeClients: number;
  roasMultiplier: string;
  health: 'Optimal' | 'Growing' | 'Needs Attention';
  growthRate: string;
  leadVelocity: number;
}

export interface ABExperiment {
  id: string;
  name: string;
  targetUrl: string;
  status: 'running' | 'completed' | 'paused' | 'draft';
  startDate: string;
  endDate: string;
  primaryMetric: string;
  totalVisitors: number;
  variants: {
    name: string;
    trafficShare: number;
    conversions: number;
    conversionRate: number;
    lift: string;
    confidence: number;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  timestamp: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
}

export interface SiteCanvasSection {
  id: string;
  type: 'hero' | 'features' | 'cta' | 'pricing' | 'testimonials';
  title: string;
  subtitle: string;
  buttonText: string;
  bgGradient: string;
}

export interface GeneratedContentPackage {
  socialPosts: {
    platform: string;
    headline: string;
    body: string;
    hashtags: string[];
  }[];
  adCopy: {
    type: string;
    headline1?: string;
    headline2?: string;
    headline?: string;
    primaryCopy?: string;
    description?: string;
    cta?: string;
    ctrBoostTip?: string;
  }[];
  emailCampaign: {
    variant: string;
    subject: string;
    previewText: string;
    openingHook: string;
  }[];
  strategicAngle: string;
}

export interface CompetitorCreative {
  id: string;
  competitor: string;
  adHeadline: string;
  format: string;
  ctrEst: string;
  spendEst: string;
  angle: string;
  previewText: string;
}

export interface KeywordClusterData {
  cluster: string;
  searchVolume: number;
  difficulty: number; // 0-100
  opportunityScore: number; // 0-100
  intentGap: string;
  topKeywords: string[];
}

export interface CrisisAlertItem {
  id: string;
  source: string;
  author: string;
  message: string;
  severity: 'high' | 'medium' | 'low' | 'positive';
  sentimentPct: number;
  recommendedResponse: string;
  timestamp: string;
}

