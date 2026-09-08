import type { IJsonModel } from 'flexlayout-react';
import type { ViewDefinition } from '../types';

export const MONTH_MAP: Record<string, string> = {
  jan: '01', january: '01',
  feb: '02', february: '02',
  mar: '03', march: '03',
  apr: '04', april: '04',
  may: '05',
  jun: '06', june: '06',
  jul: '07', july: '07',
  aug: '08', august: '08',
  sep: '09', september: '09',
  oct: '10', october: '10',
  nov: '11', november: '11',
  dec: '12', december: '12',
};

export const MONTH_ABBR: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
  '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
  '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
};

export const ALL_FRAMES = [
  { id: 'metrics-tab', name: 'Metrics', component: 'metrics', tabsetId: 'metrics-tabset' },
  { id: 'rule-list-tab', name: 'Rule List', component: 'rules', tabsetId: 'rules-tabset' },
  { id: 'rule-details-tab', name: 'Rule Details', component: 'rule-details', tabsetId: 'rules-tabset' },
  { id: 'rule-creator-tab', name: 'Rule Creator', component: 'rule-creator', tabsetId: 'rules-tabset' },
  { id: 'suggested-rules-tab', name: 'Suggested Rules', component: 'suggested-rules', tabsetId: 'rules-tabset' },
  { id: 'insights-tab', name: 'Insights', component: 'insights', tabsetId: 'rules-tabset' },
  { id: 'transaction-list-tab', name: 'Transaction List', component: 'details', tabsetId: 'transactions-tabset' },
  { id: 'transaction-details-tab', name: 'Transaction Details', component: 'transaction-details', tabsetId: 'transactions-tabset' },
  { id: 'activity-log-tab', name: 'Activity Log', component: 'activity-log', tabsetId: 'transactions-tabset' },
];

export const GLOBAL_LAYOUT_SETTINGS = {
  tabEnableFloat: false,  // Disabled — popup windows cause flash/crash in prototype context
  tabEnableRename: false,
  tabEnableClose: true,
  tabSetEnableMaximize: true,  // Allow maximize as alternative to float
  tabSetEnableDrop: true,
  tabSetEnableDrag: true,
  tabSetEnableDivide: true,
  tabSetTabStripHeight: 40,
};

export const PRESET_VIEWS: ViewDefinition[] = [
  {
    id: 'floqast-default',
    name: 'FloQast Default',
    layout: {
      global: GLOBAL_LAYOUT_SETTINGS,
      borders: [],
      layout: {
        type: 'row', weight: 100,
        children: [
          { type: 'tabset', id: 'rules-tabset', weight: 50, children: [
            { type: 'tab', id: 'transaction-list-tab', name: 'Transaction List', component: 'details' },
            { type: 'tab', id: 'rule-list-tab', name: 'Rule List', component: 'rules' },
            { type: 'tab', id: 'rule-details-tab', name: 'Rule Details', component: 'rule-details' },
            { type: 'tab', id: 'rule-creator-tab', name: 'Rule Creator', component: 'rule-creator' },
            { type: 'tab', id: 'suggested-rules-tab', name: 'Suggested Rules', component: 'suggested-rules' },
          ]},
          { type: 'tabset', id: 'transactions-tabset', weight: 50, children: [
            { type: 'tab', id: 'transaction-details-tab', name: 'Transaction Details', component: 'transaction-details' },
          ]},
        ],
      },
    } as IJsonModel,
  },
  {
    id: 'transactions-focused',
    name: 'Transactions Focused',
    layout: {
      global: GLOBAL_LAYOUT_SETTINGS,
      borders: [],
      layout: {
        type: 'row',
        weight: 100,
        children: [
          { type: 'tabset', id: 'transaction-list-tabset', weight: 50, children: [
            { type: 'tab', id: 'transaction-list-tab', name: 'Transaction List', component: 'details' },
          ]},
          { type: 'tabset', id: 'transaction-details-tabset', weight: 50, children: [
            { type: 'tab', id: 'transaction-details-tab', name: 'Transaction Details', component: 'transaction-details' },
          ]},
        ],
      },
    } as IJsonModel,
  },
];

export const USERS = [
  'Dynamic Assignment',
  'Sarah Chen',        // Staff Accountant / Preparer (Catalyst persona)
  'David Park',        // Senior Accountant / Reviewer (Catalyst persona)
  'Maria Gonzalez',    // Controller (Catalyst persona)
  'Mike Chen',         // AP Clerk
  'Emily Rodriguez',   // Junior Accountant
  'Lisa Thompson',     // Revenue Accountant
  'Kevin Brown',       // Payroll Specialist
];

export const FIELD_OPTIONS = [
  { key: 'account', label: 'Account' },
  { key: 'amount', label: 'Amount' },
  { key: 'class', label: 'Class' },
  { key: 'createdBy', label: 'Created By' },
  { key: 'createdDate', label: 'Created Date' },
  { key: 'currency', label: 'Currency' },
  { key: 'dayOfWeek', label: 'Day Of Week' },
  { key: 'debitCredit', label: 'Debit / Credit' },
  { key: 'department', label: 'Department' },
  { key: 'entryType', label: 'Entry Type' },
  { key: 'hasPo', label: 'Has PO' },
  { key: 'internalId', label: 'Internal ID' },
  { key: 'isPostClose', label: 'Is Post Close' },
  { key: 'isRoundNumber', label: 'Is Round Number' },
  { key: 'location', label: 'Location' },
  { key: 'memo', label: 'Memo' },
  { key: 'name', label: 'Name' },
  { key: 'postingPeriod', label: 'Posting Period' },
  { key: 'subsidiary', label: 'Subsidiary' },
  { key: 'transactionDate', label: 'Transaction Date' },
  { key: 'transactionId', label: 'Transaction ID' },
  { key: 'type', label: 'Type' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'vendorAge', label: 'Vendor Age' },
];
