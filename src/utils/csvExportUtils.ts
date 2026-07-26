import { MetricCardData, CampaignEvent, NodeProtocolActivity, RevenueDataPoint } from '../types';

export function exportOverviewToCSV(
  metrics: MetricCardData[],
  campaigns: CampaignEvent[],
  nodeActivities: NodeProtocolActivity[],
  revenueData: RevenueDataPoint[]
): { fileName: string; rowCount: number } {
  const rows: string[] = [];

  const escapeCSV = (val: string | number | boolean | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  // Section 1: Key Performance Metrics
  rows.push('--- KEY PERFORMANCE METRICS ---');
  rows.push('Metric ID,Title,Current Value,Growth Delta,Subtext,Numeric Value,Min Threshold,Max Threshold,Calculation Formula');
  metrics.forEach((m) => {
    rows.push(
      [
        escapeCSV(m.id),
        escapeCSV(m.title),
        escapeCSV(m.value),
        escapeCSV(m.change),
        escapeCSV(m.subtext),
        escapeCSV(m.numericValue),
        escapeCSV(m.minThreshold),
        escapeCSV(m.maxThreshold),
        escapeCSV(m.calculationFormula || 'N/A'),
      ].join(',')
    );
  });

  rows.push('');

  // Section 2: Scheduled & Live Campaign Events
  rows.push('--- CAMPAIGN EVENT LOGS ---');
  rows.push('Event ID,Title,Category,Scheduled Date,Time,Status,Assignee,Channel,Budget');
  campaigns.forEach((c) => {
    rows.push(
      [
        escapeCSV(c.id),
        escapeCSV(c.title),
        escapeCSV(c.category),
        escapeCSV(c.date),
        escapeCSV(c.time),
        escapeCSV(c.status),
        escapeCSV(c.assignee),
        escapeCSV(c.channel),
        escapeCSV(c.budget || 'N/A'),
      ].join(',')
    );
  });

  rows.push('');

  // Section 3: Specialist Node Telemetry
  rows.push('--- SPECIALIST NODE TELEMETRY LOGS ---');
  rows.push('Node ID,Node Type,Node Name,Title,Description,Severity,Status,Timestamp,Action Required');
  nodeActivities.forEach((n) => {
    rows.push(
      [
        escapeCSV(n.id),
        escapeCSV(n.nodeType),
        escapeCSV(n.nodeName),
        escapeCSV(n.title),
        escapeCSV(n.description),
        escapeCSV(n.severity),
        escapeCSV(n.status),
        escapeCSV(n.timestamp),
        escapeCSV(n.actionRequired || 'N/A'),
      ].join(',')
    );
  });

  rows.push('');

  // Section 4: Revenue & ROAS Growth Data
  rows.push('--- REVENUE & ROAS TELEMETRY ---');
  rows.push('Week,Revenue ($),ROAS (x),Ad Spend ($),Active Leads,PPC Revenue ($),SEO Revenue ($),Social Revenue ($)');
  revenueData.forEach((r) => {
    rows.push(
      [
        escapeCSV(r.week),
        escapeCSV(r.revenue),
        escapeCSV(r.roas),
        escapeCSV(r.adSpend),
        escapeCSV(r.activeLeads),
        escapeCSV(r.ppcRevenue),
        escapeCSV(r.seoRevenue),
        escapeCSV(r.socialRevenue),
      ].join(',')
    );
  });

  const csvContent = rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const fileName = `flux_overview_analytics_${timestamp}.csv`;
  link.setAttribute('download', fileName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return { fileName, rowCount: rows.length };
}
