import type { IJsonModel } from 'flexlayout-react';

export interface KPICardProps {
  title: string;
  value?: number;
  icon?: React.ReactNode;
  isMain?: boolean;
  breakdown?: {
    label: string;
    value: number;
    color: string;
    onClick?: () => void;
  }[];
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  author: string;
  action: 'created' | 'edited' | 'deactivated' | 'reactivated' | 'duplicated';
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  initialFields?: {
    name: string;
    description: string;
    status: string;
  };
  version?: number;
  previousVersion?: number;
}

export interface Rule {
  id: string;
  name: string;
  totalCount: number;
  unresolvedCount: number;
  icon: React.ReactNode;
  status: 'Active' | 'Inactive' | 'Deactivated';
  description?: string;
  logic?: Group;
  activityLog: ActivityLogEntry[];
  preparers?: string[];
  reviewers?: string[];
  ruleOwner: string;
  severity?: number;
  version?: number;
  aiGenerated?: boolean;
  appliedPeriods?: 'current-future' | 'current-future-historical';
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  parentId?: string;
  editedAt?: string;
  deleted?: boolean;
}

export interface Anomaly {
  id: string;
  date: string;
  transactionId: string;
  entryType: 'Journal Entry' | 'Vendor Bill' | 'Payment' | 'Credit Memo' | 'Check' | 'Expense Report';
  entity: string;
  account: string;
  description: string;
  amount: number;
  triggeredRule?: string | string[];
  status: 'Open' | 'Investigating' | 'Resolved' | 'Deleted' | 'Dismissed';
  comments: Comment[];
  anomalyCount: number;
  postingPeriod?: string;
  debitCredit?: string;
  currency?: string;
  subsidiary?: string;
  department?: string;
  class?: string;
  location?: string;
  memo?: string;
  createdBy?: string;
  createdDate?: string;
  // v2 fields
  vendorId?: string;
  glDate?: string;
  enteredDate?: string;
  enteredBy?: string;
  approvedBy?: string | null;
  sameUserEnteredAndApproved?: boolean;
  poReference?: string | null;
  hasAttachment?: boolean;
  isRoundNumber?: boolean;
  isPeriodEnd?: boolean;
  isPostClose?: boolean;
  dayOfWeek?: number;
  hourOfDay?: number;
  vendorAgeAtTransaction?: number;
  priorPeriodAccount?: string | null;
  priorPeriodDepartment?: string | null;
}

export type FieldType = 'Amount' | 'Date' | 'Account' | 'Department' | 'Class' | 'Location' | 'Memo' | 'Created By' | 'Entry Type' | 'Vendor' | 'Day Of Week' | 'Has PO' | 'Is Round Number' | 'Is Post Close' | 'Vendor Age';
export type OperatorType = 'Equals' | 'Not Equals' | 'Greater Than' | 'Less Than' | 'Greater Than or Equal' | 'Less Than or Equal' | 'Contains' | 'Does Not Contain' | 'Starts With' | 'Ends With' | 'Is Empty' | 'Is Not Empty';
export type LogicType = 'AND' | 'OR';

export interface Condition {
  id: string;
  type: 'condition';
  field: FieldType;
  operator: OperatorType;
  value: string;
  aiGenerated?: boolean;
}

export interface Group {
  id: string;
  type: 'group';
  logic: LogicType;
  items: (Condition | Group)[];
}

export type RuleItem = Condition | Group;

export interface ParsedRuleInfo {
  logic: Group;
  nameParts: string[];
  descriptionParts: string[];
}

export interface ViewDefinition {
  id: string;
  name: string;
  layout: IJsonModel;
  isPublic?: boolean;
  isFavorite?: boolean;
}

export interface PrepopulatedRuleData {
  name: string;
  description: string;
  naturalLanguageInput: string;
  logic?: Group;
  status?: string;
  preparers?: string[];
  reviewers?: string[];
  ruleOwner?: string;
  severity?: number;
}

// v2 data model interfaces

export interface Vendor {
  id: string;
  name: string;
  createdDate: string;
  hasEin: boolean;
  addressType: 'residential' | 'po_box' | 'commercial';
  bankAccountUpdatedDate: string | null;
  normalPaymentRangeMin: number;
  normalPaymentRangeMax: number;
  primaryDepartment: string;
  primaryGlAccount: string;
  averageMonthlyInvoiceCount: number;
  emailDomain: 'personal' | 'business';
  isActive: boolean;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'revenue' | 'expense' | 'equity';
  normalMonthlyMin: number;
  normalMonthlyMax: number;
  isCapex: boolean;
  requiresPo: boolean;
  approvalThreshold: number;
  priorPeriodAverage: number;
}

export interface Period {
  id: string;
  name: string;
  startDate: string;
  closeDate: string | null;
  isCurrentPeriod: boolean;
  isClosed: boolean;
}

export interface Signoff {
  id: string;
  transactionId: string;
  ruleId: string;
  userId: string;
  role: 'preparer' | 'reviewer';
  signedAt: string;
}

export type InsightType = 'Standard Check' | 'Algorithm' | 'Account Fingerprint';

export interface Insight {
  id: string;
  name: string;
  type: InsightType;
  description: string;
  insightCount: number;
}

export type SuggestedRuleCategory = 'Transaction Analysis Rules' | 'Common Accounting Anomalies';

export interface SuggestedRule {
  id: string;
  name: string;
  description: string;
  naturalLanguageInput: string;
  category: SuggestedRuleCategory;
  anomalyCount: number;
}
