import type { TaskDetail } from '@/types';

// Task detail configs for all 26 JLR tasks, keyed by task id.
// Tier 1 (full): ids 4, 6, 7, 13, 17
// Tier 2 (medium): ids 8, 9, 10, 12, 14, 15, 18, 22
// Tier 3 (light): ids 1, 2, 3, 5, 11, 16, 19, 20, 21, 23, 24, 25, 26

export const taskDetails: Record<number, TaskDetail> = {
  // ============================================================
  // TIER 1 — Full detail (AI workflow, evidence, notes, sign-off)
  // ============================================================

  4: {
    tier: 1,
    title: 'Bank Reconciliation — Barclays GBP Operating',
    description: 'Monthly reconciliation of the Barclays GBP operating account. High transaction volume from vehicle sales receipts, supplier payments, and payroll. Auto-matched by Bank Reconciliation Agent.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Bank Reconciliations',
    frequency: 'Monthly',
    currentStage: 'review',
    assignees: [
      { name: 'Emma Harrison', initials: 'EH', role: 'Senior Financial Analyst', isPrimary: true, badge: 'Preparer' },
      { name: 'Tom Bradley', initials: 'TB', role: 'Financial Controller', badge: 'Reviewer' },
    ],
    preparedByAgent: 'Bank Reconciliation Agent',
    workflowStages: [
      { id: 'sync', label: 'Bank Feed Synced', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'validate', label: 'Auto-Matched', status: 'complete', agent: 'Bank Reconciliation Agent' },
      { id: 'categorize', label: 'Auto-Prepared', status: 'complete', agent: 'Bank Reconciliation Agent' },
      { id: 'review', label: 'Complete', status: 'complete', agent: 'Tom Bradley' },
    ],
    isSignedOff: true,
    journalEntrySubmitted: true,
    whySurfaced: 'Complete — all 2,847 transactions matched. Signed off by Tom Bradley on Feb 17.',
    systemVerified: [
      'Bank statement balance: £14,892,340.00',
      'GL balance: £14,892,340.00',
      'Variance: £0.00',
      'All 2,847 transactions auto-matched',
    ],
    aiPreparedWork: [
      'Downloaded Barclays bank feed via API',
      'Auto-matched 2,847 of 2,847 transactions (100%)',
      'Validated closing balance against GL',
      'No exceptions — clean reconciliation',
    ],
    supportingEvidence: [
      {
        section: 'Reconciliation Summary',
        items: [
          { label: 'Statement Balance', value: '£14,892,340.00' },
          { label: 'GL Balance', value: '£14,892,340.00' },
          { label: 'Transactions Matched', value: '2,847 of 2,847 (100%)' },
          { label: 'Exceptions', value: '0' },
        ],
      },
    ],
    reviewNotes: [
      {
        id: '1',
        author: 'Bank Reconciliation Agent',
        initials: 'AI',
        time: 'Feb 16',
        message: 'Barclays GBP operating reconciliation complete. All 2,847 transactions auto-matched. Closing balance validated at £14,892,340.00. No exceptions identified.',
        isAgent: true,
      },
      {
        id: '2',
        author: 'Tom Bradley',
        initials: 'TB',
        time: 'Feb 17',
        message: 'Clean recon — approved and signed off. Nice work on the 100% match rate.',
      },
    ],
    attachments: [
      { id: '1', name: 'Barclays_GBP_Recon_Feb2026.xlsx', size: '1.2 MB', type: 'excel', isAgentGenerated: true },
    ],
    automationInsight: {
      aiPreparedWork: ['Auto-matched all 2,847 transactions', 'Closing balance validation'],
      humanReviewedWork: ['Standard review and sign-off'],
      futureImprovements: ['Strong candidate for fully automated reconciliation with auto-sign-off'],
    },
  },

  6: {
    tier: 1,
    title: 'Bank Reconciliation — JPMorgan USD Operating',
    description: 'Monthly reconciliation of the JPMorgan USD operating account. Used for North American vehicle sales, USD-denominated supplier payments, and intercompany settlements.',
    period: 'February 2026',
    entity: 'JLR North America LLC',
    folder: 'Bank Reconciliations',
    frequency: 'Monthly',
    currentStage: 'review',
    assignees: [
      { name: 'Emma Harrison', initials: 'EH', role: 'Senior Financial Analyst', isPrimary: true, badge: 'Preparer' },
      { name: 'Richard Keane', initials: 'RK', role: 'Tax & Treasury Manager', badge: 'Reviewer' },
    ],
    preparedByAgent: 'Bank Reconciliation Agent',
    workflowStages: [
      { id: 'sync', label: 'Bank Feed Synced', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'validate', label: 'Auto-Matched', status: 'complete', agent: 'Bank Reconciliation Agent' },
      { id: 'categorize', label: 'Auto-Prepared', status: 'complete', agent: 'Bank Reconciliation Agent' },
      { id: 'review', label: 'Ready for Review', status: 'current', agent: 'You' },
    ],
    whySurfaced: 'Due tomorrow — 847 of 853 transactions matched. 6 FX timing exceptions require review before sign-off.',
    systemVerified: [
      'Bank statement balance: $8,234,100.00',
      'GL balance: $8,257,200.00',
      'Variance: $23,100.00 (6 FX timing items)',
      '847 of 853 transactions auto-matched (99.3%)',
    ],
    aiPreparedWork: [
      'Downloaded JPMorgan bank feed via API',
      'Auto-matched 847 of 853 transactions (99.3%)',
      '6 exceptions identified as FX timing differences on intercompany settlements',
      'Proposed adjusting entries for FX timing items',
    ],
    nextActionSteps: [
      'Review 6 FX timing exceptions — all relate to GBP/USD intercompany settlements',
      'Confirm proposed adjusting entries ($23,100 total)',
      'Sign off reconciliation',
    ],
    supportingEvidence: [
      {
        section: 'Reconciliation Summary',
        items: [
          { label: 'Statement Balance', value: '$8,234,100.00' },
          { label: 'GL Balance', value: '$8,257,200.00' },
          { label: 'Variance', value: '$23,100.00' },
          { label: 'Match Rate', value: '99.3% (847/853)' },
        ],
      },
      {
        section: 'Exception Analysis',
        items: [
          { label: 'Exception Type', value: 'FX Timing Differences' },
          { label: 'Count', value: '6 items' },
          { label: 'Total Amount', value: '$23,100.00' },
          { label: 'Expected Resolution', value: 'Reverse in March 2026' },
        ],
      },
    ],
    reviewNotes: [
      {
        id: '1',
        author: 'Bank Reconciliation Agent',
        initials: 'AI',
        time: '6 hours ago',
        message: 'JPMorgan USD reconciliation prepared. 847 of 853 transactions matched. 6 exceptions identified — all are FX timing differences on intercompany settlements between JLR UK and JLR North America. Proposed JE prepared.',
        isAgent: true,
      },
      {
        id: '2',
        author: 'Emma Harrison',
        initials: 'EH',
        time: '3 hours ago',
        message: 'Confirmed the 6 exceptions are all intercompany FX timing. GBP/USD rate moved 0.3% between settlement date and value date. These will naturally reverse in March.',
      },
    ],
    attachments: [
      { id: '1', name: 'JPMorgan_USD_Recon_Feb2026.xlsx', size: '890 KB', type: 'excel', isAgentGenerated: true },
      { id: '2', name: 'FX_Exception_Analysis.pdf', size: '145 KB', type: 'pdf', isAgentGenerated: true },
    ],
  },

  7: {
    tier: 1,
    title: 'Vehicle Inventory Reconciliation — Solihull Manufacturing Plant',
    description: 'Reconcile vehicle inventory at the Solihull manufacturing plant (Range Rover, Range Rover Sport, Range Rover Velar, Discovery). Verify VIN-level counts against SAP production system and dealer delivery records.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Inventory',
    frequency: 'Monthly',
    currentStage: 'categorize',
    assignees: [
      { name: 'Priya Sharma', initials: 'PS', role: 'Cost Accountant', isPrimary: true, badge: 'Preparer' },
      { name: 'Tom Bradley', initials: 'TB', role: 'Financial Controller', badge: 'Reviewer' },
    ],
    preparedByAgent: 'Inventory Agent',
    workflowStages: [
      { id: 'sync', label: 'SAP Data Synced', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'validate', label: 'VIN Matching', status: 'complete', agent: 'Inventory Agent' },
      { id: 'categorize', label: 'Draft Ready', status: 'current', agent: 'Inventory Agent' },
      { id: 'review', label: 'Review', status: 'pending' },
    ],
    whySurfaced: 'Due Mar 3 — 92% complete. 12 VIN discrepancies identified across Range Rover and Range Rover Sport lines. Blocks warranty provision and COGS analysis downstream.',
    systemVerified: [
      'Total vehicles at Solihull: 5,264',
      'VINs matched to SAP: 4,847 (92.1%)',
      'In-transit to dealers: 405 units',
      'VIN discrepancies: 12 units',
    ],
    aiPreparedWork: [
      'Extracted production completion data from SAP PP module',
      'Cross-referenced VINs against dealer delivery confirmations',
      'Identified 12 VIN discrepancies — 8 are in-transit vehicles, 4 require physical verification',
      'Calculated standard cost valuation: £248.3M',
    ],
    nextActionSteps: [
      'Investigate 4 VINs requiring physical verification at Solihull compound',
      'Confirm 8 in-transit vehicles against shipping manifests',
      'Finalise inventory valuation adjustments',
      'Submit for Tom Bradley review',
    ],
    supportingEvidence: [
      {
        section: 'Inventory Summary by Model',
        items: [
          { label: 'Range Rover', value: '1,847 units (£112.4M)' },
          { label: 'Range Rover Sport', value: '2,134 units (£98.2M)' },
          { label: 'Range Rover Velar', value: '892 units (£28.4M)' },
          { label: 'Discovery', value: '391 units (£9.3M)' },
        ],
      },
      {
        section: 'Discrepancy Analysis',
        items: [
          { label: 'In-Transit (Confirmed)', value: '8 units' },
          { label: 'Physical Verification Needed', value: '4 units' },
          { label: 'Estimated Valuation Impact', value: '£42,000' },
        ],
      },
    ],
    reviewNotes: [
      {
        id: '1',
        author: 'Inventory Agent',
        initials: 'AI',
        time: '4 hours ago',
        message: 'Solihull inventory reconciliation 92% complete. 4,847 VINs matched. 12 discrepancies identified: 8 confirmed in-transit to dealers (shipping manifests obtained), 4 require physical compound check. Total inventory value: £248.3M.',
        isAgent: true,
      },
      {
        id: '2',
        author: 'Priya Sharma',
        initials: 'PS',
        time: '2 hours ago',
        message: 'Physical check scheduled for tomorrow morning on the 4 unmatched VINs. All are Range Rover Sports — likely late production completions not yet posted in SAP.',
      },
      {
        id: '3',
        author: 'Tom Bradley',
        initials: 'TB',
        time: '1 hour ago',
        message: 'Thanks Priya. The £42K variance is immaterial but let us get it right. Please update once physical check is done.',
      },
    ],
    attachments: [
      { id: '1', name: 'Solihull_Inventory_VIN_Feb2026.xlsx', size: '4.2 MB', type: 'excel', isAgentGenerated: true },
      { id: '2', name: 'In_Transit_Shipping_Manifests.pdf', size: '890 KB', type: 'pdf', isAgentGenerated: false },
    ],
    criticalPath: {
      isOnPath: true,
      downstreamTasks: 3,
      pathDescription: 'Blocks warranty provision (#13), COGS analysis (#25), and close package (#26)',
      upstream: [
        { task: 'SAP data extraction', status: 'Complete', time: 'Feb 10' },
      ],
      downstream: [
        { task: 'Warranty provision calculation', status: 'Blocked', assignee: 'Emma Harrison' },
        { task: 'COGS & gross margin analysis', status: 'Not Started', assignee: 'Priya Sharma' },
        { task: 'Monthly close package', status: 'Not Started', assignee: 'Emma Harrison' },
      ],
    },
  },

  13: {
    tier: 1,
    title: 'Warranty Provision Calculation — All Vehicle Lines',
    description: 'Calculate the monthly warranty provision across all JLR vehicle lines. Requires completed vehicle inventory counts, dealer warranty claims data, and historical claims analysis. Uses actuarial model for long-tail warranty obligations.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Provisions',
    frequency: 'Monthly',
    currentStage: 'sync',
    assignees: [
      { name: 'Emma Harrison', initials: 'EH', role: 'Senior Financial Analyst', isPrimary: true, badge: 'Preparer' },
      { name: 'Tom Bradley', initials: 'TB', role: 'Financial Controller', badge: 'Reviewer' },
    ],
    preparedByAgent: 'Warranty Provision Agent',
    workflowStages: [
      { id: 'sync', label: 'Gather Data', status: 'current', agent: 'Warranty Provision Agent' },
      { id: 'validate', label: 'Validate', status: 'pending' },
      { id: 'categorize', label: 'Calculate', status: 'pending' },
      { id: 'review', label: 'Review', status: 'pending' },
    ],
    whySurfaced: 'Blocked — waiting on Solihull and Castle Bromwich vehicle inventory reconciliations plus dealer claims data. On the critical path to close package.',
    systemVerified: [
      'Current provision balance: £892M',
      'Prior month charge: £34.2M',
      'Dealer claims received: 4,234 (partial)',
      'Awaiting: vehicle inventory completion from 2 plants',
    ],
    requiresHumanReview: [
      'Actuarial assumptions for 5-year warranty tail',
      'New model launch warranty rates (Defender PHEV)',
      'Recall campaign cost estimates (TCB-2026-003)',
    ],
    supportingEvidence: [
      {
        section: 'Provision Overview',
        items: [
          { label: 'Opening Balance', value: '£892,000,000' },
          { label: 'Prior Month Charge', value: '£34,200,000' },
          { label: 'Claims Settled YTD', value: '£187,400,000' },
          { label: 'Pending Claims', value: '4,234' },
        ],
      },
    ],
    reviewNotes: [
      {
        id: '1',
        author: 'Warranty Provision Agent',
        initials: 'AI',
        time: '6 hours ago',
        message: 'Partial analysis prepared using available dealer claims data (4,234 claims). Full calculation blocked on vehicle inventory counts from Solihull (#7) and Castle Bromwich (#8). Preliminary estimate: £36.1M monthly charge (↑5.6% vs prior month due to Defender PHEV launch warranty costs).',
        isAgent: true,
      },
      {
        id: '2',
        author: 'Emma Harrison',
        initials: 'EH',
        time: '4 hours ago',
        message: 'The Defender PHEV battery warranty component is driving the increase. Actuarial team has provided updated 5-year tail assumptions — will incorporate once inventory data is available.',
      },
      {
        id: '3',
        author: 'Tom Bradley',
        initials: 'TB',
        time: '2 hours ago',
        message: 'Need to discuss the recall campaign TCB-2026-003 provision — legal has updated the cost range to £8-12M. Let us use the midpoint for now.',
      },
    ],
    attachments: [
      { id: '1', name: 'Warranty_Preliminary_Analysis_Feb2026.xlsx', size: '2.8 MB', type: 'excel', isAgentGenerated: true },
      { id: '2', name: 'Actuarial_Assumptions_Q1_2026.pdf', size: '234 KB', type: 'pdf', isAgentGenerated: false },
    ],
    dependencies: [
      { id: 'dep-13-2', taskName: 'Dealer management system extract', type: 'blocked-by', status: 'complete', assignee: 'Emma Harrison', assigneeInitials: 'EH' },
      { id: 'dep-13-7', taskName: 'Vehicle inventory — Solihull', type: 'blocked-by', status: 'in-progress', assignee: 'Priya Sharma', assigneeInitials: 'PS' },
      { id: 'dep-13-8', taskName: 'Vehicle inventory — Castle Bromwich', type: 'blocked-by', status: 'in-progress', assignee: 'Priya Sharma', assigneeInitials: 'PS' },
    ],
    criticalPath: {
      isOnPath: true,
      downstreamTasks: 1,
      pathDescription: 'Blocks monthly close package (#26)',
      upstream: [
        { task: 'Dealer management system extract', status: 'Complete', time: 'Feb 12' },
        { task: 'Vehicle inventory — Solihull', status: 'In Progress' },
        { task: 'Vehicle inventory — Castle Bromwich', status: 'In Progress' },
      ],
      downstream: [
        { task: 'Monthly close package — Board reporting', status: 'Not Started', assignee: 'Emma Harrison' },
      ],
    },
  },

  17: {
    tier: 1,
    title: 'Revenue Recognition — Wholesale to Dealers (IFRS 15)',
    description: 'Recognise wholesale vehicle revenue under IFRS 15. Validate transfer of control to dealers, assess variable consideration (volume bonuses, fleet discounts), and determine SSP for multi-element arrangements including service packages.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Revenue',
    frequency: 'Monthly',
    currentStage: 'sync',
    assignees: [
      { name: 'Emma Harrison', initials: 'EH', role: 'Senior Financial Analyst', isPrimary: true, badge: 'Preparer' },
      { name: 'Tom Bradley', initials: 'TB', role: 'Financial Controller', badge: 'Reviewer' },
    ],
    workflowStages: [
      { id: 'sync', label: 'Gather Data', status: 'current' },
      { id: 'validate', label: 'Validate', status: 'pending' },
      { id: 'categorize', label: 'Analyse', status: 'pending' },
      { id: 'review', label: 'Review', status: 'pending' },
    ],
    whySurfaced: 'Blocked — waiting on dealer AR reconciliation (#10) approval and dealer system data (#2). 3 fleet contracts with variable consideration need manual SSP allocation.',
    requiresHumanReview: [
      'Fleet contract variable consideration — 3 contracts totalling £12.4M',
      'SSP allocation for bundled service packages on Range Rover fleet deals',
      'Right of return estimate for demo/courtesy vehicles',
    ],
    supportingEvidence: [
      {
        section: 'Revenue Summary',
        items: [
          { label: 'Wholesale Deliveries', value: '8,342 vehicles' },
          { label: 'Estimated Revenue', value: '£412,000,000' },
          { label: 'Fleet Contracts', value: '3 (variable consideration)' },
          { label: 'Service Package Bundles', value: '1,247 units' },
        ],
      },
    ],
    reviewNotes: [
      {
        id: '1',
        author: 'Emma Harrison',
        initials: 'EH',
        time: '5 hours ago',
        message: 'Wholesale deliveries data is ready but I need the approved dealer AR reconciliation before I can complete the IFRS 15 analysis. The 3 fleet contracts have variable consideration — Hertz (£4.2M), Enterprise (£5.1M), and Addison Lee (£3.1M).',
      },
      {
        id: '2',
        author: 'Tom Bradley',
        initials: 'TB',
        time: '3 hours ago',
        message: 'The dealer AR is in my review queue — will prioritise. For the fleet contracts, use the expected value method for Hertz and Enterprise, most likely amount for Addison Lee per our policy.',
      },
    ],
    attachments: [
      { id: '1', name: 'Wholesale_Deliveries_Feb2026.xlsx', size: '3.4 MB', type: 'excel', isAgentGenerated: false },
      { id: '2', name: 'Fleet_Contract_Analysis.xlsx', size: '567 KB', type: 'excel', isAgentGenerated: false },
    ],
    dependencies: [
      { id: 'dep-17-2', taskName: 'Dealer management system extract', type: 'blocked-by', status: 'complete', assignee: 'Emma Harrison', assigneeInitials: 'EH' },
      { id: 'dep-17-10', taskName: 'Accounts receivable — Dealer network', type: 'blocked-by', status: 'in-progress', assignee: 'Emma Harrison', assigneeInitials: 'EH' },
    ],
  },

  // ============================================================
  // TIER 2 — Medium detail
  // ============================================================

  8: {
    tier: 2,
    title: 'Vehicle Inventory Reconciliation — Castle Bromwich',
    description: 'Reconcile vehicle inventory at Castle Bromwich (Jaguar F-PACE, E-PACE, XF). Verify VIN-level counts against SAP production system.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Inventory',
    frequency: 'Monthly',
    currentStage: 'categorize',
    assignees: [
      { name: 'Priya Sharma', initials: 'PS', role: 'Cost Accountant', isPrimary: true, badge: 'Preparer' },
      { name: 'Tom Bradley', initials: 'TB', role: 'Financial Controller', badge: 'Reviewer' },
    ],
    preparedByAgent: 'Inventory Agent',
    workflowStages: [
      { id: 'sync', label: 'SAP Data Synced', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'validate', label: 'VIN Matching', status: 'complete', agent: 'Inventory Agent' },
      { id: 'categorize', label: 'Draft Ready', status: 'current', agent: 'Inventory Agent' },
      { id: 'review', label: 'Review', status: 'pending' },
    ],
    supportingEvidence: [
      {
        section: 'Inventory Summary',
        items: [
          { label: 'Total Vehicles', value: '2,891 units' },
          { label: 'VINs Matched', value: '2,888 (99.9%)' },
          { label: 'Discrepancies', value: '3 units (body shop WIP)' },
          { label: 'Total Value', value: '£94.7M' },
        ],
      },
    ],
    reviewNotes: [
      {
        id: '1',
        author: 'Inventory Agent',
        initials: 'AI',
        time: '3 hours ago',
        message: 'Castle Bromwich reconciliation near-complete. 2,888 of 2,891 VINs matched. 3 units in body shop rework not yet on production system — adjustment proposed.',
        isAgent: true,
      },
      {
        id: '2',
        author: 'Priya Sharma',
        initials: 'PS',
        time: '1 hour ago',
        message: 'Confirmed 3 units in body shop — all F-PACE models undergoing paint rework. Will be production-complete by end of week.',
      },
    ],
    attachments: [
      { id: '1', name: 'CastleBromwich_Inventory_Feb2026.xlsx', size: '2.8 MB', type: 'excel', isAgentGenerated: true },
    ],
  },

  9: {
    tier: 2,
    title: 'Raw Materials & Work-in-Progress Valuation',
    description: 'Value raw materials and WIP across all manufacturing plants. Includes aluminium body panels, powertrain components, electronic modules, and battery packs for PHEV/BEV lines.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Inventory',
    frequency: 'Monthly',
    currentStage: 'categorize',
    assignees: [
      { name: 'Priya Sharma', initials: 'PS', role: 'Cost Accountant', isPrimary: true, badge: 'Preparer' },
      { name: 'Richard Keane', initials: 'RK', role: 'Tax & Treasury Manager', badge: 'Reviewer' },
    ],
    workflowStages: [
      { id: 'sync', label: 'SAP Data Synced', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'validate', label: 'Validated', status: 'complete' },
      { id: 'categorize', label: 'In Progress', status: 'current' },
      { id: 'review', label: 'Review', status: 'pending' },
    ],
    supportingEvidence: [
      {
        section: 'Materials Summary',
        items: [
          { label: 'Raw Materials', value: '£187,400,000' },
          { label: 'WIP', value: '£342,100,000' },
          { label: 'Battery Packs (BEV/PHEV)', value: '£89,200,000' },
          { label: 'Aluminium Stock', value: '£56,800,000' },
        ],
      },
    ],
    reviewNotes: [
      {
        id: '1',
        author: 'Priya Sharma',
        initials: 'PS',
        time: '2 hours ago',
        message: 'Working through the BEV battery pack valuation. Lithium prices dropped 8% in Feb — need to assess NRV impact on £89.2M battery inventory. Aluminium pricing stable.',
      },
    ],
    attachments: [
      { id: '1', name: 'RM_WIP_Valuation_Feb2026.xlsx', size: '5.6 MB', type: 'excel', isAgentGenerated: false },
    ],
  },

  10: {
    tier: 2,
    title: 'Accounts Receivable — Dealer Network',
    description: 'Reconcile accounts receivable across the UK and European dealer network. Validate vehicle delivery confirmations, financing arrangements, and outstanding balances.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Accounts Receivable',
    frequency: 'Monthly',
    currentStage: 'review',
    assignees: [
      { name: 'Emma Harrison', initials: 'EH', role: 'Senior Financial Analyst', isPrimary: true, badge: 'Preparer' },
      { name: 'Tom Bradley', initials: 'TB', role: 'Financial Controller', badge: 'Reviewer' },
    ],
    preparedByAgent: 'AR Agent',
    workflowStages: [
      { id: 'sync', label: 'Dealer Data Synced', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'validate', label: 'Validated', status: 'complete', agent: 'AR Agent' },
      { id: 'categorize', label: 'Prepared', status: 'complete', agent: 'AR Agent' },
      { id: 'review', label: 'Ready for Review', status: 'current', agent: 'You' },
    ],
    supportingEvidence: [
      {
        section: 'AR Summary',
        items: [
          { label: 'Total Dealer AR', value: '£234,800,000' },
          { label: 'Current (0-30 days)', value: '£198,200,000 (84.4%)' },
          { label: '31-60 Days', value: '£28,400,000 (12.1%)' },
          { label: '61+ Days', value: '£8,200,000 (3.5%)' },
        ],
      },
    ],
    reviewNotes: [
      {
        id: '1',
        author: 'AR Agent',
        initials: 'AI',
        time: '5 hours ago',
        message: 'Dealer AR reconciliation complete. Total balance: £234.8M across 187 dealers. 84.4% current. 6 dealers flagged for overdue balances >60 days totalling £8.2M — all have approved payment plans.',
        isAgent: true,
      },
      {
        id: '2',
        author: 'Emma Harrison',
        initials: 'EH',
        time: '2 hours ago',
        message: 'Verified the 6 overdue dealers — all have signed payment plans. The largest is Sytner Group at £3.1M (Range Rover allocation dispute resolved last week).',
      },
    ],
    attachments: [
      { id: '1', name: 'Dealer_AR_Aging_Feb2026.xlsx', size: '1.8 MB', type: 'excel', isAgentGenerated: true },
    ],
  },

  12: {
    tier: 2,
    title: 'Manufacturing Overhead Allocation',
    description: 'Allocate manufacturing overhead across vehicle lines at Solihull and Castle Bromwich plants. Includes utilities, maintenance, quality control, and plant management costs.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Cost Accounting',
    frequency: 'Monthly',
    currentStage: 'categorize',
    assignees: [
      { name: 'Priya Sharma', initials: 'PS', role: 'Cost Accountant', isPrimary: true, badge: 'Preparer' },
      { name: 'Richard Keane', initials: 'RK', role: 'Tax & Treasury Manager', badge: 'Reviewer' },
    ],
    workflowStages: [
      { id: 'sync', label: 'Data Synced', status: 'complete' },
      { id: 'validate', label: 'Validated', status: 'complete' },
      { id: 'categorize', label: 'In Progress', status: 'current' },
      { id: 'review', label: 'Review', status: 'pending' },
    ],
    supportingEvidence: [
      {
        section: 'Overhead Summary',
        items: [
          { label: 'Total Overhead', value: '£42,300,000' },
          { label: 'Solihull Allocation', value: '£28,100,000 (66.4%)' },
          { label: 'Castle Bromwich', value: '£14,200,000 (33.6%)' },
          { label: 'Variance vs Standard', value: '+£1.2M (2.9%)' },
        ],
      },
    ],
    reviewNotes: [
      {
        id: '1',
        author: 'Priya Sharma',
        initials: 'PS',
        time: '3 hours ago',
        message: 'Overhead allocation in progress. Utilities were £1.2M over standard due to increased BEV battery conditioning requirements at Solihull. Recommend updating standard rates for Q2.',
      },
    ],
  },

  14: {
    tier: 2,
    title: 'R&D Capitalisation Review — MLA Platform',
    description: 'Review R&D expenditure for the Modular Longitudinal Architecture (MLA) flexible platform programme. Assess capitalisation criteria under IAS 38 for development costs.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'R&D',
    frequency: 'Monthly',
    currentStage: 'categorize',
    assignees: [
      { name: 'Priya Sharma', initials: 'PS', role: 'Cost Accountant', isPrimary: true, badge: 'Preparer' },
      { name: 'Tom Bradley', initials: 'TB', role: 'Financial Controller', badge: 'Reviewer' },
    ],
    workflowStages: [
      { id: 'sync', label: 'Data Synced', status: 'complete' },
      { id: 'validate', label: 'Validated', status: 'complete' },
      { id: 'categorize', label: 'In Progress', status: 'current' },
      { id: 'review', label: 'Review', status: 'pending' },
    ],
    supportingEvidence: [
      {
        section: 'R&D Summary — MLA Platform',
        items: [
          { label: 'Feb Spend', value: '£18,400,000' },
          { label: 'Capitalised (IAS 38)', value: '£14,200,000 (77.2%)' },
          { label: 'Expensed', value: '£4,200,000 (22.8%)' },
          { label: 'Programme Spend to Date', value: '£1.24B' },
        ],
      },
    ],
    reviewNotes: [
      {
        id: '1',
        author: 'Priya Sharma',
        initials: 'PS',
        time: '4 hours ago',
        message: 'MLA platform spend review in progress. February spend of £18.4M — £14.2M meets IAS 38 criteria for capitalisation. The £4.2M expense relates to early-stage research on solid-state battery integration.',
      },
    ],
  },

  15: {
    tier: 2,
    title: 'Fixed Asset Depreciation — Plant & Tooling',
    description: 'Calculate monthly depreciation for manufacturing plant, production tooling, dies, jigs, and fixtures across all UK facilities.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Fixed Assets',
    frequency: 'Monthly',
    currentStage: 'review',
    assignees: [
      { name: 'Priya Sharma', initials: 'PS', role: 'Cost Accountant', isPrimary: true, badge: 'Preparer' },
      { name: 'Richard Keane', initials: 'RK', role: 'Tax & Treasury Manager', badge: 'Reviewer' },
    ],
    preparedByAgent: 'Fixed Asset Agent',
    workflowStages: [
      { id: 'sync', label: 'Data Synced', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'validate', label: 'Validated', status: 'complete', agent: 'Fixed Asset Agent' },
      { id: 'categorize', label: 'JE Suggested', status: 'complete', agent: 'Fixed Asset Agent' },
      { id: 'review', label: 'Ready for Review', status: 'current', agent: 'You' },
    ],
    supportingEvidence: [
      {
        section: 'Depreciation Summary',
        items: [
          { label: 'Total Monthly Depreciation', value: '£67,800,000' },
          { label: 'Plant & Buildings', value: '£12,400,000' },
          { label: 'Production Tooling', value: '£38,200,000' },
          { label: 'New BEV Line Equipment', value: '£17,200,000' },
        ],
      },
    ],
    reviewNotes: [
      {
        id: '1',
        author: 'Fixed Asset Agent',
        initials: 'AI',
        time: '4 hours ago',
        message: 'Depreciation schedule validated against fixed asset register. 12,847 assets verified. New BEV production line equipment at Solihull (£412M NBV) commenced depreciation from Feb 1. Suggested JE: £67.8M.',
        isAgent: true,
      },
      {
        id: '2',
        author: 'Priya Sharma',
        initials: 'PS',
        time: '2 hours ago',
        message: 'Depreciation looks correct. The BEV line depreciation is the big new item — 7-year useful life per the capex approval. Ready for Richard\'s review.',
      },
    ],
    attachments: [
      { id: '1', name: 'Depreciation_Schedule_Feb2026.xlsx', size: '3.4 MB', type: 'excel', isAgentGenerated: true },
    ],
  },

  18: {
    tier: 2,
    title: 'Dealer Incentive & Bonus Accruals',
    description: 'Calculate dealer incentive and bonus accruals across UK and European dealer networks. Includes volume bonuses, marketing contributions, and special programme incentives.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Accruals',
    frequency: 'Monthly',
    currentStage: 'categorize',
    assignees: [
      { name: 'Emma Harrison', initials: 'EH', role: 'Senior Financial Analyst', isPrimary: true, badge: 'Preparer' },
      { name: 'Tom Bradley', initials: 'TB', role: 'Financial Controller', badge: 'Reviewer' },
    ],
    workflowStages: [
      { id: 'sync', label: 'Data Synced', status: 'complete' },
      { id: 'validate', label: 'Validated', status: 'complete' },
      { id: 'categorize', label: 'Draft Ready', status: 'current' },
      { id: 'review', label: 'Review', status: 'pending' },
    ],
    supportingEvidence: [
      {
        section: 'Incentive Summary',
        items: [
          { label: 'Total Accrual', value: '£8,200,000' },
          { label: 'Volume Bonuses', value: '£4,800,000' },
          { label: 'Marketing Contributions', value: '£2,100,000' },
          { label: 'Special Programmes', value: '£1,300,000' },
        ],
      },
    ],
    reviewNotes: [
      {
        id: '1',
        author: 'Emma Harrison',
        initials: 'EH',
        time: '3 hours ago',
        message: 'Dealer incentive accrual draft ready — £8.2M total vs £7.6M prior month. Increase driven by Q1 volume bonus programme for Range Rover Sport and new Defender PHEV launch incentives.',
      },
    ],
  },

  22: {
    tier: 2,
    title: 'Intercompany Reconciliation — UK ↔ India (Tata Motors)',
    description: 'Reconcile intercompany transactions between JLR UK and Tata Motors India. Includes engineering services, technology licensing, CKD kit shipments, and management charges.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Intercompany Reconciliations',
    frequency: 'Monthly',
    currentStage: 'sync',
    assignees: [
      { name: 'Priya Sharma', initials: 'PS', role: 'Cost Accountant', isPrimary: true, badge: 'Preparer' },
      { name: 'Tom Bradley', initials: 'TB', role: 'Financial Controller', badge: 'Reviewer' },
    ],
    workflowStages: [
      { id: 'sync', label: 'Gather Data', status: 'pending' },
      { id: 'validate', label: 'Validate', status: 'pending' },
      { id: 'categorize', label: 'Reconcile', status: 'pending' },
      { id: 'review', label: 'Review', status: 'pending' },
    ],
    supportingEvidence: [
      {
        section: 'IC Summary — India',
        items: [
          { label: 'Engineering Services', value: '£4,200,000' },
          { label: 'Technology Licensing', value: '£8,900,000' },
          { label: 'Management Charges', value: '£1,200,000' },
          { label: 'Expected Variance', value: '£50K–£100K (timing)' },
        ],
      },
    ],
  },

  // ============================================================
  // TIER 3 — Light detail
  // ============================================================

  1: {
    tier: 3,
    title: 'SAP Data Extraction — Vehicle Production & Sales',
    description: 'Extract production completion, vehicle shipment, and sales order data from SAP for the February close period.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Data Extracts',
    frequency: 'Monthly',
    currentStage: 'review',
    assignees: [
      { name: 'Emma Harrison', initials: 'EH', role: 'Senior Financial Analyst', isPrimary: true, badge: 'Preparer' },
      { name: 'Tom Bradley', initials: 'TB', role: 'Financial Controller', badge: 'Reviewer' },
    ],
    preparedByAgent: 'ERP Sync Agent',
    workflowStages: [
      { id: 'sync', label: 'Connected', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'validate', label: 'Extracted', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'categorize', label: 'Validated', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'review', label: 'Complete', status: 'complete', agent: 'Tom Bradley' },
    ],
    isSignedOff: true,
    automationInsight: {
      aiPreparedWork: ['Auto-extracted 847K records from SAP PP, SD, and FI modules', 'Validated data completeness against control totals'],
      humanReviewedWork: ['Spot-checked extraction against SAP reports'],
      futureImprovements: ['Fully automated — no human intervention needed'],
    },
  },

  2: {
    tier: 3,
    title: 'Dealer Management System Extract — UK & Europe',
    description: 'Extract dealer sales, warranty claims, and incentive programme data from the JLR Dealer Management System.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Data Extracts',
    frequency: 'Monthly',
    currentStage: 'review',
    assignees: [
      { name: 'Emma Harrison', initials: 'EH', role: 'Senior Financial Analyst', isPrimary: true, badge: 'Preparer' },
      { name: 'Tom Bradley', initials: 'TB', role: 'Financial Controller', badge: 'Reviewer' },
    ],
    preparedByAgent: 'ERP Sync Agent',
    workflowStages: [
      { id: 'sync', label: 'Connected', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'validate', label: 'Extracted', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'categorize', label: 'Validated', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'review', label: 'Complete', status: 'complete', agent: 'Tom Bradley' },
    ],
    isSignedOff: true,
  },

  3: {
    tier: 3,
    title: 'Treasury & Hedging Data Extract',
    description: 'Extract FX hedge positions, interest rate swaps, and cash management data from the treasury management system.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Data Extracts',
    frequency: 'Monthly',
    currentStage: 'review',
    assignees: [
      { name: 'Emma Harrison', initials: 'EH', role: 'Senior Financial Analyst', isPrimary: true, badge: 'Preparer' },
      { name: 'Richard Keane', initials: 'RK', role: 'Tax & Treasury Manager', badge: 'Reviewer' },
    ],
    preparedByAgent: 'ERP Sync Agent',
    workflowStages: [
      { id: 'sync', label: 'Connected', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'validate', label: 'Extracted', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'categorize', label: 'Validated', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'review', label: 'Complete', status: 'complete', agent: 'Richard Keane' },
    ],
    isSignedOff: true,
  },

  5: {
    tier: 3,
    title: 'Bank Reconciliation — HSBC EUR Commercial',
    description: 'Monthly reconciliation of the HSBC EUR commercial account used for European dealer transactions and supplier payments.',
    period: 'February 2026',
    entity: 'JLR Europe GmbH',
    folder: 'Bank Reconciliations',
    frequency: 'Monthly',
    currentStage: 'review',
    assignees: [
      { name: 'Emma Harrison', initials: 'EH', role: 'Senior Financial Analyst', isPrimary: true, badge: 'Preparer' },
      { name: 'Tom Bradley', initials: 'TB', role: 'Financial Controller', badge: 'Reviewer' },
    ],
    preparedByAgent: 'Bank Reconciliation Agent',
    workflowStages: [
      { id: 'sync', label: 'Bank Feed Synced', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'validate', label: 'Auto-Matched', status: 'complete', agent: 'Bank Reconciliation Agent' },
      { id: 'categorize', label: 'Auto-Prepared', status: 'complete', agent: 'Bank Reconciliation Agent' },
      { id: 'review', label: 'Complete', status: 'complete', agent: 'Tom Bradley' },
    ],
    isSignedOff: true,
    journalEntrySubmitted: true,
  },

  11: {
    tier: 3,
    title: 'Accounts Payable — Tier 1 Supplier Reconciliation',
    description: 'Reconcile AP balances with Tier 1 automotive suppliers including aluminium providers, powertrain component manufacturers, and electronic module suppliers.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Accounts Payable',
    frequency: 'Monthly',
    currentStage: 'review',
    assignees: [
      { name: 'Priya Sharma', initials: 'PS', role: 'Cost Accountant', isPrimary: true, badge: 'Preparer' },
      { name: 'Richard Keane', initials: 'RK', role: 'Tax & Treasury Manager', badge: 'Reviewer' },
    ],
    preparedByAgent: 'AP Agent',
    workflowStages: [
      { id: 'sync', label: 'Data Synced', status: 'complete', agent: 'ERP Sync Agent' },
      { id: 'validate', label: 'Validated', status: 'complete', agent: 'AP Agent' },
      { id: 'categorize', label: 'Prepared', status: 'complete', agent: 'AP Agent' },
      { id: 'review', label: 'Ready for Review', status: 'current', agent: 'You' },
    ],
    reviewNotes: [
      {
        id: '1',
        author: 'Priya Sharma',
        initials: 'PS',
        time: '3 hours ago',
        message: 'Tier 1 supplier AP reconciliation complete. Total AP: £342M across 47 suppliers. All within payment terms. 3 GRN discrepancies flagged — all under £50K.',
      },
    ],
  },

  16: {
    tier: 3,
    title: 'FX Translation & Hedge Effectiveness Testing',
    description: 'Perform FX translation for non-GBP entities and test hedge effectiveness under IFRS 9 for GBP/EUR and GBP/USD hedging programmes.',
    period: 'February 2026',
    entity: 'JLR Group',
    folder: 'Treasury',
    frequency: 'Monthly',
    currentStage: 'sync',
    assignees: [
      { name: 'Emma Harrison', initials: 'EH', role: 'Senior Financial Analyst', isPrimary: true, badge: 'Preparer' },
      { name: 'Richard Keane', initials: 'RK', role: 'Tax & Treasury Manager', badge: 'Reviewer' },
    ],
    workflowStages: [
      { id: 'sync', label: 'Gather Data', status: 'pending' },
      { id: 'validate', label: 'Translate', status: 'pending' },
      { id: 'categorize', label: 'Test Hedges', status: 'pending' },
      { id: 'review', label: 'Review', status: 'pending' },
    ],
    dependencies: [
      { id: 'dep-16-3', taskName: 'Treasury & hedging data extract', type: 'blocked-by', status: 'complete', assignee: 'Emma Harrison', assigneeInitials: 'EH' },
      { id: 'dep-16-6', taskName: 'Bank reconciliation — JPMorgan USD', type: 'blocked-by', status: 'in-progress', assignee: 'Emma Harrison', assigneeInitials: 'EH' },
    ],
  },

  19: {
    tier: 3,
    title: 'IFRS 16 Lease Liability — Manufacturing Facilities',
    description: 'Calculate monthly IFRS 16 lease liability amortisation and ROU asset adjustments for manufacturing facilities, office spaces, and equipment leases.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Leases',
    frequency: 'Monthly',
    currentStage: 'sync',
    assignees: [
      { name: 'Priya Sharma', initials: 'PS', role: 'Cost Accountant', isPrimary: true, badge: 'Preparer' },
      { name: 'Richard Keane', initials: 'RK', role: 'Tax & Treasury Manager', badge: 'Reviewer' },
    ],
    workflowStages: [
      { id: 'sync', label: 'Data Sync', status: 'pending' },
      { id: 'validate', label: 'Validate', status: 'pending' },
      { id: 'categorize', label: 'Calculate', status: 'pending' },
      { id: 'review', label: 'Review', status: 'pending' },
    ],
  },

  20: {
    tier: 3,
    title: 'Pension Obligation Adjustment — UK Defined Benefit Scheme',
    description: 'Calculate monthly pension obligation adjustment for the UK defined benefit scheme under IAS 19. Includes service cost, interest cost, and any remeasurement adjustments.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Pensions',
    frequency: 'Monthly',
    currentStage: 'categorize',
    assignees: [
      { name: 'Priya Sharma', initials: 'PS', role: 'Cost Accountant', isPrimary: true, badge: 'Preparer' },
      { name: 'Richard Keane', initials: 'RK', role: 'Tax & Treasury Manager', badge: 'Reviewer' },
    ],
    workflowStages: [
      { id: 'sync', label: 'Actuarial Data', status: 'complete' },
      { id: 'validate', label: 'Validated', status: 'complete' },
      { id: 'categorize', label: 'In Progress', status: 'current' },
      { id: 'review', label: 'Review', status: 'pending' },
    ],
    reviewNotes: [
      {
        id: '1',
        author: 'Priya Sharma',
        initials: 'PS',
        time: '5 hours ago',
        message: 'Pension adjustment in progress. Actuarial update received — discount rate unchanged at 4.8%. Monthly service cost: £2.1M, interest cost: £4.3M. No remeasurement triggers.',
      },
    ],
  },

  21: {
    tier: 3,
    title: 'Intercompany Reconciliation — UK ↔ China JV',
    description: 'Reconcile intercompany transactions between JLR UK and the Chery Jaguar Land Rover China JV. Includes CKD kit shipments, technology royalties, and management service charges.',
    period: 'February 2026',
    entity: 'JLR Group',
    folder: 'Intercompany Reconciliations',
    frequency: 'Monthly',
    currentStage: 'sync',
    assignees: [
      { name: 'Priya Sharma', initials: 'PS', role: 'Cost Accountant', isPrimary: true, badge: 'Preparer' },
      { name: 'Tom Bradley', initials: 'TB', role: 'Financial Controller', badge: 'Reviewer' },
    ],
    workflowStages: [
      { id: 'sync', label: 'Gather Data', status: 'pending' },
      { id: 'validate', label: 'Validate', status: 'pending' },
      { id: 'categorize', label: 'Reconcile', status: 'pending' },
      { id: 'review', label: 'Review', status: 'pending' },
    ],
    dependencies: [
      { id: 'dep-21-11', taskName: 'AP — Tier 1 supplier reconciliation', type: 'blocked-by', status: 'in-progress', assignee: 'Priya Sharma', assigneeInitials: 'PS' },
    ],
  },

  23: {
    tier: 3,
    title: 'Consolidation Elimination Entries',
    description: 'Prepare and post consolidation elimination entries for intercompany transactions across UK, China JV, India, and European entities.',
    period: 'February 2026',
    entity: 'JLR Group',
    folder: 'Consolidation',
    frequency: 'Monthly',
    currentStage: 'sync',
    assignees: [
      { name: 'Priya Sharma', initials: 'PS', role: 'Cost Accountant', isPrimary: true, badge: 'Preparer' },
      { name: 'Richard Keane', initials: 'RK', role: 'Tax & Treasury Manager', badge: 'Reviewer' },
    ],
    workflowStages: [
      { id: 'sync', label: 'Gather Data', status: 'pending' },
      { id: 'validate', label: 'Validate', status: 'pending' },
      { id: 'categorize', label: 'Prepare Entries', status: 'pending' },
      { id: 'review', label: 'Review', status: 'pending' },
    ],
    dependencies: [
      { id: 'dep-23-21', taskName: 'IC reconciliation — UK ↔ China JV', type: 'blocked-by', status: 'not-started', assignee: 'Priya Sharma', assigneeInitials: 'PS' },
      { id: 'dep-23-22', taskName: 'IC reconciliation — UK ↔ India', type: 'blocked-by', status: 'not-started', assignee: 'Priya Sharma', assigneeInitials: 'PS' },
    ],
  },

  24: {
    tier: 3,
    title: 'Tax Provision — Multi-Jurisdiction',
    description: 'Calculate monthly tax provision across UK, US, European, China, and India jurisdictions. Requires completed revenue recognition and FX translation.',
    period: 'February 2026',
    entity: 'JLR Group',
    folder: 'Tax',
    frequency: 'Monthly',
    currentStage: 'sync',
    assignees: [
      { name: 'Emma Harrison', initials: 'EH', role: 'Senior Financial Analyst', isPrimary: true, badge: 'Preparer' },
      { name: 'Richard Keane', initials: 'RK', role: 'Tax & Treasury Manager', badge: 'Reviewer' },
    ],
    workflowStages: [
      { id: 'sync', label: 'Gather Data', status: 'pending' },
      { id: 'validate', label: 'Validate', status: 'pending' },
      { id: 'categorize', label: 'Calculate', status: 'pending' },
      { id: 'review', label: 'Review', status: 'pending' },
    ],
    dependencies: [
      { id: 'dep-24-17', taskName: 'Revenue recognition — Wholesale', type: 'blocked-by', status: 'blocked', assignee: 'Emma Harrison', assigneeInitials: 'EH' },
      { id: 'dep-24-16', taskName: 'FX translation & hedge testing', type: 'blocked-by', status: 'not-started', assignee: 'Emma Harrison', assigneeInitials: 'EH' },
    ],
  },

  25: {
    tier: 3,
    title: 'COGS & Gross Margin Analysis — Vehicle Lines',
    description: 'Analyse cost of goods sold and gross margins by vehicle line (Range Rover, Defender, Discovery, Jaguar). Requires completed inventory recs, overhead allocation, and revenue recognition.',
    period: 'February 2026',
    entity: 'JLR UK Ltd',
    folder: 'Cost Accounting',
    frequency: 'Monthly',
    currentStage: 'sync',
    assignees: [
      { name: 'Priya Sharma', initials: 'PS', role: 'Cost Accountant', isPrimary: true, badge: 'Preparer' },
      { name: 'Tom Bradley', initials: 'TB', role: 'Financial Controller', badge: 'Reviewer' },
    ],
    workflowStages: [
      { id: 'sync', label: 'Gather Data', status: 'pending' },
      { id: 'validate', label: 'Validate', status: 'pending' },
      { id: 'categorize', label: 'Analyse', status: 'pending' },
      { id: 'review', label: 'Review', status: 'pending' },
    ],
    dependencies: [
      { id: 'dep-25-7', taskName: 'Vehicle inventory — Solihull', type: 'blocked-by', status: 'in-progress', assignee: 'Priya Sharma', assigneeInitials: 'PS' },
      { id: 'dep-25-8', taskName: 'Vehicle inventory — Castle Bromwich', type: 'blocked-by', status: 'in-progress', assignee: 'Priya Sharma', assigneeInitials: 'PS' },
      { id: 'dep-25-12', taskName: 'Manufacturing overhead allocation', type: 'blocked-by', status: 'in-progress', assignee: 'Priya Sharma', assigneeInitials: 'PS' },
      { id: 'dep-25-17', taskName: 'Revenue recognition — Wholesale', type: 'blocked-by', status: 'blocked', assignee: 'Emma Harrison', assigneeInitials: 'EH' },
    ],
  },

  26: {
    tier: 3,
    title: 'Monthly Close Package — Board Reporting',
    description: 'Compile and review the monthly close package for the JLR Board and Tata Motors group reporting. Depends on completion of all upstream close tasks.',
    period: 'February 2026',
    entity: 'JLR Group',
    folder: 'Close Package',
    frequency: 'Monthly',
    currentStage: 'sync',
    assignees: [
      { name: 'Emma Harrison', initials: 'EH', role: 'Senior Financial Analyst', isPrimary: true, badge: 'Preparer' },
      { name: 'Tom Bradley', initials: 'TB', role: 'Financial Controller', badge: 'Reviewer' },
    ],
    workflowStages: [
      { id: 'sync', label: 'Gather Reports', status: 'pending' },
      { id: 'validate', label: 'Validate', status: 'pending' },
      { id: 'categorize', label: 'Compile', status: 'pending' },
      { id: 'review', label: 'Review', status: 'pending' },
    ],
    dependencies: [
      { id: 'dep-26-23', taskName: 'Consolidation elimination entries', type: 'blocked-by', status: 'not-started', assignee: 'Priya Sharma', assigneeInitials: 'PS' },
      { id: 'dep-26-24', taskName: 'Tax provision — Multi-jurisdiction', type: 'blocked-by', status: 'not-started', assignee: 'Emma Harrison', assigneeInitials: 'EH' },
      { id: 'dep-26-25', taskName: 'COGS & gross margin analysis', type: 'blocked-by', status: 'not-started', assignee: 'Priya Sharma', assigneeInitials: 'PS' },
      { id: 'dep-26-15', taskName: 'Fixed asset depreciation', type: 'blocked-by', status: 'in-progress', assignee: 'Priya Sharma', assigneeInitials: 'PS' },
      { id: 'dep-26-13', taskName: 'Warranty provision calculation', type: 'blocked-by', status: 'blocked', assignee: 'Emma Harrison', assigneeInitials: 'EH' },
    ],
  },
};
