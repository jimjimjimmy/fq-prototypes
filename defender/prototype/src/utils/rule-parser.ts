import type { Condition, Group, OperatorType, ParsedRuleInfo } from '../types';
import { MONTH_MAP, MONTH_ABBR } from '../data/constants';

export function parseNaturalLanguageRule(text: string): ParsedRuleInfo {
  const conditions: Condition[] = [];
  const lowerText = text.toLowerCase();
  const nameParts: string[] = [];
  const descriptionParts: string[] = [];
  const ts = Date.now().toString();

  const greaterThanMatch = lowerText.match(/(?:greater than|over|above|more than|>)/);
  const lessThanMatch = lowerText.match(/(?:less than|under|below|fewer than|<)/);
  const greaterEqualMatch = lowerText.match(/(?:at least|>= ?|greater than or equal)/);
  const lessEqualMatch = lowerText.match(/(?:at most|<= ?|less than or equal)/);

  const amountMatch = lowerText.match(/\$?([\d,]+(?:\.\d{2})?)\s*[kK]\b/) ||
                      lowerText.match(/\$?([\d,]+(?:\.\d{2})?)/);
  const isKilo = /\$?[\d,]+(?:\.\d{2})?\s*[kK]\b/.test(lowerText);

  const accountMatch = lowerText.match(/account\s+(\d+)/i);
  const departmentMatch = lowerText.match(/department\s+([a-zA-Z0-9\s]+?)(?:\s+and|\s+or|$)/i);
  const entryTypeMatch = lowerText.match(/\b(je|journal entry|vendor bill|bill|payment|credit memo|check)\b/i);

  const monthYearMatch = lowerText.match(
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{4})\b/i
  );
  const yearMonthMatch = !monthYearMatch && lowerText.match(
    /\b(\d{4})\s*[-\/]\s*(0?[1-9]|1[0-2])\b/
  );

  if (accountMatch) {
    conditions.push({
      id: ts + '-1',
      type: 'condition',
      field: 'Account',
      operator: 'Equals',
      value: accountMatch[1],
      aiGenerated: true
    });
    nameParts.push(`Acct ${accountMatch[1]}`);
    descriptionParts.push(`account ${accountMatch[1]}`);
  }

  if (departmentMatch) {
    const dept = departmentMatch[1].trim();
    conditions.push({
      id: ts + '-2',
      type: 'condition',
      field: 'Department',
      operator: 'Equals',
      value: dept,
      aiGenerated: true
    });
    nameParts.push(dept);
    descriptionParts.push(`department "${dept}"`);
  }

  if (entryTypeMatch) {
    let entryTypeValue = '';
    const match = entryTypeMatch[1].toLowerCase();
    if (match === 'je' || match === 'journal entry') entryTypeValue = 'Journal Entry';
    else if (match === 'bill' || match === 'vendor bill') entryTypeValue = 'Vendor Bill';
    else if (match === 'payment') entryTypeValue = 'Payment';
    else if (match === 'credit memo') entryTypeValue = 'Credit Memo';
    else if (match === 'check') entryTypeValue = 'Check';

    if (entryTypeValue) {
      conditions.push({
        id: ts + '-3',
        type: 'condition',
        field: 'Entry Type',
        operator: 'Equals',
        value: entryTypeValue,
        aiGenerated: true
      });
      nameParts.push(entryTypeValue);
      descriptionParts.push(`entry type "${entryTypeValue}"`);
    }
  }

  if (amountMatch) {
    const raw = amountMatch[1].replace(/,/g, '');
    const amount = isKilo ? String(parseFloat(raw) * 1000) : raw;
    const displayAmt = isKilo
      ? `$${parseFloat(raw) % 1 === 0 ? parseInt(raw) : parseFloat(raw)}K`
      : `$${Number(amount).toLocaleString()}`;

    let operator: OperatorType = 'Equals';
    let opLabel = '=';
    if (greaterEqualMatch) { operator = 'Greater Than or Equal'; opLabel = '>='; }
    else if (lessEqualMatch) { operator = 'Less Than or Equal'; opLabel = '<='; }
    else if (greaterThanMatch) { operator = 'Greater Than'; opLabel = '>'; }
    else if (lessThanMatch) { operator = 'Less Than'; opLabel = '<'; }

    conditions.push({
      id: ts + '-4',
      type: 'condition',
      field: 'Amount',
      operator,
      value: amount,
      aiGenerated: true
    });
    nameParts.push(`${opLabel} ${displayAmt}`);
    descriptionParts.push(`amount ${opLabel} ${displayAmt}`);
  }

  if (monthYearMatch) {
    const monthKey = monthYearMatch[1].toLowerCase().substring(0, 3);
    const monthNum = MONTH_MAP[monthKey] || MONTH_MAP[monthYearMatch[1].toLowerCase()];
    const year = monthYearMatch[2];
    if (monthNum) {
      const startDate = `${year}-${monthNum}-01`;
      const lastDay = new Date(parseInt(year), parseInt(monthNum), 0).getDate();
      const endDate = `${year}-${monthNum}-${String(lastDay).padStart(2, '0')}`;
      const abbr = MONTH_ABBR[monthNum];

      conditions.push({
        id: ts + '-5a',
        type: 'condition',
        field: 'Date',
        operator: 'Greater Than or Equal',
        value: startDate,
        aiGenerated: true
      });
      conditions.push({
        id: ts + '-5b',
        type: 'condition',
        field: 'Date',
        operator: 'Less Than or Equal',
        value: endDate,
        aiGenerated: true
      });
      nameParts.unshift(`${abbr} ${year}`);
      descriptionParts.push(`posted in ${abbr} ${year}`);
    }
  } else if (yearMonthMatch) {
    const year = yearMonthMatch[1];
    const monthNum = yearMonthMatch[2].padStart(2, '0');
    const startDate = `${year}-${monthNum}-01`;
    const lastDay = new Date(parseInt(year), parseInt(monthNum), 0).getDate();
    const endDate = `${year}-${monthNum}-${String(lastDay).padStart(2, '0')}`;
    const abbr = MONTH_ABBR[monthNum];

    conditions.push({
      id: ts + '-5a',
      type: 'condition',
      field: 'Date',
      operator: 'Greater Than or Equal',
      value: startDate,
      aiGenerated: true
    });
    conditions.push({
      id: ts + '-5b',
      type: 'condition',
      field: 'Date',
      operator: 'Less Than or Equal',
      value: endDate,
      aiGenerated: true
    });
    nameParts.unshift(`${abbr} ${year}`);
    descriptionParts.push(`posted in ${abbr} ${year}`);
  }

  return {
    logic: { id: 'root', type: 'group', logic: 'AND', items: conditions },
    nameParts,
    descriptionParts,
  };
}
