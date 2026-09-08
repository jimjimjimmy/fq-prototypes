import { useState, useEffect, useRef } from 'react';
import { AlertCircle, FileText, DollarSign, Tag } from 'lucide-react';
import SideNavbar from './components/SideNavbar';
import TopNavbar from './components/TopNavbar';
import { Layout, Model, TabNode, Actions, DockLocation } from 'flexlayout-react';
import AutoAwesome from '@floqastinc/flow-ui_icons/material/AutoAwesome';
import Add from '@floqastinc/flow-ui_icons/material/Add';
import Close from '@floqastinc/flow-ui_icons/material/Close';
import ArrowUpward from '@floqastinc/flow-ui_icons/material/ArrowUpward';
import ArrowDownward from '@floqastinc/flow-ui_icons/material/ArrowDownward';
import SwapVert from '@floqastinc/flow-ui_icons/material/SwapVert';
import GridView from '@floqastinc/flow-ui_icons/material/GridView';
import FilterList from '@floqastinc/flow-ui_icons/material/FilterList';
import ViewColumn from '@floqastinc/flow-ui_icons/material/ViewColumn';
import Info from '@floqastinc/flow-ui_icons/material/Info';
import TrendingUp from '@floqastinc/flow-ui_icons/material/TrendingUp';
import MoreVert from '@floqastinc/flow-ui_icons/material/MoreVert';
import Schedule from '@floqastinc/flow-ui_icons/material/Schedule';
import CalendarMonth from '@floqastinc/flow-ui_icons/material/CalendarMonth';
import Edit from '@floqastinc/flow-ui_icons/material/Edit';
import Group from '@floqastinc/flow-ui_icons/material/Group';
import Button from '@floqastinc/flow-ui_core/Button';
import Toggle from '@floqastinc/flow-ui_core/Toggle';

import Modal from '@floqastinc/flow-ui_core/Modal';
import Tooltip from '@floqastinc/flow-ui_core/Tooltip';
import Avatar from '@floqastinc/flow-ui_core/Avatar';
import AvatarGroup from '@floqastinc/flow-ui_core/AvatarGroup';
import DropdownButton from '@floqastinc/flow-ui_core/DropdownButton';
import Delete from '@floqastinc/flow-ui_icons/material/Delete';
import Settings from '@floqastinc/flow-ui_icons/material/Settings';
import Star from '@floqastinc/flow-ui_icons/material/Star';
import StarOutline from '@floqastinc/flow-ui_icons/material/StarOutline';
import Checkbox from '@floqastinc/flow-ui_core/Checkbox';

import type { Rule, Anomaly, Comment, ViewDefinition, PrepopulatedRuleData, ActivityLogEntry } from './types';
import { ALL_FRAMES, GLOBAL_LAYOUT_SETTINGS, PRESET_VIEWS } from './data/constants';
import { INITIAL_RULES, type MockRule } from './data/mock-rules';
import { calculateRiskScore, getRiskScoreColor, getRiskScoreBreakdown } from './utils/risk-score';
import { applyRulesToAnomalies, evaluateRule } from './utils/rule-engine';

import MetricCards from './components/MetricCards';
import InsightsGrid from './components/InsightsGrid';
import { INSIGHTS } from './data/insights';
import { AgGroupIcon, AgColumnsIcon, AgFiltersIcon, AgViewsIcon } from './components/ag-grid-icons';
import TransactionGrid from './components/TransactionGrid';
import AllRulesView from './components/AllRulesView';
import AllTransactionsView from './components/AllTransactionsView';
import DetailPanel from './components/DetailPanel';
import DeleteRuleModal from './components/DeleteRuleModal';
import DeactivateRuleModal from './components/DeactivateRuleModal';
import ActivityLogPanel from './components/ActivityLogPanel';
import FieldSettingsPanel from './components/FieldSettingsPanel';
import SuggestedRules from './components/SuggestedRules';
import RuleBuilderPanel from './components/RuleBuilder/RuleBuilderPanel';
import RuleBuilderInline from './components/RuleBuilder/RuleBuilderInline';
import RuleDetailPanelContent from './components/RuleDetail/RuleDetailPanelContent';
import RuleDetailPanel from './components/RuleDetail/RuleDetailPanel';
import ChatPanel from './components/ChatPanel';
import RulesGrid from './components/RulesGrid';

// AG Grid icons imported from ./components/ag-grid-icons

// Map icon IDs from mock data to React elements
const ICON_MAP: Record<string, React.ReactNode> = {
  dollar: <DollarSign className="w-5 h-5" />,
  tag: <Tag className="w-5 h-5" />,
  file: <FileText className="w-5 h-5" />,
  group: <Group size={20} />,
  alert: <AlertCircle className="w-5 h-5" />,
  schedule: <Schedule size={20} />,
  trending: <TrendingUp size={20} />,
};

function hydrateRules(mockRules: MockRule[]): Rule[] {
  return mockRules.map(({ iconId, ...rest }) => ({
    ...rest,
    icon: ICON_MAP[iconId] || <AlertCircle className="w-5 h-5" />,
  }));
}

