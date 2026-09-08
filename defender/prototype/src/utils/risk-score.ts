import type { Anomaly, Rule } from '../types';

export function calculateRiskScore(rule: Rule, anomaliesData: Anomaly[]): number {
  const severity = rule.severity || 5;
  const unresolvedCount = rule.unresolvedCount;

  const matchingAnomalies = anomaliesData.filter(anomaly => {
    if (!anomaly.triggeredRule) return false;
    if (Array.isArray(anomaly.triggeredRule)) {
      return anomaly.triggeredRule.includes(rule.name);
    }
    return anomaly.triggeredRule === rule.name;
  });

  const totalFinancialImpact = matchingAnomalies
    .filter(a => a.status !== 'Resolved')
    .reduce((sum, a) => {
      const amount = Math.abs(a.amount || 0);
      return sum + amount;
    }, 0);

  const financialWeight = Math.min(totalFinancialImpact / 100000, 30);

  const score = (severity * 7) + (unresolvedCount * 0.5) + financialWeight;

  return Math.min(Math.round(score), 100);
}

export function getRiskScoreColor(score: number): string {
  if (score >= 70) return 'var(--flo-sem-color-danger)';
  if (score >= 50) return 'var(--flo-sem-color-warning)';
  return 'var(--flo-sem-color-success)';
}

export function getRiskScoreBreakdown(rule: Rule, anomaliesData: Anomaly[]): string {
  const severity = rule.severity || 5;
  const unresolvedCount = rule.unresolvedCount;

  const matchingAnomalies = anomaliesData.filter(anomaly => {
    if (!anomaly.triggeredRule) return false;
    if (Array.isArray(anomaly.triggeredRule)) {
      return anomaly.triggeredRule.includes(rule.name);
    }
    return anomaly.triggeredRule === rule.name;
  });

  const totalFinancialImpact = matchingAnomalies
    .filter(a => a.status !== 'Resolved')
    .reduce((sum, a) => {
      const amount = Math.abs(a.amount || 0);
      return sum + amount;
    }, 0);

  const financialWeight = Math.min(totalFinancialImpact / 100000, 30);

  return `User Severity: ${(severity * 7).toFixed(0)} + Unresolved Anomalies: ${(unresolvedCount * 0.5).toFixed(1)} + Weighted Dollar Amount: ${financialWeight.toFixed(1)}`;
}
