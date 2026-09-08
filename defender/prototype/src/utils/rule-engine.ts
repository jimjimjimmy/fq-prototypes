import type { Anomaly, Condition, FieldType, Group, Rule } from '../types';

export function evaluateCondition(condition: Condition, anomaly: Anomaly): boolean {
  const fieldMap: Record<FieldType, keyof Anomaly | string> = {
    'Amount': 'amount',
    'Date': 'date',
    'Account': 'account',
    'Department': 'department',
    'Class': 'class',
    'Location': 'location',
    'Memo': 'memo',
    'Created By': 'createdBy',
    'Entry Type': 'entryType',
    'Vendor': 'entity',
    'Day Of Week': 'dayOfWeek',
    'Has PO': 'poReference',
    'Is Round Number': 'isRoundNumber',
    'Is Post Close': 'isPostClose',
    'Vendor Age': 'vendorAgeAtTransaction'
  };

  const field = fieldMap[condition.field];
  if (!field) return false;

  const value = anomaly[field as keyof Anomaly];
  const conditionValue = condition.value;

  if (value === undefined || value === null) {
    return condition.operator === 'Is Empty';
  }

  // Handle boolean fields — compare against "true"/"false" strings
  if (typeof value === 'boolean') {
    switch (condition.operator) {
      case 'Equals': return value === (conditionValue.toLowerCase() === 'true');
      case 'Not Equals': return value !== (conditionValue.toLowerCase() === 'true');
      case 'Is Empty': return false; // booleans are never empty
      case 'Is Not Empty': return true;
      default: return false;
    }
  }

  const stringValue = String(value).toLowerCase();
  const conditionStringValue = conditionValue.toLowerCase();

  switch (condition.operator) {
    case 'Equals':
      if (condition.field === 'Amount') {
        return Number(value) === Number(conditionValue);
      }
      return stringValue === conditionStringValue;
    case 'Not Equals':
      if (condition.field === 'Amount') {
        return Number(value) !== Number(conditionValue);
      }
      return stringValue !== conditionStringValue;
    case 'Greater Than':
      return Number(value) > Number(conditionValue);
    case 'Less Than':
      return Number(value) < Number(conditionValue);
    case 'Greater Than or Equal':
      return Number(value) >= Number(conditionValue);
    case 'Less Than or Equal':
      return Number(value) <= Number(conditionValue);
    case 'Contains':
      return stringValue.includes(conditionStringValue);
    case 'Does Not Contain':
      return !stringValue.includes(conditionStringValue);
    case 'Starts With':
      return stringValue.startsWith(conditionStringValue);
    case 'Ends With':
      return stringValue.endsWith(conditionStringValue);
    case 'Is Empty':
      return !value || stringValue === '';
    case 'Is Not Empty':
      return !!value && stringValue !== '';
    default:
      return false;
  }
}

export function evaluateGroup(group: Group, anomaly: Anomaly): boolean {
  if (group.items.length === 0) return false;

  const results = group.items.map(item => {
    if (item.type === 'condition') {
      return evaluateCondition(item, anomaly);
    } else {
      return evaluateGroup(item, anomaly);
    }
  });

  return group.logic === 'AND'
    ? results.every(r => r)
    : results.some(r => r);
}

export function evaluateRule(rule: Rule, anomaly: Anomaly): boolean {
  if (!rule.logic || rule.logic.items.length === 0) return false;
  return evaluateGroup(rule.logic, anomaly);
}

export function applyRulesToAnomalies(currentRules: Rule[], currentAnomalies: Anomaly[]): { anomalies: Anomaly[], rules: Rule[] } {
  const activeRules = currentRules.filter(r => r.status === 'Active');
  const ruleCounts: Record<string, { total: number, unresolved: number }> = {};

  activeRules.forEach(rule => {
    ruleCounts[rule.id] = { total: 0, unresolved: 0 };
  });

  const updatedAnomalies = currentAnomalies.map(anomaly => {
    const matchingRules = activeRules.filter(rule => evaluateRule(rule, anomaly));
    const newAnomalyCount = matchingRules.length;

    if (matchingRules.length > 0) {
      matchingRules.forEach(rule => {
        ruleCounts[rule.id].total += 1;
        if (anomaly.status !== 'Resolved') {
          ruleCounts[rule.id].unresolved += 1;
        }
      });

      return {
        ...anomaly,
        anomalyCount: newAnomalyCount,
        triggeredRule: matchingRules.length === 1
          ? matchingRules[0].name
          : matchingRules.map(r => r.name)
      };
    }

    return {
      ...anomaly,
      anomalyCount: 0,
      triggeredRule: undefined
    };
  });

  const updatedRules = currentRules.map(rule => ({
    ...rule,
    totalCount: ruleCounts[rule.id]?.total || rule.totalCount,
    unresolvedCount: ruleCounts[rule.id]?.unresolved || rule.unresolvedCount
  }));

  return { anomalies: updatedAnomalies, rules: updatedRules };
}