function App() {
  const [filterStatus, setFilterStatus] = useState('All');
  const selectRuleDetailsTabRef = useRef<(() => void) | null>(null);
  const selectRuleCreatorTabRef = useRef<(() => void) | null>(null);
  const selectSuggestedRulesTabRef = useRef<(() => void) | null>(null);
  const selectTransactionDetailsTabRef = useRef<(() => void) | null>(null);
  const [isFramesPanelOpen, setIsFramesPanelOpen] = useState(false);
  // Only tabs that are in the default layout model — not all ALL_FRAMES
  const [visibleFrameIds, setVisibleFrameIds] = useState<Set<string>>(
    new Set(['transaction-list-tab', 'rule-list-tab', 'rule-details-tab', 'rule-creator-tab', 'suggested-rules-tab', 'insights-tab', 'transaction-details-tab'])
  );
  const [selectedViewId, setSelectedViewId] = useState('floqast-default');
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [isSaveViewModalOpen, setIsSaveViewModalOpen] = useState(false);
  const [saveViewName, setSaveViewName] = useState('');
  const [saveViewPublic, setSaveViewPublic] = useState(false);
  const [customViews, setCustomViews] = useState<ViewDefinition[]>([]);
  const [layoutKey, setLayoutKey] = useState(0);
  const [editingView, setEditingView] = useState<ViewDefinition | null>(null);
  const [editViewName, setEditViewName] = useState('');
  const [editViewPublic, setEditViewPublic] = useState(false);
  const [isLayoutConfigOpen, setIsLayoutConfigOpen] = useState(false);
  const [isManagePanelsOpen, setIsManagePanelsOpen] = useState(false);
  const [pendingPanelIds, setPendingPanelIds] = useState<Set<string>>(new Set());
  const [favoriteViewIds, setFavoriteViewIds] = useState<Set<string>>(new Set());
  const [ruleCreatorKey, setRuleCreatorKey] = useState(0);
  const [transactionToast, setTransactionToast] = useState<string | null>(null);
  const [ruleToast, setRuleToast] = useState<string | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [isRuleBuilderOpen, setIsRuleBuilderOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'all-rules' | 'all-transactions'>('dashboard');
  const [selectedMonths, setSelectedMonths] = useState<string[]>(['March 2026']);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [deleteModalState, setDeleteModalState] = useState<{ isOpen: boolean; rule: Rule | null }>({
    isOpen: false,
    rule: null
  });
  const [deactivateModalState, setDeactivateModalState] = useState<{ isOpen: boolean; rule: Rule | null }>({
    isOpen: false,
    rule: null
  });
  const [activityLogRule, setActivityLogRule] = useState<Rule | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedRuleForPanel, setSelectedRuleForPanel] = useState<Rule | null>(null);
  const [isRulePanelEditMode, setIsRulePanelEditMode] = useState(false);
  const [ruleFilterForTransactions, setRuleFilterForTransactions] = useState<string | null>(null);
  const [statusFilterForTransactions, setStatusFilterForTransactions] = useState<string | null>(null);
  const [previousAnomaly, setPreviousAnomaly] = useState<Anomaly | null>(null);
  const [isFieldSettingsOpen, setIsFieldSettingsOpen] = useState(false);
  const [visibleFields, setVisibleFields] = useState({
    internalId: true, transactionId: true, type: true, transactionDate: true,
    postingPeriod: true, account: true, amount: true, debitCredit: true,
    currency: true, subsidiary: true, department: true, class: true,
    location: true, name: true, memo: true, createdBy: true, createdDate: true
  });
  const [dashboardSortColumn, setDashboardSortColumn] = useState<'name' | 'status' | 'totalCount' | 'unresolvedCount'>('unresolvedCount');
  const [dashboardSortDirection, setDashboardSortDirection] = useState<'asc' | 'desc'>('desc');
  const [prepopulatedRuleData, setPrepopulatedRuleData] = useState<PrepopulatedRuleData | null>(null);
  const suppressTabSwitchRef = useRef(false);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);

  const [rules, setRules] = useState<Rule[]>(() => hydrateRules(INITIAL_RULES));

  useEffect(() => {
    Promise.all([
      fetch('/api/transactions').then(r => r.json()),
      fetch('/api/comments').then(r => r.json()),
    ]).then(([txns, comments]: [Anomaly[], Comment[]]) => {
      const merged = txns.map((t: Anomaly) => ({
        ...t,
        comments: comments.filter((c: Comment & { transactionId?: string }) => (c as any).transactionId === t.id),
      }));
      const result = applyRulesToAnomalies(hydrateRules(INITIAL_RULES), merged);
      console.log('[Defender] Loaded', merged.length, 'transactions,', comments.length, 'comments,', result.rules.filter(r => r.totalCount > 0).length, 'rules matched');
      setAnomalies(result.anomalies);
      setRules(result.rules);
    }).catch(err => console.error('[Defender] Failed to load data:', err));
  }, []);

  const totalActiveRules = rules.filter(rule => rule.status === 'Active').length;
  const openAnomalies = anomalies.filter(a => a.status === 'Open').length;
  const investigatingAnomalies = anomalies.filter(a => a.status === 'Investigating').length;
  const completedAnomalies = anomalies.filter(a => a.status === 'Resolved').length;
  const totalTransactionsScanned = 31500;

  // Insight type counts for MetricCards
  const standardCheckCount = INSIGHTS.filter(i => i.type === 'Standard Check').length;
  const algorithmCount = INSIGHTS.filter(i => i.type === 'Algorithm').length;
  const accountFingerprintCount = INSIGHTS.filter(i => i.type === 'Account Fingerprint').length;

  const handleSelectAnomaly = (anomaly: Anomaly) => {
    const fullAnomaly = anomalies.find(a => a.id === anomaly.id);
    if (fullAnomaly) setSelectedAnomaly(fullAnomaly);
  };

  const handleUpdateAnomaly = (updatedAnomaly: Anomaly) => {
    const updatedAnomalies = anomalies.map(a => a.id === updatedAnomaly.id ? updatedAnomaly : a);
    const result = applyRulesToAnomalies(rules, updatedAnomalies);
    setRules(result.rules);
    setAnomalies(result.anomalies);
    setSelectedAnomaly(updatedAnomaly);
    // Persist to json-server (fire-and-forget)
    fetch(`http://localhost:3001/transactions/${updatedAnomaly.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: updatedAnomaly.status, comments: updatedAnomaly.comments }),
    }).catch(() => {}); // Silent fail — prototype doesn't need error handling
  };

  const handleToggleFrame = (frameId: string) => {
    const frame = ALL_FRAMES.find(f => f.id === frameId);
    if (!frame || !layoutModelRef.current) return;
    const model = layoutModelRef.current;
    const isCurrentlyVisible = visibleFrameIds.has(frameId);
    if (isCurrentlyVisible) {
      const node = model.getNodeById(frameId);
      if (node) model.doAction(Actions.deleteTab(frameId));
      setVisibleFrameIds(prev => { const next = new Set(prev); next.delete(frameId); return next; });
    } else {
      const tabsetNode = model.getNodeById(frame.tabsetId);
      const tabJson = { type: 'tab', id: frameId, name: frame.name, component: frame.component };
      if (tabsetNode) {
        model.doAction(Actions.addNode(tabJson, frame.tabsetId, DockLocation.CENTER, -1));
      } else {
        const rootNode = model.getRoot();
        const firstTabset = rootNode.getChildren().find((n: any) => n.getType() === 'tabset');
        const targetId = firstTabset ? firstTabset.getId() : rootNode.getId();
        const location = firstTabset ? DockLocation.CENTER : DockLocation.RIGHT;
        model.doAction(Actions.addNode(tabJson, targetId, location, -1));
      }
      setVisibleFrameIds(prev => new Set([...prev, frameId]));
    }
  };

  const handleApplyView = (view: ViewDefinition) => {
    layoutModelRef.current = Model.fromJson(view.layout);
    setVisibleFrameIds(new Set(ALL_FRAMES.map(f => f.id)));
    setSelectedViewId(view.id);
    setIsViewDropdownOpen(false);
    setSelectedAnomaly(null);
    setSelectedRuleForPanel(null);
    setLayoutKey(k => k + 1);
  };

  const handleSaveView = () => {
    if (!saveViewName.trim()) return;
    const newView: ViewDefinition = {
      id: `custom-${Date.now()}`,
      name: saveViewName.trim(),
      layout: layoutModelRef.current ? layoutModelRef.current.toJson() as any : PRESET_VIEWS[0].layout,
    };
    setCustomViews(prev => [...prev, newView]);
    setSelectedViewId(newView.id);
    setSaveViewName('');
    setSaveViewPublic(false);
    setIsSaveViewModalOpen(false);
  };

  const handleOpenEditView = (view: ViewDefinition, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingView(view);
    setEditViewName(view.name);
    setEditViewPublic(view.isPublic ?? false);
    setIsViewDropdownOpen(false);
  };

  const handleUpdateView = () => {
    if (!editingView || !editViewName.trim()) return;
    setCustomViews(prev => prev.map(v =>
      v.id === editingView.id ? { ...v, name: editViewName.trim(), isPublic: editViewPublic } : v
    ));
    setEditingView(null);
  };

  const handleDeleteView = (viewToDelete: ViewDefinition) => {
    setCustomViews(prev => prev.filter(v => v.id !== viewToDelete.id));
    if (selectedViewId === viewToDelete.id) handleApplyView(PRESET_VIEWS[0]);
    setEditingView(null);
  };

  const handleSaveCurrentLayout = () => {
    const currentView = customViews.find(v => v.id === selectedViewId);
    if (currentView && layoutModelRef.current) {
      setCustomViews(prev => prev.map(v =>
        v.id === selectedViewId ? { ...v, layout: layoutModelRef.current!.toJson() as any } : v
      ));
    } else {
      setIsSaveViewModalOpen(true);
    }
    setIsLayoutConfigOpen(false);
  };

  /** Read which ALL_FRAMES tabs actually exist in the current layout model */
  const getActualVisibleIds = (): Set<string> => {
    if (!layoutModelRef.current) return new Set();
    const model = layoutModelRef.current;
    const ids = new Set<string>();
    ALL_FRAMES.forEach(f => {
      try { if (model.getNodeById(f.id)) ids.add(f.id); } catch { /* not in model */ }
    });
    return ids;
  };

  const handleOpenManagePanels = () => {
    // Derive checkbox state from the actual layout model, not stale state
    setPendingPanelIds(getActualVisibleIds());
    setIsManagePanelsOpen(true);
    setIsLayoutConfigOpen(false);
  };

  const handleApplyPanels = () => {
    if (!layoutModelRef.current) return;
    const model = layoutModelRef.current;
    const currentIds = getActualVisibleIds();

    // Remove tabs that were unchecked
    const toRemove = [...currentIds].filter(id => !pendingPanelIds.has(id));
    toRemove.forEach(id => {
      try {
        const node = model.getNodeById(id);
        if (node) model.doAction(Actions.deleteTab(id));
      } catch { /* tab may already be gone */ }
    });

    // Add tabs that were checked but don't currently exist
    const toAdd = [...pendingPanelIds].filter(id => !currentIds.has(id));
    toAdd.forEach(id => {
      const frame = ALL_FRAMES.find(f => f.id === id);
      if (!frame) return;
      const tabJson = { type: 'tab', id: frame.id, name: frame.name, component: frame.component };
      try {
        let targetTabsetId: string | null = null;
        const tabsetNode = model.getNodeById(frame.tabsetId);
        if (tabsetNode) {
          targetTabsetId = frame.tabsetId;
        } else {
          // Target tabset doesn't exist — add to first available tabset
          const rootNode = model.getRoot();
          const firstTabset = rootNode.getChildren().find((n: any) => n.getType() === 'tabset');
          if (firstTabset) targetTabsetId = firstTabset.getId();
        }
        if (targetTabsetId) {
          model.doAction(Actions.addNode(tabJson, targetTabsetId, DockLocation.CENTER, -1));
          console.log(`[ManagePanels] Added tab "${frame.name}" to tabset "${targetTabsetId}"`);
        } else {
          console.warn(`[ManagePanels] No tabset found for "${frame.name}"`);
        }
      } catch (err) {
        console.error(`[ManagePanels] Failed to add tab "${frame.name}":`, err);
      }
    });

    setVisibleFrameIds(new Set(pendingPanelIds));
    setIsManagePanelsOpen(false);
    // Don't force layout remount — doAction already updates the model in-place
  };

  const handleToggleFavorite = (viewId: string) => {
    setFavoriteViewIds(prev => {
      const next = new Set(prev);
      if (next.has(viewId)) next.delete(viewId);
      else next.add(viewId);
      return next;
    });
  };

  const allViews = [...PRESET_VIEWS, ...customViews];
  const sortedViews = [...allViews].sort((a, b) => {
    const aFav = favoriteViewIds.has(a.id) ? 0 : 1;
    const bFav = favoriteViewIds.has(b.id) ? 0 : 1;
    return aFav - bFav;
  });
  const isCustomView = customViews.some(v => v.id === selectedViewId);
  const currentViewDef = allViews.find(v => v.id === selectedViewId);

  const handleUpdateRuleAssignees = (ruleId: string, preparers: string[], reviewers: string[]) => {
    const updatedRules = rules.map(r => r.id === ruleId ? { ...r, preparers, reviewers } : r);
    const result = applyRulesToAnomalies(updatedRules, anomalies);
    setRules(result.rules);
    setAnomalies(result.anomalies);
  };

  const handleTransactionClick = (e: React.MouseEvent, transactionId: string) => {
    e.stopPropagation();
    const anomaly = anomalies.find(a => a.transactionId === transactionId);
    if (anomaly) {
      setSelectedAnomaly(anomaly);
      selectTransactionDetailsTabRef.current?.();
    }
  };

  const availableMonths = ['September 2025', 'October 2025', 'November 2025', 'December 2025', 'January 2026', 'February 2026', 'March 2026'];

  const toggleMonth = (month: string) => {
    setSelectedMonths(prev => prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]);
  };

  const handleEditRule = (rule: Rule) => {
    setSelectedRuleForPanel(rule);
    setIsRulePanelEditMode(true);
    selectRuleDetailsTabRef.current?.();
  };

  const handleCloneRule = (rule: Rule) => {
    setPrepopulatedRuleData({
      name: `Copy of ${rule.name}`, description: rule.description || '',
      naturalLanguageInput: '', logic: rule.logic, status: rule.status,
      preparers: rule.preparers, reviewers: rule.reviewers,
      ruleOwner: rule.ruleOwner, severity: rule.severity
    });
    setEditingRule(null);
    setRuleCreatorKey(k => k + 1);
    selectRuleCreatorTabRef.current?.();
    setRuleToast(`Duplicating "${rule.name}" — edit the copy and save`);
    setTimeout(() => setRuleToast(null), 4000);
  };

  const handleDeleteRuleRequest = (rule: Rule) => { setDeleteModalState({ isOpen: true, rule }); };

  const handleConvertInsightToRule = (name: string, description: string, naturalLanguageInput: string) => {
    setPrepopulatedRuleData({ name, description, naturalLanguageInput });
    setEditingRule(null);
    setRuleCreatorKey(k => k + 1);
    selectRuleCreatorTabRef.current?.();
  };

  const handleDeleteRuleConfirm = () => {
    if (deleteModalState.rule) {
      const updatedRules = rules.filter(r => r.id !== deleteModalState.rule!.id);
      const result = applyRulesToAnomalies(updatedRules, anomalies);
      setRules(result.rules);
      setAnomalies(result.anomalies);
      setDeleteModalState({ isOpen: false, rule: null });
    }
  };

  const handleDeactivateRule = (rule: Rule) => {
    setDeactivateModalState({ isOpen: true, rule });
  };

  const handleDeactivateRuleConfirm = (rule: Rule, _periodScope: 'current' | 'current-future') => {
    const isReactivation = rule.status === 'Deactivated';
    const newStatus = isReactivation ? 'Active' : 'Deactivated';
    const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    const updatedRules = rules.map(r =>
      r.id === rule.id ? {
        ...r,
        status: newStatus as Rule['status'],
        activityLog: [...r.activityLog, {
          id: String(r.activityLog.length + 1),
          timestamp: now,
          author: 'Sarah Johnson',
          action: isReactivation ? 'reactivated' as const : 'deactivated' as const,
          version: r.version || 1,
        }],
      } : r
    );
    const result = applyRulesToAnomalies(updatedRules, anomalies);
    setRules(result.rules);
    setAnomalies(result.anomalies);
    setDeactivateModalState({ isOpen: false, rule: null });
    setRuleToast(isReactivation ? `"${rule.name}" has been reactivated` : `"${rule.name}" has been deactivated`);
    setTimeout(() => setRuleToast(null), 4000);
    // Update selected rule panel if viewing this rule
    if (selectedRuleForPanel?.id === rule.id) {
      setSelectedRuleForPanel(result.rules.find(r => r.id === rule.id) || null);
    }
  };

  const handleSelectRule = (rule: Rule) => {
    setSelectedRuleForPanel(rule);
    setIsRulePanelEditMode(false);
    selectRuleDetailsTabRef.current?.();
  };

  const handleRulePanelClose = () => {
    setSelectedRuleForPanel(null);
    setIsRulePanelEditMode(false);
    setPreviousAnomaly(null);
  };

  const handleRulePanelBack = () => {
    if (previousAnomaly) {
      setSelectedRuleForPanel(null);
      setSelectedAnomaly(previousAnomaly);
      setPreviousAnomaly(null);
    }
  };

  const handleRuleClickFromTransaction = (ruleName: string) => {
    const rule = rules.find(r => r.name === ruleName);
    if (rule && selectedAnomaly) {
      setPreviousAnomaly(selectedAnomaly);
      // Don't clear selectedAnomaly — keep transaction details panel persistent
      setSelectedRuleForPanel(rule);
      setIsRulePanelEditMode(false);
      selectRuleDetailsTabRef.current?.();
    }
  };

  const handleRulePanelEditClick = () => {
    if (selectedRuleForPanel) setIsRulePanelEditMode(true);
  };

  const handleRulePanelShowAnomalies = () => {
    if (selectedRuleForPanel) {
      // Filter the Transaction List in-place (per Figma: filter pills above grid, not a separate view)
      setRuleFilterForTransactions(selectedRuleForPanel.name);
      layoutModel.doAction(Actions.selectTab('transaction-list-tab'));
    }
  };

  const handleRulePanelSave = (ruleData: Partial<Rule> & { id: string }) => {
    const updatedRules = rules.map(r => {
      if (r.id === ruleData.id) {
        const changes: { field: string; oldValue: string; newValue: string }[] = [];
        if (ruleData.name && ruleData.name !== r.name) changes.push({ field: 'Name', oldValue: r.name, newValue: ruleData.name });
        if (ruleData.description !== undefined && ruleData.description !== r.description) changes.push({ field: 'Description', oldValue: r.description || '', newValue: ruleData.description || '' });
        if (ruleData.preparers && JSON.stringify(ruleData.preparers) !== JSON.stringify(r.preparers)) changes.push({ field: 'Preparers', oldValue: r.preparers?.join(', ') || '', newValue: ruleData.preparers.join(', ') });
        if (ruleData.reviewers && JSON.stringify(ruleData.reviewers) !== JSON.stringify(r.reviewers)) changes.push({ field: 'Reviewers', oldValue: r.reviewers?.join(', ') || '', newValue: ruleData.reviewers.join(', ') });
        if (ruleData.status && ruleData.status !== r.status) changes.push({ field: 'Status', oldValue: r.status, newValue: ruleData.status });
        // Track logic and severity changes too
        if (ruleData.logic && JSON.stringify(ruleData.logic) !== JSON.stringify(r.logic)) changes.push({ field: 'Rule Parameters', oldValue: 'Previous conditions', newValue: 'Updated conditions' });
        if (ruleData.severity !== undefined && ruleData.severity !== r.severity) changes.push({ field: 'Severity', oldValue: String(r.severity || 3), newValue: String(ruleData.severity) });
        const hasChanges = changes.length > 0;
        const newVersion = hasChanges ? (r.version || 1) + 1 : (r.version || 1);
        const newEntry: ActivityLogEntry | null = hasChanges ? {
          id: String(Date.now()), timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
          author: 'Current User', action: 'edited', changes, version: newVersion, previousVersion: r.version || 1
        } : null;
        return { ...r, name: ruleData.name || r.name, description: ruleData.description || r.description, preparers: ruleData.preparers || r.preparers, reviewers: ruleData.reviewers || r.reviewers, status: ruleData.status || r.status, logic: ruleData.logic || r.logic, severity: ruleData.severity ?? r.severity, version: newVersion, activityLog: newEntry ? [...r.activityLog, newEntry] : r.activityLog };
      }
      return r;
    });
    const savedRule = updatedRules.find(r => r.id === ruleData.id) || null;
    // Batch: update rules first, keep edit mode temporarily to avoid tree restructure
    setRules(updatedRules);
    setSelectedRuleForPanel(savedRule);
    setRuleToast(`Rule "${savedRule?.name}" saved successfully`);
    setTimeout(() => setRuleToast(null), 4000);
    // Exit edit mode on next frame — allows flexlayout to settle with stable content first
    requestAnimationFrame(() => {
      setIsRulePanelEditMode(false);
    });
    // Persist to json-server
    if (savedRule) {
      fetch(`http://localhost:3001/rules/${ruleData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: savedRule.name, description: savedRule.description, preparers: savedRule.preparers, reviewers: savedRule.reviewers, status: savedRule.status, severity: savedRule.severity, version: savedRule.version }),
      }).catch(() => {});
    }
  };

  const handleFieldToggle = (field: string) => {
    setVisibleFields(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const handleSaveRule = (ruleData: Partial<Rule> & { id?: string }) => {
    let updatedRules: Rule[];
    if (ruleData.id) {
      updatedRules = rules.map(r => {
        if (r.id === ruleData.id) {
          const changes: { field: string; oldValue: string; newValue: string }[] = [];
          if (ruleData.name && ruleData.name !== r.name) changes.push({ field: 'Name', oldValue: r.name, newValue: ruleData.name });
          if (ruleData.description !== undefined && ruleData.description !== r.description) changes.push({ field: 'Description', oldValue: r.description || '', newValue: ruleData.description || '' });
          if (ruleData.preparers && JSON.stringify(ruleData.preparers) !== JSON.stringify(r.preparers)) changes.push({ field: 'Preparers', oldValue: r.preparers?.join(', ') || '', newValue: ruleData.preparers.join(', ') });
          if (ruleData.reviewers && JSON.stringify(ruleData.reviewers) !== JSON.stringify(r.reviewers)) changes.push({ field: 'Reviewers', oldValue: r.reviewers?.join(', ') || '', newValue: ruleData.reviewers.join(', ') });
          if (ruleData.ruleOwner && ruleData.ruleOwner !== r.ruleOwner) changes.push({ field: 'Rule Owner', oldValue: r.ruleOwner, newValue: ruleData.ruleOwner });
          if (ruleData.severity !== undefined && ruleData.severity !== r.severity) changes.push({ field: 'Severity', oldValue: String(r.severity || 5), newValue: String(ruleData.severity) });
          const newEntry: ActivityLogEntry | null = changes.length > 0 ? {
            id: String(Date.now()), timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
            author: 'Current User', action: 'edited', changes
          } : null;
          return { ...r, name: ruleData.name || r.name, description: ruleData.description, logic: ruleData.logic || r.logic, preparers: ruleData.preparers || r.preparers, reviewers: ruleData.reviewers || r.reviewers, ruleOwner: ruleData.ruleOwner || r.ruleOwner, severity: ruleData.severity !== undefined ? ruleData.severity : r.severity, activityLog: newEntry ? [...r.activityLog, newEntry] : r.activityLog };
        }
        return r;
      });
    } else {
      const newRule: Rule = {
        id: String(Date.now()), name: ruleData.name || 'New Rule', totalCount: 0, unresolvedCount: 0,
        icon: <AlertCircle className="w-5 h-5" />, status: 'Active', description: ruleData.description,
        logic: ruleData.logic || { id: 'root', type: 'group', logic: 'AND', items: [] },
        activityLog: [], preparers: ruleData.preparers || ['Dynamic Assignment'],
        reviewers: ruleData.reviewers || ['Dynamic Assignment'],
        ruleOwner: ruleData.ruleOwner || 'Current User', severity: ruleData.severity || 5,
      };
      updatedRules = [...rules, newRule];
    }
    const result = applyRulesToAnomalies(updatedRules, anomalies);
    setRules(result.rules);
    setAnomalies(result.anomalies);
  };

  const handleCloseRuleBuilder = () => {
    setIsRuleBuilderOpen(false);
    setEditingRule(null);
    setPrepopulatedRuleData(null);
  };

  const handleViewActivityLog = (rule: Rule) => { setActivityLogRule(rule); };

  const handleDashboardSort = (column: 'name' | 'status' | 'totalCount' | 'unresolvedCount') => {
    if (dashboardSortColumn === column) {
      setDashboardSortDirection(dashboardSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setDashboardSortColumn(column);
      setDashboardSortDirection('desc');
    }
  };

  const sortedDashboardRules = [...rules].sort((a, b) => {
    let aValue: string | number = a[dashboardSortColumn];
    let bValue: string | number = b[dashboardSortColumn];
    if (dashboardSortColumn === 'totalCount' || dashboardSortColumn === 'unresolvedCount') {
      aValue = a.status === 'Inactive' ? -1 : aValue;
      bValue = b.status === 'Inactive' ? -1 : bValue;
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return dashboardSortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return dashboardSortDirection === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
  });

  const DashboardSortIcon = ({ column }: { column: string }) => {
    if (dashboardSortColumn !== column) return <SwapVert size={12} color="var(--flo-sem-color-icon-muted)" />;
    return dashboardSortDirection === 'asc'
      ? <ArrowUpward size={12} color="var(--flo-sem-color-content-success-medium)" />
      : <ArrowDownward size={12} color="var(--flo-sem-color-content-success-medium)" />;
  };

  const handleAssistantOpen = () => { setIsChatOpen(o => !o); };

  const handleChatCreateRule = (data: PrepopulatedRuleData) => {
    setPrepopulatedRuleData(data);
    setRuleCreatorKey(k => k + 1);
  };

  // ── FlexLayout setup ──
  const layoutModelRef = useRef<Model | null>(null);
  if (!layoutModelRef.current) {
    layoutModelRef.current = Model.fromJson({
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
            { type: 'tab', id: 'insights-tab', name: 'Insights', component: 'insights' },
          ]},
          { type: 'tabset', id: 'transactions-tabset', weight: 50, children: [
            { type: 'tab', id: 'transaction-details-tab', name: 'Transaction Details', component: 'transaction-details' },
          ]},
        ],
      },
    } as any);
  }
  const layoutModel = layoutModelRef.current;

  selectRuleDetailsTabRef.current = () => { layoutModel.doAction(Actions.selectTab('rule-details-tab')); };
  selectRuleCreatorTabRef.current = () => { layoutModel.doAction(Actions.selectTab('rule-creator-tab')); };
  selectSuggestedRulesTabRef.current = () => { layoutModel.doAction(Actions.selectTab('suggested-rules-tab')); };
  selectTransactionDetailsTabRef.current = () => { layoutModel.doAction(Actions.selectTab('transaction-details-tab')); };

  // ── Factory ──
  const factory = (node: TabNode) => {
    try {
      return renderTabContent(node);
    } catch (err) {
      console.error(`[Layout] Factory error for tab "${node.getName()}":`, err);
      return (
        <div className="h-full flex items-center justify-center bg-white" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>
          <div className="text-center">
            <p className="text-sm font-medium">This panel encountered an error</p>
            <p className="text-xs mt-1">Try closing and reopening the tab</p>
          </div>
        </div>
      );
    }
  };

  const renderTabContent = (node: TabNode) => {
    const component = node.getComponent();

    if (component === 'insights') {
      return (
        <div className="h-full flex flex-col bg-white">
          <div style={{ padding: '16px 24px 0', flexShrink: 0 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: '"Museo Sans", sans-serif', color: 'var(--flo-sem-color-text-default)', margin: '0 0 16px 0' }}>
              Insights
            </h1>
          </div>
          <div className="flex-1 min-h-0 px-6 pb-4">
            <InsightsGrid insights={INSIGHTS} />
          </div>
        </div>
      );
    }

    if (component === 'metrics') {
      return (
        <MetricCards
          transactionsScanned={totalTransactionsScanned}
          activeRules={totalActiveRules}
          totalAnomalies={openAnomalies + investigatingAnomalies + completedAnomalies}
          openCount={openAnomalies}
          investigatingCount={investigatingAnomalies}
          resolvedCount={completedAnomalies}
          standardCheckCount={standardCheckCount}
          algorithmCount={algorithmCount}
          accountFingerprintCount={accountFingerprintCount}
          onStatusClick={(status) => { setFilterStatus(status); setCurrentView('all-transactions'); setStatusFilterForTransactions(status); }}
        />
      );
    }

    if (component === 'rules') {
      return (
        <div className="h-full w-full flex flex-col bg-white" style={{ overflow: 'hidden', minHeight: 0, minWidth: 0 }}>
          {/* Page header — Figma: Template / Page-header with "Add Rule" button */}
          <div style={{ padding: '16px 24px', flexShrink: 0 }} className="flex items-end justify-between">
            <span style={{ fontFamily: "'Museo_Sans', sans-serif", fontSize: 24, fontWeight: 700, lineHeight: '32px', color: '#1d2433' }}>
              Rules
            </span>
            <Button icon={<Add size={24} />} onClick={() => { setEditingRule(null); setPrepopulatedRuleData(null); setRuleCreatorKey(k => k + 1); selectRuleCreatorTabRef.current?.(); }}>
              Add Rule
            </Button>
          </div>
          {/* Table container — matches Figma Card Container */}
          <div className="flex flex-col flex-1 min-h-0" style={{ margin: '0 24px 24px 24px', border: '1px solid #e1e6ef', borderRadius: 6, overflow: 'hidden' }}>
            {/* Grouping panel */}
            <div style={{ height: 50, background: '#f8fafc', borderBottom: '1px solid #e1e6ef', display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px', flexShrink: 0 }}>
              <AgGroupIcon />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--flo-sem-color-text-secondary, #424867)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Drag items here</span>
            </div>
            <div className="flex flex-1 min-h-0" style={{ overflow: 'hidden' }}>
              <RulesGrid
                rules={rules}
                anomalies={anomalies}
                calculateRiskScore={calculateRiskScore}
                onRuleClicked={(rule) => { setSelectedRuleForPanel(rule); setIsRulePanelEditMode(false); layoutModel.doAction(Actions.selectTab('rule-details-tab')); }}
                onEditRule={handleEditRule}
                onDuplicateRule={handleCloneRule}
                onDeactivateRule={handleDeactivateRule}
              />
              {/* AG Grid Tool Panel */}
              <div style={{ width: 31, flexShrink: 0, background: '#f8fafc', borderLeft: '1px solid #e1e6ef', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="cursor-pointer" style={{ height: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0' }}>
                  <AgColumnsIcon />
                  <div style={{ display: 'flex', height: 54, alignItems: 'center', justifyContent: 'center', width: 15 }}>
                    <div className="writing-mode-vertical" style={{ fontSize: 13, color: 'var(--flo-sem-color-text-secondary, #424867)', letterSpacing: '0.325px', whiteSpace: 'nowrap' }}>Columns</div>
                  </div>
                </div>
                <div style={{ height: 1, background: '#e1e6ef' }} />
                <div className="cursor-pointer" style={{ height: 84, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0' }}>
                  <AgFiltersIcon />
                  <div style={{ display: 'flex', height: 54, alignItems: 'center', justifyContent: 'center', width: 15 }}>
                    <div className="writing-mode-vertical" style={{ fontSize: 13, color: 'var(--flo-sem-color-text-secondary, #424867)', letterSpacing: '0.325px', whiteSpace: 'nowrap' }}>Filters</div>
                  </div>
                </div>
                <div style={{ height: 1, background: '#e1e6ef' }} />
                <div className="cursor-pointer" style={{ height: 83, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0' }}>
                  <AgViewsIcon />
                  <div style={{ display: 'flex', height: 54, alignItems: 'center', justifyContent: 'center', width: 15 }}>
                    <div className="writing-mode-vertical" style={{ fontSize: 13, color: 'var(--flo-sem-color-text-secondary, #424867)', letterSpacing: '0.325px', whiteSpace: 'nowrap' }}>Views</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div style={{ height: 50, borderTop: '1px solid #e1e6ef', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: 12, color: '#1D2433', flexShrink: 0 }}>
              <span>Showing: <b>{rules.length}</b></span>
            </div>
          </div>
        </div>
      );
    }

    if (component === 'rule-details') {
      if (!selectedRuleForPanel) {
        return (
          <div className="h-full flex items-center justify-center bg-[var(--flo-sem-color-surface-secondary,#f8fafc)]">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--flo-sem-color-surface-secondary,#f1f3f9)] rounded-full flex items-center justify-center mx-auto mb-4"><FileText className="w-8 h-8" style={{ color: 'var(--flo-sem-color-text-tertiary)' }} /></div>
              <p className="text-sm font-medium" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>Select a rule to view details</p>
            </div>
          </div>
        );
      }
      return <RuleDetailPanelContent rule={selectedRuleForPanel} isEditMode={isRulePanelEditMode} onEditClick={handleRulePanelEditClick} onCancelEdit={() => setIsRulePanelEditMode(false)} onShowAnomalies={handleRulePanelShowAnomalies} onSave={handleRulePanelSave} onClose={handleRulePanelClose} onDuplicate={() => handleCloneRule(selectedRuleForPanel)} onDeactivate={() => handleDeactivateRule(selectedRuleForPanel)} />;
    }

    if (component === 'rule-creator') {
      return (
        <div className="h-full flex flex-col bg-white">
          <RuleBuilderInline key={ruleCreatorKey} editingRule={null} prepopulatedData={prepopulatedRuleData} onSave={(ruleData) => { handleSaveRule(ruleData); setPrepopulatedRuleData(null); setRuleCreatorKey(k => k + 1); layoutModel.doAction(Actions.selectTab('rule-list-tab')); }} onCancel={() => { setPrepopulatedRuleData(null); setRuleCreatorKey(k => k + 1); layoutModel.doAction(Actions.selectTab('rule-list-tab')); }} />
        </div>
      );
    }

    if (component === 'suggested-rules') {
      return <SuggestedRules onCreateRule={(name, description, naturalLanguageInput) => handleConvertInsightToRule(name, description, naturalLanguageInput)} />;
    }

    if (component === 'transaction-details') {
      if (!selectedAnomaly) {
        return (
          <div className="h-full flex flex-col items-center justify-center bg-white" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>
            <svg className="w-12 h-12 mb-3 text-[var(--flo-sem-color-border-default,#e1e6ef)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p className="text-sm font-medium" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>Select a transaction to view details</p>
          </div>
        );
      }
      return <DetailPanel anomaly={selectedAnomaly} anomalies={anomalies} rules={rules} onClose={() => setSelectedAnomaly(null)} onUpdateAnomaly={handleUpdateAnomaly} onUpdateRule={handleUpdateRuleAssignees} visibleFields={visibleFields} onRuleClick={handleRuleClickFromTransaction} onTransactionClick={handleTransactionClick} onOpenFieldSettings={() => setIsFieldSettingsOpen(true)} inline />;
    }

    if (component === 'details') {
      let filteredForGrid = filterStatus === 'All' ? anomalies : anomalies.filter(a => a.status === filterStatus);
      // Also filter by rule name if Show Anomalies was clicked
      if (ruleFilterForTransactions) {
        filteredForGrid = filteredForGrid.filter(a => {
          const triggered = Array.isArray(a.triggeredRule) ? a.triggeredRule : a.triggeredRule ? [a.triggeredRule] : [];
          return triggered.includes(ruleFilterForTransactions);
        });
      }
      return (
        <div className="h-full w-full flex flex-col bg-white" style={{ overflow: 'hidden', minHeight: 0, minWidth: 0 }}>
          {transactionToast && (
            <div className="fixed top-4 right-4 z-50" onClick={() => setTransactionToast(null)} style={{
              background: 'var(--flo-sem-color-surface-default, #fff)', border: '1px solid var(--flo-sem-color-border-default, #e1e6ef)',
              borderRadius: 8, padding: '12px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'var(--flo-sem-color-text-default, #1d2433)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {transactionToast}
            </div>
          )}
          {/* Page header */}
          <div style={{ padding: '16px 24px', flexShrink: 0 }}>
            <span style={{ fontFamily: "'Museo_Sans', sans-serif", fontSize: 24, fontWeight: 700, lineHeight: '32px', color: '#1d2433' }}>
              Transactions
            </span>
          </div>
          {/* Filter pills — shown when rule or status filters are active (Design Bar: Benjamin requested this) */}
          {(filterStatus !== 'All' || ruleFilterForTransactions) && (
            <div style={{ padding: '0 24px 8px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {ruleFilterForTransactions && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
                  borderRadius: 16, background: 'var(--flo-sem-color-surface-success-subtle, #ecfff8)', color: 'var(--flo-sem-color-success, #1fac76)',
                  fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500,
                }}>
                  Rule: {ruleFilterForTransactions}
                  <button
                    onClick={() => setRuleFilterForTransactions(null)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: 'var(--flo-sem-color-success, #1fac76)' }}
                  >
                    <Close size={14} />
                  </button>
                </span>
              )}
              {filterStatus !== 'All' && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
                  borderRadius: 16, background: 'var(--flo-sem-color-surface-info-subtle, #e0f2fe)', color: 'var(--flo-sem-color-info, #0369a1)',
                  fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500,
                }}>
                  Status: {filterStatus}
                  <button
                    onClick={() => setFilterStatus('All')}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: 'var(--flo-sem-color-info, #0369a1)' }}
                  >
                    <Close size={14} />
                  </button>
                </span>
              )}
              <button
                onClick={() => { setFilterStatus('All'); setRuleFilterForTransactions(null); }}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px 8px',
                  fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500, color: 'var(--flo-sem-color-text-tertiary, #adb2bb)',
                }}
              >
                Reset
              </button>
            </div>
          )}
          {/* Table container with rounded border — matches Figma Container > Table */}
          <div className="flex flex-col flex-1 min-h-0" style={{ margin: '0 24px 24px 24px', border: '1px solid #e1e6ef', borderRadius: 6, overflow: 'hidden' }}>
          {/* Grouping panel */}
          <div style={{ height: 50, background: '#f8fafc', borderBottom: '1px solid #e1e6ef', display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px', flexShrink: 0 }}>
            <AgGroupIcon />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--flo-sem-color-text-secondary, #424867)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Drag items here</span>
          </div>
          <div className="flex flex-1 min-h-0" style={{ overflow: 'hidden' }}>
            <div style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
              <TransactionGrid rowData={filteredForGrid} onRowClicked={(data) => { setSelectedAnomaly(data); selectTransactionDetailsTabRef.current?.(); }} onTransactionIdClick={() => { setTransactionToast('Opening in ERP...'); setTimeout(() => setTransactionToast(null), 3000); }} onOpenDetail={(data) => { setSelectedAnomaly(data); selectTransactionDetailsTabRef.current?.(); }} selectedId={selectedAnomaly?.id} />
            </div>
            {/* Ag-Grid Tool Panel — Figma node 111:74821 */}
            <div style={{ width: 31, flexShrink: 0, background: '#f8fafc', borderLeft: '1px solid #e1e6ef', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Columns tab */}
              <div className="cursor-pointer" style={{ height: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0' }}>
                <AgColumnsIcon />
                <div style={{ display: 'flex', height: 54, alignItems: 'center', justifyContent: 'center', width: 15 }}>
                  <div className="writing-mode-vertical" style={{ fontSize: 13, color: 'var(--flo-sem-color-text-secondary, #424867)', letterSpacing: '0.325px', whiteSpace: 'nowrap' }}>Columns</div>
                </div>
              </div>
              <div style={{ height: 1, background: '#e1e6ef' }} />
              {/* Filters tab */}
              <div className="cursor-pointer" style={{ height: 84, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0' }}>
                <AgFiltersIcon />
                <div style={{ display: 'flex', height: 54, alignItems: 'center', justifyContent: 'center', width: 15 }}>
                  <div className="writing-mode-vertical" style={{ fontSize: 13, color: 'var(--flo-sem-color-text-secondary, #424867)', letterSpacing: '0.325px', whiteSpace: 'nowrap' }}>Filters</div>
                </div>
              </div>
              <div style={{ height: 1, background: '#e1e6ef' }} />
              {/* Views tab */}
              <div className="cursor-pointer" style={{ height: 83, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 0' }}>
                <AgViewsIcon />
                <div style={{ display: 'flex', height: 54, alignItems: 'center', justifyContent: 'center', width: 15 }}>
                  <div className="writing-mode-vertical" style={{ fontSize: 13, color: 'var(--flo-sem-color-text-secondary, #424867)', letterSpacing: '0.325px', whiteSpace: 'nowrap' }}>Views</div>
                </div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div style={{ height: 50, borderTop: '1px solid #e1e6ef', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: 12, color: '#1D2433', flexShrink: 0 }}>
            <span>Showing: <b>{filteredForGrid.length}</b></span>
            <span style={{ fontWeight: 500 }}>Last refreshed today at 9:00 am</span>
          </div>
          </div>{/* end table container */}
        </div>
      );
    }

    if (component === 'activity-log') {
      const targetAnomaly = selectedAnomaly;
      if (!targetAnomaly) {
        return (
          <div className="h-full flex items-center justify-center bg-[var(--flo-sem-color-surface-secondary,#f8fafc)]">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--flo-sem-color-surface-secondary,#f1f3f9)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Schedule size={32} style={{ color: 'var(--flo-sem-color-text-tertiary)' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--flo-sem-color-text-tertiary)' }}>
                Select a transaction to view its activity log
              </p>
            </div>
          </div>
        );
      }
      // Build activity entries from anomaly data
      const entries = [
        ...(targetAnomaly.comments || []).map(c => ({
          type: 'comment' as const, timestamp: c.timestamp, author: c.author,
          detail: `added a comment: "${c.text.substring(0, 60)}${c.text.length > 60 ? '...' : ''}"`,
        })),
        { type: 'status' as const, timestamp: targetAnomaly.createdDate || targetAnomaly.date, author: 'FloQast', detail: `assigned a status → ${targetAnomaly.status}` },
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return (
        <div className="h-full flex flex-col bg-white">
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #e1e6ef', flexShrink: 0 }}>
            <h3 style={{ fontFamily: '"Museo Sans", sans-serif', fontWeight: 700, fontSize: 16, lineHeight: '20px', margin: 0 }}>Activity Log</h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#adb2bb', margin: '4px 0 0 0' }}>{targetAnomaly.transactionId}</p>
          </div>
          <div className="flex-1 overflow-y-auto" style={{ padding: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {entries.map((entry, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  {i < entries.length - 1 && <div style={{ position: 'absolute', left: 11, top: 28, bottom: 0, width: 1, background: '#e1e6ef' }} />}
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: entry.type === 'comment' ? '#e0f2fe' : '#f1f3f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.type === 'comment' ? '#3d7bf7' : '#6b7280' }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#1d2433', margin: 0 }}>
                        {entry.author} {entry.detail}
                      </p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#adb2bb', margin: '2px 0 0 0' }}>{entry.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // ── Test Harness (dev only) ── exposes state/actions for preview_eval verification
  useEffect(() => {
    (window as any).__test = {
      // Navigation
      selectTab: (tabId: string) => layoutModelRef.current?.doAction(Actions.selectTab(tabId)),

      // Rule operations
      selectRule: (ruleId: string) => {
        const rule = rules.find(r => r.id === ruleId);
        if (rule) { setSelectedRuleForPanel(rule); setIsRulePanelEditMode(false); layoutModelRef.current?.doAction(Actions.selectTab('rule-details-tab')); }
        return rule ? `Selected: ${rule.name}` : 'Rule not found';
      },
      editRule: (ruleId: string) => {
        const rule = rules.find(r => r.id === ruleId);
        if (rule) { setSelectedRuleForPanel(rule); setIsRulePanelEditMode(true); layoutModelRef.current?.doAction(Actions.selectTab('rule-details-tab')); }
        return rule ? `Editing: ${rule.name}` : 'Rule not found';
      },
      duplicateRule: (ruleId: string) => {
        const rule = rules.find(r => r.id === ruleId);
        if (rule) handleCloneRule(rule);
        return rule ? `Duplicating: ${rule.name}` : 'Rule not found';
      },
      deactivateRule: (ruleId: string) => {
        const rule = rules.find(r => r.id === ruleId);
        if (rule) handleDeactivateRule(rule);
        return rule ? `Deactivating: ${rule.name}` : 'Rule not found';
      },

      // Transaction operations
      selectTransaction: (txnId: string) => {
        const txn = anomalies.find(a => a.id === txnId || a.transactionId === txnId);
        if (txn) { setSelectedAnomaly(txn); layoutModelRef.current?.doAction(Actions.selectTab('transaction-details-tab')); }
        return txn ? `Selected: ${txn.transactionId}` : 'Transaction not found';
      },

      // Filter operations
      filterByStatus: (status: string) => { setFilterStatus(status); return `Filtered: ${status}`; },
      clearFilter: () => { setFilterStatus('All'); return 'Filter cleared'; },

      // State getters
      getState: () => ({
        selectedRule: selectedRuleForPanel?.name || null,
        selectedRuleId: selectedRuleForPanel?.id || null,
        selectedTransaction: selectedAnomaly?.transactionId || null,
        isEditMode: isRulePanelEditMode,
        filterStatus,
        ruleCount: rules.length,
        anomalyCount: anomalies.length,
      }),

      // Reset / close overlays
      reset: () => {
        setIsRuleBuilderOpen(false);
        setSelectedRuleForPanel(null);
        setSelectedAnomaly(null);
        setIsRulePanelEditMode(false);
        setFilterStatus('All');
        setDeleteModalState({ isOpen: false, rule: null });
        setDeactivateModalState({ isOpen: false, rule: null });
        return 'Reset complete';
      },

      // Data access
      getRuleIds: () => rules.map(r => ({ id: r.id, name: r.name, status: r.status, version: r.version })),
      getTransactionIds: () => anomalies.slice(0, 10).map(a => ({ id: a.id, txnId: a.transactionId, status: a.status })),
    };
  }, [rules, anomalies, selectedRuleForPanel, selectedAnomaly, isRulePanelEditMode, filterStatus]);

  // ── Render ──
  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Global rule toast */}
      {ruleToast && (
        <div className="fixed top-4 right-4 z-50" onClick={() => setRuleToast(null)} style={{
          background: 'var(--flo-sem-color-surface-default, #fff)', border: '1px solid var(--flo-sem-color-border-default, #e1e6ef)',
          borderRadius: 8, padding: '12px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'var(--flo-sem-color-text-default, #1d2433)',
          display: 'flex', alignItems: 'center', gap: 8, maxWidth: 400,
        }}>
          <span style={{ color: 'var(--flo-sem-color-success, #1fac76)', fontSize: 16 }}>&#10003;</span>
          {ruleToast}
        </div>
      )}
      <SideNavbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header>
          <TopNavbar onAssistantClick={handleAssistantOpen} isChatOpen={isChatOpen} />

          {/* Secondary Navigation */}
          <div style={{ height: '72px', borderBottom: '1px solid var(--flo-sem-color-border-default)', padding: '16px 24px', gap: '16px' }} className="bg-white flex items-center" onClick={() => setIsMonthDropdownOpen(false)}>
            <div className="relative w-[200px]">
              <DropdownButton icon={<CalendarMonth size={20} />} open={isMonthDropdownOpen} onClick={(e: React.MouseEvent) => { e.stopPropagation(); setIsMonthDropdownOpen(!isMonthDropdownOpen); }}>
                {selectedMonths.length === 1 ? selectedMonths[0] : selectedMonths.length === availableMonths.length ? 'February 2026' : `${selectedMonths.length} months selected`}
              </DropdownButton>
              {isMonthDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMonthDropdownOpen(false)} />
                  <div className="absolute top-full left-0 z-20" style={{ marginTop: '4px', width: '224px', background: '#fff', border: '1px solid var(--flo-sem-color-border-default)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '4px 0' }}>
                    {[...availableMonths].reverse().map((month) => (
                      <button key={month} onClick={(e) => { e.stopPropagation(); toggleMonth(month); }} className="w-full flex items-center gap-3 transition-colors" style={{ padding: '8px 16px', fontSize: '13px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '3px', border: selectedMonths.includes(month) ? '1px solid var(--flo-base-color-core-600)' : '1px solid var(--flo-sem-color-border-default)', background: selectedMonths.includes(month) ? 'var(--flo-base-color-core-600)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {selectedMonths.includes(month) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span style={{ color: 'var(--flo-sem-color-text-default)' }}>{month}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex-1" />
            <div className="flex items-center" style={{ gap: '12px' }}>
              {/* View selector dropdown */}
              <div className="relative flex items-center" style={{ gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--flo-sem-color-text-default)', whiteSpace: 'nowrap' }}>Layout</span>
                <DropdownButton onClick={() => setIsViewDropdownOpen(o => !o)} open={isViewDropdownOpen}>{currentViewDef?.name ?? 'FloQast Default'}</DropdownButton>
                {isViewDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsViewDropdownOpen(false)} />
                    <div className="absolute right-0 top-full z-50" style={{ marginTop: '4px', width: '260px', background: '#fff', border: '1px solid #e1e6ef', borderRadius: '6px', boxShadow: '0px 1px 2px rgba(0,0,0,0.05)', padding: '4px 0' }}>
                      {sortedViews.map((view) => {
                        const isActive = selectedViewId === view.id;
                        const isFav = favoriteViewIds.has(view.id);
                        return (
                          <div key={view.id} className="group flex items-center" style={isActive ? { padding: '6px 9px' } : {}}>
                            <button onClick={() => handleApplyView(view)} style={{ display: 'flex', alignItems: 'center', flex: 1, height: '45px', padding: isActive ? '10px' : '16px', fontSize: '12px', fontWeight: 600, lineHeight: '18px', color: isActive ? '#0a0d14' : '#424867', background: isActive ? '#e1e6ef' : 'transparent', borderRadius: isActive ? '6px' : '0', border: 'none', cursor: 'pointer', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{view.name}</button>
                            <button onClick={(e) => { e.stopPropagation(); handleToggleFavorite(view.id); }} className={`transition-opacity ${isFav ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                              {isFav ? <Star size={14} color="#f59e0b" /> : <StarOutline size={14} color="#adb2bb" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
              {/* Layout config gear button */}
              <div className="relative">
                <button onClick={() => { setIsLayoutConfigOpen(o => !o); setIsViewDropdownOpen(false); }} className="flex items-center justify-center rounded-[6px] border border-solid transition-colors hover:bg-[var(--flo-sem-color-surface-secondary,#f8fafc)] cursor-pointer" style={{ width: 40, height: 40, borderColor: 'var(--flo-sem-color-border-default, #cbd2e1)', background: '#fff' }}>
                  <Settings size={20} color="var(--flo-sem-color-text-secondary, #424867)" />
                </button>
                {isLayoutConfigOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsLayoutConfigOpen(false)} />
                    <div className="absolute right-0 top-full z-50" style={{ marginTop: '4px', width: '196px', background: '#fff', border: '1px solid #e1e6ef', borderRadius: '6px', boxShadow: '0px 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                      <button onClick={handleSaveCurrentLayout} className="w-full flex items-center gap-[8px] hover:bg-[var(--flo-sem-color-surface-secondary,#f8fafc)] transition-colors" style={{ height: 45, padding: '0 16px', fontSize: 12, fontWeight: 600, color: 'var(--flo-sem-color-text-secondary, #424867)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>Save Changes</button>
                      <div style={{ borderBottom: '1px solid #e1e6ef' }} />
                      <button onClick={handleOpenManagePanels} className="w-full flex items-center gap-[8px] hover:bg-[var(--flo-sem-color-surface-secondary,#f8fafc)] transition-colors" style={{ height: 45, padding: '0 16px', fontSize: 12, fontWeight: 600, color: 'var(--flo-sem-color-text-secondary, #424867)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}><Add size={20} color="var(--flo-sem-color-text-secondary, #424867)" />Manage Panels</button>
                      <div style={{ borderBottom: '1px solid #e1e6ef' }} />
                      <button onClick={() => { setIsLayoutConfigOpen(false); setIsSaveViewModalOpen(true); }} className="w-full flex items-center gap-[8px] hover:bg-[var(--flo-sem-color-surface-secondary,#f8fafc)] transition-colors" style={{ height: 45, padding: '0 16px', fontSize: 12, fontWeight: 600, color: 'var(--flo-sem-color-text-secondary, #424867)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>Save as New Layout</button>
                      <button onClick={() => { setIsLayoutConfigOpen(false); if (currentViewDef) { setEditingView(currentViewDef); setEditViewName(currentViewDef.name); setEditViewPublic(currentViewDef.isPublic ?? false); } }} className="w-full flex items-center gap-[8px] hover:bg-[var(--flo-sem-color-surface-secondary,#f8fafc)] transition-colors" style={{ height: 45, padding: '0 16px', fontSize: 12, fontWeight: 600, color: 'var(--flo-sem-color-text-secondary, #424867)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>Layout Settings</button>
                      <div style={{ borderBottom: '1px solid #e1e6ef' }} />
                      <button onClick={() => { if (isCustomView && currentViewDef) { handleDeleteView(currentViewDef); } setIsLayoutConfigOpen(false); }} className="w-full flex items-center gap-[8px] hover:bg-[var(--flo-sem-color-surface-secondary,#f8fafc)] transition-colors" style={{ height: 45, padding: '0 16px', fontSize: 12, fontWeight: 600, color: isCustomView ? '#424867' : '#adb2bb', background: 'transparent', border: 'none', cursor: isCustomView ? 'pointer' : 'default', textAlign: 'left', opacity: isCustomView ? 1 : 0.5 }} disabled={!isCustomView}><Delete size={20} color={isCustomView ? '#424867' : '#adb2bb'} />Delete Layout</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-[var(--flo-sem-color-surface-secondary,#f8fafc)]">
          {currentView === 'all-rules' ? (
            <AllRulesView rules={rules} onBack={() => setCurrentView('dashboard')} onCreateRule={() => { setEditingRule(null); setPrepopulatedRuleData(null); setRuleCreatorKey(k => k + 1); selectRuleCreatorTabRef.current?.(); }} onEditRule={handleEditRule} onDeleteRule={handleDeleteRuleRequest} onDeactivateRule={handleDeactivateRule} onViewActivityLog={handleViewActivityLog} onSelectRule={handleSelectRule} onCloneRule={handleCloneRule} anomalies={anomalies} calculateRiskScore={calculateRiskScore} getRiskScoreColor={getRiskScoreColor} getRiskScoreBreakdown={getRiskScoreBreakdown} />
          ) : currentView === 'all-transactions' ? (
            <AllTransactionsView anomalies={anomalies} onBack={() => { setCurrentView('dashboard'); setRuleFilterForTransactions(null); setStatusFilterForTransactions(null); }} onSelectAnomaly={handleSelectAnomaly} ruleFilter={ruleFilterForTransactions} statusFilter={statusFilterForTransactions} onTransactionClick={handleTransactionClick} rules={rules} calculateRiskScore={calculateRiskScore} getRiskScoreColor={getRiskScoreColor} />
          ) : (
            <div className="h-full">
              <Layout
                key={layoutKey}
                model={layoutModel}
                factory={factory}
                onAction={(action) => {
                  if (action.type === Actions.RENAME_TAB) return undefined;
                  // During save operations, suppress unwanted tab switches from Modal focus
                  if (suppressTabSwitchRef.current && action.type === Actions.SELECT_TAB) return undefined;
                  return action;
                }}
                onModelChange={() => {
                  // Sync visibleFrameIds only when tabs are actually added/removed
                  // (not on every internal flexlayout re-render to avoid destabilizing active tab)
                  if (layoutModelRef.current) {
                    const currentIds = new Set<string>();
                    ALL_FRAMES.forEach(f => {
                      try { if (layoutModelRef.current!.getNodeById(f.id)) currentIds.add(f.id); } catch { /* not in model */ }
                    });
                    // Only update state if the set actually changed (prevents re-render loops)
                    setVisibleFrameIds(prev => {
                      if (prev.size !== currentIds.size) return currentIds;
                      for (const id of currentIds) { if (!prev.has(id)) return currentIds; }
                      return prev; // Same set — skip update
                    });
                  }
                }}
              />
            </div>
          )}
        </main>

        {currentView !== 'dashboard' && <DetailPanel anomaly={selectedAnomaly} anomalies={anomalies} rules={rules} onClose={() => setSelectedAnomaly(null)} onUpdateAnomaly={handleUpdateAnomaly} onUpdateRule={handleUpdateRuleAssignees} visibleFields={visibleFields} onRuleClick={handleRuleClickFromTransaction} onTransactionClick={handleTransactionClick} onOpenFieldSettings={() => setIsFieldSettingsOpen(true)} />}

        <RuleBuilderPanel isOpen={isRuleBuilderOpen} onClose={handleCloseRuleBuilder} editingRule={editingRule} onSave={handleSaveRule} prepopulatedData={prepopulatedRuleData} />
        <FieldSettingsPanel isOpen={isFieldSettingsOpen} onClose={() => setIsFieldSettingsOpen(false)} visibleFields={visibleFields} onFieldToggle={handleFieldToggle} />

        {/* Edit View Modal */}
        <Modal open={!!editingView} onOpenChange={(open: boolean) => { if (!open) setEditingView(null); }} size="sm">
          {editingView && (
            <div style={{ padding: 24 }}>
              <div className="flex items-center justify-between mb-5"><h2 style={{ fontFamily: "'Museo Sans', sans-serif", fontSize: 18, fontWeight: 700, color: 'var(--flo-sem-color-text-default)' }}>Edit Layout</h2></div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Layout Name</label>
                  <input type="text" value={editViewName} onChange={e => setEditViewName(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--flo-sem-color-border-default, #e1e6ef)', borderRadius: 6, fontSize: 13, fontFamily: 'Inter, sans-serif', color: 'var(--flo-sem-color-text-default)', outline: 'none' }} autoFocus onKeyDown={e => { if (e.key === 'Enter') handleUpdateView(); }} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Public Layout</span>
                    <Tooltip><Tooltip.Trigger><Info size={14} color="var(--flo-sem-color-icon-muted)" /></Tooltip.Trigger><Tooltip.Content side="right" hasArrow size="sm">If enabled, other users will be able to use your layout.</Tooltip.Content></Tooltip>
                  </div>
                  <Toggle checked={editViewPublic} onChange={() => setEditViewPublic(p => !p)} size="sm" />
                </div>
              </div>
              <div className="flex items-center gap-3" style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--flo-sem-color-border-default, #e1e6ef)' }}>
                <Button color="danger" variant="outlined" onClick={() => handleDeleteView(editingView!)} size="sm"><Delete size={14} /> Delete Layout</Button>
                <div className="flex-1 flex items-center gap-2 justify-end">
                  <Button variant="outlined" color="dark" onClick={() => setEditingView(null)} size="sm">Cancel</Button>
                  <Button onClick={handleUpdateView} disabled={!editViewName.trim()} size="sm">Save</Button>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Manage Panels Modal */}
        <Modal open={isManagePanelsOpen} onOpenChange={(open: boolean) => { if (!open) setIsManagePanelsOpen(false); }} size="sm">
          <div style={{ padding: 24 }}>
            <h2 style={{ fontFamily: "'Museo Sans', sans-serif", fontSize: 18, fontWeight: 700, lineHeight: '24px', color: 'var(--flo-sem-color-text-default)', margin: '0 0 8px 0' }}>Manage Panels</h2>
            <p style={{ fontSize: 12, color: 'var(--flo-sem-color-text-secondary)', lineHeight: '18px', margin: '0 0 20px 0' }}>Select the panels you want visible for your layout</p>
            <div className="flex flex-col" style={{ gap: 12 }}>
              <Checkbox
                label="Select All"
                checked={pendingPanelIds.size === ALL_FRAMES.length}
                onCheckedChange={() => {
                  if (pendingPanelIds.size === ALL_FRAMES.length) setPendingPanelIds(new Set());
                  else setPendingPanelIds(new Set(ALL_FRAMES.map(f => f.id)));
                }}
              />
              {ALL_FRAMES.map(frame => (
                <Checkbox
                  key={frame.id}
                  label={frame.name}
                  checked={pendingPanelIds.has(frame.id)}
                  onCheckedChange={() => {
                    setPendingPanelIds(prev => {
                      const next = new Set(prev);
                      if (next.has(frame.id)) next.delete(frame.id);
                      else next.add(frame.id);
                      return next;
                    });
                  }}
                />
              ))}
            </div>
            <div className="flex items-center justify-end gap-3" style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--flo-sem-color-border-default, #e1e6ef)' }}>
              <Button variant="outlined" color="dark" onClick={() => setIsManagePanelsOpen(false)} size="sm">Cancel</Button>
              <Button onClick={handleApplyPanels} size="sm">Apply</Button>
            </div>
          </div>
        </Modal>

        {/* Save View Modal */}
        <Modal open={isSaveViewModalOpen} onOpenChange={(open: boolean) => { if (!open) setIsSaveViewModalOpen(false); }} size="sm">
          <div style={{ padding: 24 }}>
            <h2 style={{ fontFamily: "'Museo Sans', sans-serif", fontSize: 18, fontWeight: 700, color: 'var(--flo-sem-color-text-default)', margin: '0 0 20px 0' }}>Create New Layout</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Layout Name</label>
                <input type="text" value={saveViewName} onChange={e => setSaveViewName(e.target.value)} placeholder="Enter layout name" style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--flo-sem-color-border-default, #e1e6ef)', borderRadius: 6, fontSize: 13, fontFamily: 'Inter, sans-serif', color: 'var(--flo-sem-color-text-default)', outline: 'none' }} autoFocus onKeyDown={e => { if (e.key === 'Enter') handleSaveView(); }} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--flo-sem-color-text-secondary)' }}>Public Layout</span>
                  <Tooltip><Tooltip.Trigger><Info size={14} color="var(--flo-sem-color-icon-muted)" /></Tooltip.Trigger><Tooltip.Content side="right" hasArrow size="sm">If enabled, other users will be able to use your layout.</Tooltip.Content></Tooltip>
                </div>
                <Toggle checked={saveViewPublic} onChange={() => setSaveViewPublic(p => !p)} size="sm" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3" style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--flo-sem-color-border-default, #e1e6ef)' }}>
              <Button variant="outlined" color="dark" onClick={() => setIsSaveViewModalOpen(false)} size="sm">Cancel</Button>
              <Button onClick={handleSaveView} disabled={!saveViewName.trim()} size="sm">Save Layout</Button>
            </div>
          </div>
        </Modal>

        <DeleteRuleModal isOpen={deleteModalState.isOpen} onClose={() => setDeleteModalState({ isOpen: false, rule: null })} onConfirm={handleDeleteRuleConfirm} ruleName={deleteModalState.rule?.name || ''} />
        <DeactivateRuleModal rule={deactivateModalState.rule} isOpen={deactivateModalState.isOpen} onClose={() => setDeactivateModalState({ isOpen: false, rule: null })} onConfirm={handleDeactivateRuleConfirm} />
        <ActivityLogPanel rule={activityLogRule} onClose={() => setActivityLogRule(null)} />

        {/* Insights modal removed — now renders as InsightsGrid in the insights tab */}
      </div>

      {/* Chatbot Panel */}
      <ChatPanel isOpen={isChatOpen} selectedAnomaly={selectedAnomaly} rules={rules} onCreateRule={handleChatCreateRule} onSelectRuleCreatorTab={() => selectRuleCreatorTabRef.current?.()} layoutModelRef={layoutModelRef} />
    </div>
  );
}

export default App;
