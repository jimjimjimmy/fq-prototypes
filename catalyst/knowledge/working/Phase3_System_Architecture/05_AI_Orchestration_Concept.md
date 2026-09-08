# AI Orchestration Concept

**Purpose:** Define a unified AI orchestration layer that consolidates FloQast's five fragmented AI services into a coherent architecture with shared infrastructure, common patterns, and a centralized agent registry.

**Context:** FloQast currently operates five independent AI services across two providers (OpenAI, AWS Bedrock), two languages (Node.js, Python), and multiple deployment patterns (Lambda, Bedrock Agent). Each service independently manages its own LLM calls, prompt engineering, error handling, and tenant isolation. There is no shared prompt management, no unified observability, no model routing logic, and no way to compose agents into multi-step workflows. Chris Sluty's "spam filter" philosophy demands that the best AI requires zero behavior change from users — it runs silently in the background, delivering value without requiring new interactions.

**Depends On:** Workflow Engine Concept (`04_Workflow_Engine_Concept.md`), Super Task Model (Phase 2, `02_Super_Task_Model_Specification.md`), existing AI Security Architecture (Confluence page 4443766888)

---

## 1. Current State: Five Fragmented AI Services

### 1.1 AI Matching

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Transaction matching — matches line items across data sources (bank statements, GL, credit cards) |
| **AI Provider** | OpenAI |
| **Models** | `gpt-4o` (primary), `gpt-4-turbo-preview` (fallback for code generation) |
| **API Type** | Chat Completions |
| **Runtime** | Lambda (Node.js for API, Python for code execution) |
| **Architecture** | Multi-Lambda: API Lambda, Worker Lambda, LLM Lambda, Code Runner Lambda |
| **Async** | Step Functions for orchestration |
| **Unique Feature** | MatchQL DSL — LLM generates matching rules in a domain-specific language, validated server-side, translated to Python for execution |
| **Security** | Hardened code execution sandbox (dedicated VPC, no internet, S3-only egress, limited Python runtime) |
| **Data Sent to LLM** | Structured transaction fields only (amounts, dates, references). Never raw files, `tlcId`, or user IDs. |

### 1.2 FloQL Backend

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Transaction analytics — natural language queries against financial data ("What were the top 10 vendors by spend last quarter?") |
| **AI Provider** | AWS Bedrock |
| **Model** | `claude-3-5-sonnet-20240620-v1:0` |
| **API Type** | Messages API |
| **Runtime** | Lambda (Python) |
| **Architecture** | Single Lambda function |
| **Data Source** | Snowflake (schema-per-tenant: `TLC_{tlcId}`) |
| **Unique Feature** | Translates natural language to SQL, executes against Snowflake, returns formatted results |
| **Security** | SQL query validation, read-only Snowflake credentials, tenant-scoped schema |

### 1.3 Monitors Agent

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Anomaly monitoring — generates SQL queries to detect anomalies in financial data based on user-defined monitor configurations |
| **AI Provider** | AWS Bedrock |
| **Model** | `claude-3-5-sonnet-20241022-v2:0` |
| **API Type** | Bedrock Agent (managed agent framework) |
| **Runtime** | Bedrock Agent (AWS-managed) |
| **Architecture** | Bedrock Agent with action groups |
| **Unique Feature** | Uses Bedrock's managed agent framework for multi-step reasoning (retrieve schema → generate SQL → validate → execute) |
| **Security** | Agent scoped to tenant's Snowflake schema |

### 1.4 Remind Language Processor

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Message generation — creates contextual reminder messages for overdue or upcoming tasks |
| **AI Provider** | OpenAI |
| **Model** | `gpt-4o` |
| **API Type** | Chat Completions |
| **Runtime** | Lambda (Node.js) |
| **Architecture** | Single Lambda function |
| **Data Sent to LLM** | Task metadata (title, due date, status, assignee name). No financial data. |
| **Unique Feature** | Tone-aware generation (friendly, urgent, escalation) based on how overdue the task is |

### 1.5 Checkmate API

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Checklist generation — auto-generates close checklists from uploaded documents (prior period workpapers, audit requests, SOX control matrices) |
| **AI Provider** | OpenAI |
| **Model** | `gpt-4-1106-preview` |
| **API Type** | Chat Completions + Tools (function calling) |
| **Runtime** | Lambda (Node.js) |
| **Architecture** | Single Lambda function |
| **Unique Feature** | Uses OpenAI function calling to output structured JSON matching the checklist item schema |
| **Data Sent to LLM** | Extracted text from uploaded documents. Preprocessed to remove tenant identifiers. |

---

## 2. Problems with the Current State

### 2.1 No Shared Infrastructure

Each service independently implements:
- LLM client initialization and authentication
- Prompt construction and formatting
- Error handling and retry logic (rate limits, timeouts, malformed responses)
- Response parsing and validation
- Logging and metrics

This means bug fixes, provider API changes, and best practices must be applied five times.

### 2.2 No Model Routing

There is no logic for selecting the best model for a given task. AI Matching uses `gpt-4o` because it was built when that was the best available model. FloQL uses Claude 3.5 Sonnet because the Bedrock team recommended it. Remind uses `gpt-4o` for simple message generation — a much smaller, cheaper model would suffice. There is no mechanism to A/B test models or fall back gracefully when a provider has an outage.

### 2.3 No Prompt Management

Prompts are hardcoded in service code. There is no version control, no A/B testing, no way to update prompts without a code deployment, and no visibility into which prompts are in production.

### 2.4 No Unified Observability

Each service logs to its own CloudWatch log group. There is no cross-service view of AI usage, cost, latency, error rate, or quality metrics. There is no way to answer "How much are we spending on OpenAI this month?" without querying five different billing dashboards.

### 2.5 No Agent Composition

Agents cannot invoke other agents. There is no concept of a multi-step AI workflow where, for example, an agent detects an anomaly, generates a review note, and triggers a reconciliation refresh. Each service is a standalone island.

---

## 3. Proposed Unified Architecture

### 3.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AI Orchestration Service (ECS)                    │
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │  Agent Registry   │  │  Prompt Manager   │  │  Model Router        │  │
│  │                   │  │                   │  │                      │  │
│  │  - Agent configs  │  │  - Versioned      │  │  - OpenAI adapter    │  │
│  │  - Schedules      │  │    prompts        │  │  - Bedrock adapter   │  │
│  │  - ROI tracking   │  │  - A/B testing    │  │  - Fallback chains   │  │
│  │  - Health status  │  │  - Templates      │  │  - Cost optimization │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘  │
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │  Execution Engine │  │  Tenant Isolation │  │  ROI Dashboard       │  │
│  │                   │  │                   │  │                      │  │
│  │  - Task dispatch  │  │  - Data pre-filter│  │  - Hours saved       │  │
│  │  - Agent runtime  │  │  - tlcId stripping│  │  - Items processed   │  │
│  │  - Code sandbox   │  │  - PII scrubbing  │  │  - Error rate        │  │
│  │  - Result collect │  │  - Audit logging  │  │  - Cost per agent    │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘  │
│                                                                          │
└─────────────┬──────────────────┬──────────────────┬─────────────────────┘
              │                  │                  │
              ▼                  ▼                  ▼
      ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
      │   OpenAI     │  │  AWS Bedrock │  │  Code Execution  │
      │   API        │  │  (Claude)    │  │  Sandbox (Lambda)│
      └──────────────┘  └──────────────┘  └──────────────────┘
```

### 3.2 Service Identity

**Service name:** `close_ai-orchestration` (ECS, following the monorepo `apps/` convention)

**Responsibilities:**
1. Centralized entry point for all AI operations in Close
2. Agent lifecycle management (register, configure, schedule, execute, monitor)
3. Model selection and routing based on task type, cost, and performance
4. Prompt version management and A/B testing
5. Tenant data isolation enforcement before any LLM call
6. Code execution sandboxing for AI-generated code
7. ROI tracking and observability for every agent execution
8. Event publication for integration with the Workflow Engine

---

## 4. Component Deep Dives

### 4.1 Agent Registry

The agent registry treats AI agents as **first-class entities** — not hidden background processes, but named, configured, monitored objects that appear in the UI alongside human task assignments.

```typescript
interface Agent {
  // === IDENTITY ===
  id: string;                           // Globally unique
  name: string;                         // Human-readable: "AP Accrual Agent"
  description: string;                  // What this agent does
  agentType: AgentType;                 // Discriminator for execution logic

  // === CONFIGURATION ===
  tlcId: string;                        // Tenant-scoped
  config: AgentConfig;                  // Type-specific configuration
  modelPreference?: ModelPreference;    // Override default model selection
  promptVersion?: string;               // Pin to specific prompt version

  // === SCHEDULING ===
  triggerType: 'event' | 'schedule' | 'manual';
  schedule?: CronExpression;            // For scheduled agents
  eventTriggers?: EventTrigger[];       // For event-driven agents

  // === STATUS ===
  status: 'active' | 'paused' | 'error' | 'disabled';
  lastRunAt?: Date;
  lastRunResult?: AgentRunResult;
  consecutiveFailures: number;          // Auto-pause after 5 consecutive failures

  // === ROI TRACKING ===
  totalExecutions: number;
  totalItemsProcessed: number;
  totalHoursSaved: number;              // Estimated based on manual baseline
  totalErrors: number;
  averageLatency: number;               // Milliseconds
  costToDate: number;                   // USD, based on token usage

  // === METADATA ===
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
}

enum AgentType {
  TRANSACTION_MATCHER = 'transaction_matcher',     // AI Matching
  QUERY_ANALYST = 'query_analyst',                 // FloQL
  ANOMALY_MONITOR = 'anomaly_monitor',             // Monitors
  MESSAGE_GENERATOR = 'message_generator',         // Remind
  CHECKLIST_GENERATOR = 'checklist_generator',     // Checkmate
  TRANSFORM_AGENT = 'transform_agent',             // Transform (data manipulation)
  CUSTOM = 'custom'                                // Future extensibility
}
```

**Agent visibility in the UI:**
- Agents appear as assignees on Super Tasks (alongside human preparers/reviewers)
- Agent execution history is visible in the Drill-Down Object View
- Agent status is shown in the left nav under "Agents" (Project Catalyst's horizontal applications layer)
- Agent ROI metrics are surfaced in the Close Timeline and analytics dashboards

### 4.2 Prompt Manager

Centralized prompt management replaces hardcoded prompts scattered across five services.

```typescript
interface PromptTemplate {
  id: string;
  name: string;                         // "transaction_matching_rule_generation"
  agentType: AgentType;                 // Which agent type uses this prompt
  version: string;                      // Semantic version: "2.1.0"

  // === TEMPLATE ===
  systemPrompt: string;                 // System message (role, constraints)
  userPromptTemplate: string;           // User message with {{variable}} placeholders
  outputSchema?: JSONSchema;            // Expected response structure (for function calling)

  // === CONFIGURATION ===
  modelConstraints?: {
    providers: ('openai' | 'bedrock')[];  // Which providers this prompt is tested against
    minModelCapability: string;           // "gpt-4-class" or "claude-3-class"
  };
  temperature?: number;
  maxTokens?: number;

  // === A/B TESTING ===
  isActive: boolean;
  trafficWeight: number;                // 0-100, for A/B testing between versions

  // === METADATA ===
  createdAt: Date;
  createdBy: string;
  changeLog: string;                    // What changed in this version
  qualityScore?: number;                // Measured response quality (0-1)
}
```

**Key capabilities:**
- **Version control:** Every prompt change creates a new version. Old versions are preserved. Rollback is instantaneous.
- **A/B testing:** Multiple prompt versions can be active simultaneously with configurable traffic splits. Quality metrics determine the winner.
- **No-deploy updates:** Prompt changes do not require a code deployment. The orchestration service polls for prompt updates (or listens for a config change event).
- **Template variables:** Prompts use `{{variable}}` syntax for dynamic data injection. The orchestration service validates that all required variables are provided before sending to the LLM.

### 4.3 Model Router

The model router selects the optimal LLM for each request based on task requirements, cost constraints, and provider availability.

```typescript
interface ModelRoutingDecision {
  provider: 'openai' | 'bedrock';
  model: string;
  reason: string;                       // Why this model was selected (for observability)
  fallbackChain: ModelOption[];          // Ordered list of fallbacks if primary fails
  estimatedCost: number;                // Estimated cost per request
  estimatedLatency: number;             // Estimated response time
}
```

**Routing logic:**

| Agent Type | Default Model | Rationale | Fallback |
|------------|--------------|-----------|----------|
| Transaction Matcher | OpenAI `gpt-4o` | Best at structured code generation, MatchQL requires precise syntax | `gpt-4-turbo` |
| Query Analyst (FloQL) | Bedrock `claude-3-5-sonnet-v2` | Best at SQL generation, Bedrock keeps data in AWS | `claude-3-haiku` (simple queries) |
| Anomaly Monitor | Bedrock `claude-3-5-sonnet-v2` | Multi-step reasoning, Bedrock Agent framework | `claude-3-5-sonnet-v1` |
| Message Generator | OpenAI `gpt-4o-mini` | Simple text generation, cost-optimized | `gpt-4o` |
| Checklist Generator | OpenAI `gpt-4o` | Function calling for structured output | `gpt-4-turbo` |
| Transform Agent | OpenAI `gpt-4o` | Code generation (Python) | `gpt-4-turbo` |

**Cost optimization:** The router tracks token usage per agent type and automatically downgrades to cheaper models when the task complexity allows it. For example, a simple reminder message that would cost $0.03 on `gpt-4o` costs $0.001 on `gpt-4o-mini` with equivalent quality.

**Provider failover:** If OpenAI returns 5xx errors or rate limits, the router automatically routes to Bedrock (and vice versa) for agent types where both providers are tested. This requires maintaining prompt compatibility across providers (a Prompt Manager concern).

### 4.4 Tenant Isolation Layer

The tenant isolation layer enforces a strict data boundary between FloQast's multi-tenant data and external LLM providers. This centralizes the isolation logic that is currently implemented independently (and inconsistently) across five services.

**Isolation rules (non-negotiable):**

| Data Category | Sent to LLM? | Handling |
|---------------|---------------|----------|
| `tlcId` (tenant identifier) | NEVER | Stripped before any LLM call |
| `userId`, `userEmail` | NEVER | Replaced with pseudonymized identifiers |
| Raw files (PDFs, Excel) | NEVER | Text extracted server-side; only extracted text sent |
| Transaction fields (amounts, dates, references) | YES | Structured data only, no identifying context |
| Account names and numbers | YES | GL account identifiers needed for financial reasoning |
| Task titles and descriptions | YES | Required for checklist generation and message generation |
| Company names | Conditional | Only when explicitly required by the agent type (e.g., message generation) |

**Implementation:**

```typescript
interface TenantIsolationFilter {
  // Strip fields before LLM call
  stripFields: string[];                // ["tlcId", "userId", "userEmail", "internalId"]

  // Pseudonymize fields (replace with random but consistent identifiers)
  pseudonymizeFields: string[];         // ["assigneeName", "reviewerName"]

  // Redact patterns (regex-based PII detection)
  redactPatterns: RegExp[];             // [/\b\d{3}-\d{2}-\d{4}\b/, /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i]

  // Validate payload size (prevent accidental large data sends)
  maxPayloadSizeBytes: number;          // 100KB default
}
```

All LLM requests pass through this filter. The filter logs what was stripped (for audit) without logging the stripped values themselves.

### 4.5 Code Execution Sandbox

The existing AI Matching code runner Lambda (`fq-matching-copilot-code-runner-lambda`) provides a hardened sandbox for executing LLM-generated Python code. The AI Orchestration Service promotes this to a shared resource.

**Current sandbox controls (retained):**

| Control | Implementation |
|---------|----------------|
| Network Isolation | Dedicated VPC with no internet gateway |
| Egress Restriction | Security group allows only S3 VPC endpoint (port 443) |
| Secret Denial | Explicit IAM DENY on all SSM/Secrets Manager operations |
| Limited Runtime | Only `re`, `pandas`, `defaultdict` available |
| Code Validation | Regex extraction — only Python in markdown blocks accepted |
| Function Check | Must define expected function signature |
| Time Limit | 900s maximum execution time |
| Memory Limit | 10GB maximum allocation |

**Enhancements for shared use:**

| Enhancement | Detail |
|-------------|--------|
| Multi-agent support | Sandbox accepts a `agentType` parameter and loads the appropriate runtime restrictions per agent |
| Extended library allowlist | Transform agents may need additional libraries (`openpyxl`, `csv`, `json`). Allowlist is configurable per agent type. |
| Result validation | Sandbox validates output schema before returning results to the orchestration service |
| Execution logging | Every sandbox execution logs: input hash, output hash, execution time, memory usage, agent ID |

### 4.6 ROI Dashboard

Chris Sluty's mandate: AI must show ROI. Every agent execution is instrumented to produce measurable impact metrics.

```typescript
interface AgentExecution {
  executionId: string;
  agentId: string;
  agentName: string;
  tlcId: string;
  taskId?: string;                      // The task this agent operated on

  // === TIMING ===
  startedAt: Date;
  completedAt: Date;
  durationMs: number;

  // === RESULTS ===
  status: 'success' | 'partial_success' | 'failure';
  itemsProcessed: number;              // How many items the agent worked on
  itemsSucceeded: number;
  itemsFailed: number;

  // === ROI METRICS ===
  estimatedHoursSaved: number;          // Based on manual baseline for this task type
  estimatedCostSaved: number;           // Hours saved * average hourly cost

  // === COST ===
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  llmCost: number;                      // USD, calculated from token usage + model pricing
  computeCost: number;                  // USD, Lambda/ECS compute cost

  // === QUALITY ===
  confidenceScore?: number;             // Agent's self-assessed confidence (0-1)
  humanOverrideRate?: number;           // % of agent decisions overridden by humans

  // === ERROR DETAIL ===
  errorType?: string;
  errorMessage?: string;
}
```

**Dashboard views:**

**Tenant-Level ROI (visible to Close Managers and Admins):**
- Total hours saved this period (across all agents)
- Total items processed this period
- Agent-by-agent breakdown: success rate, hours saved, items processed
- Trend over time: are agents getting better or worse?
- Cost: how much did AI cost vs. how much did it save?

**Task-Level ROI (visible in Drill-Down Object View):**
- Which agents ran on this task
- What they did (items matched, anomalies detected, messages generated)
- How long it took vs. manual baseline
- Confidence score and any human overrides

**Platform-Level ROI (visible to FloQast internal teams):**
- Cross-tenant aggregation: total hours saved, total cost, most-used agents
- Model performance comparison: which models produce the best results for which agent types
- Cost optimization opportunities: which agents could use cheaper models

---

## 5. Chris Sluty's "Spam Filter" Philosophy

Chris Sluty's core insight: **the best AI requires zero behavior change.** Like a spam filter that silently protects your inbox without asking you to do anything, FloQast's AI should work invisibly in the background.

### 5.1 Design Principles

1. **No chatbot-first for basic tasks.** Users should not need to open a chat window to get value from AI. Agents run automatically on schedule or on data arrival.

2. **Results appear where users already look.** Agent outputs show up in the task list, in the drill-down view, in the reconciliation balance column — not in a separate "AI Results" page.

3. **Confidence-based surfacing.** High-confidence results are applied automatically (e.g., auto-matched transactions with 99% confidence). Low-confidence results are flagged for human review with clear explanations.

4. **Zero-config activation.** New agents should be auto-enabled with sensible defaults based on the customer's data patterns. Administrators can tune, but the default should already work.

5. **Hard metrics, not magic.** Every agent execution produces a measurable outcome: "Matched 247 of 250 transactions in 3 seconds (manual baseline: 4 hours)." No vague "AI-powered" marketing claims.

### 5.2 Application to Each Agent Type

| Agent | "Spam Filter" Behavior |
|-------|----------------------|
| Transaction Matcher | Runs automatically when bank data arrives. Matched transactions appear pre-matched in the reconciliation view. User only reviews exceptions. |
| FloQL Analyst | Powers pre-built dashboard widgets ("Top variances this period") without the user typing a query. Natural language interface is available but not required. |
| Anomaly Monitor | Runs on schedule. Anomalies appear as flags on affected tasks in the task list. No separate monitoring page needed. |
| Remind Processor | Generates contextual reminders automatically. Messages appear in the user's notification feed with appropriate urgency tone. |
| Checklist Generator | When a new entity is onboarded, auto-generates a starter checklist from uploaded prior period workpapers. Admin reviews and activates. |

---

## 6. Agent-to-Agent Handoffs (Future)

The unified orchestration layer enables multi-step AI workflows where agents compose together.

### 6.1 Example: End-to-End Reconciliation Workflow

```
1. data.arrived (bank statement uploaded)
   │
   ▼
2. Transaction Matcher Agent
   - Matches 247 of 250 transactions
   - 3 unmatched items flagged
   │
   ▼
3. Anomaly Monitor Agent (triggered by unmatched items)
   - Analyzes unmatched items
   - Detects: 2 are timing differences (will match next period)
   - Detects: 1 is a duplicate charge ($5,234)
   │
   ▼
4. Remind Processor Agent (triggered by anomaly detection)
   - Generates review note: "Potential duplicate charge of $5,234 from Vendor X
     on 2/15 and 2/18. Previous periods show single monthly charge."
   - Attaches to the reconciliation task
   │
   ▼
5. Workflow Engine
   - Transitions task to "pending_review" (all data ready, anomalies flagged)
   - Notifies reviewer with summary
```

### 6.2 Orchestration Model

Agent-to-agent handoffs are implemented through the Workflow Engine's event system (see `04_Workflow_Engine_Concept.md`):

1. Agent A completes and publishes an `agent.completed` event with results
2. The Workflow Engine evaluates rules against the event
3. A rule triggers Agent B with Agent A's results as input
4. Agent B executes and publishes its own `agent.completed` event
5. The chain continues until no more rules match

**Safeguards:**
- Maximum chain depth: 5 agents (prevents infinite loops)
- Total chain timeout: 5 minutes (prevents runaway orchestrations)
- Each agent in the chain has independent error handling — a failure in Agent C does not roll back Agent A and B's results
- The full chain is logged as a single "workflow execution" in the event store for audit visibility

---

## 7. Migration Path

### 7.1 Phase 1: Shared Infrastructure (Quarter 1)

**Goal:** Build the orchestration service shell with Model Router and Tenant Isolation layer. Migrate one service as proof of concept.

**Actions:**
1. Deploy `close_ai-orchestration` ECS service
2. Implement Model Router with OpenAI and Bedrock adapters
3. Implement Tenant Isolation filter
4. Migrate **Remind Language Processor** (simplest service, lowest risk)
5. Validate: Remind messages generated through orchestration service match quality of direct Lambda

**Why Remind first:** It is the simplest agent (single LLM call, simple output, no code execution). It validates the core infrastructure without the complexity of matching rules or SQL generation.

### 7.2 Phase 2: Prompt Manager + Checkmate (Quarter 2)

**Actions:**
1. Deploy Prompt Manager with version control and A/B testing
2. Migrate **Checkmate API** (checklist generation)
3. Move all Checkmate prompts to Prompt Manager
4. A/B test: current `gpt-4-1106-preview` prompt vs. updated `gpt-4o` prompt
5. Implement Agent Registry with basic agent metadata

**Why Checkmate second:** It uses function calling (structured output), which validates the Prompt Manager's `outputSchema` handling. It is also customer-facing, so A/B testing proves the prompt management workflow.

### 7.3 Phase 3: Code Sandbox + AI Matching (Quarter 3)

**Actions:**
1. Promote code execution sandbox to shared infrastructure
2. Migrate **AI Matching** (transaction matching)
3. Refactor MatchQL pipeline to use orchestration service for LLM calls while retaining dedicated code runner
4. Implement ROI Dashboard with matching agent as first data source

**Why AI Matching third:** It is the most complex service (multi-Lambda, Step Functions, code generation, sandbox execution). Migrating it validates the full orchestration pipeline.

### 7.4 Phase 4: Bedrock Services + Agent Composition (Quarter 4)

**Actions:**
1. Migrate **FloQL Backend** (transaction analytics)
2. Migrate **Monitors Agent** (anomaly monitoring)
3. Implement agent-to-agent handoff framework
4. Build first multi-step workflow (example: data arrival -> matching -> anomaly detection)
5. Decommission individual Lambda deployments

**Why Bedrock services last:** They require the most adaptation (Bedrock Agent framework has a different execution model than direct API calls). FloQL and Monitors also depend on Snowflake schema-per-tenant access, which needs careful integration with the Tenant Isolation layer.

---

## 8. Technology Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Orchestration Service | ECS (Node.js/TypeScript) | Matches Close team's primary language, monorepo convention |
| Agent Registry | MongoDB (CoreDB) | Agent configs are low-volume, document-shaped, tenant-scoped — fits existing data access patterns |
| Prompt Storage | S3 + DynamoDB | S3 for prompt template files (version-controlled), DynamoDB for active version metadata and A/B test weights |
| Model Router | In-process (no external dependency) | Routing logic is lightweight, changes infrequently, cached in memory |
| Code Sandbox | Lambda (Python) | Retains existing hardened Lambda architecture; Lambda's per-invocation isolation is ideal for untrusted code |
| ROI Data | DynamoDB (real-time) + Snowflake (analytics) | Same dual-store pattern as Workflow Engine event store |
| Event Integration | EventBridge + SQS | Agent events flow through the same event bus as workflow events |

---

## 9. Observability

### 9.1 Unified AI Metrics Dashboard

| Metric | Granularity | Alert Threshold |
|--------|-------------|-----------------|
| `ai.requests.total` | Per agent type, per model | -- |
| `ai.requests.latency_p95` | Per agent type | >10s (matching), >5s (others) |
| `ai.requests.error_rate` | Per agent type, per provider | >5% (alert) |
| `ai.tokens.usage` | Per agent type, per model | >$500/day (cost alert) |
| `ai.sandbox.executions` | Per agent type | -- |
| `ai.sandbox.failures` | Per agent type | >10% (alert) |
| `ai.roi.hours_saved` | Per tenant, per agent | -- (reporting only) |
| `ai.roi.cost_ratio` | AI cost / estimated manual cost | >0.5 (cost-effectiveness warning) |

### 9.2 Prompt Quality Tracking

For each prompt version in A/B testing:
- **Success rate:** % of LLM responses that pass output schema validation
- **Human override rate:** % of agent decisions that users override or reject
- **Latency impact:** Does this prompt version produce faster/slower responses?
- **Token efficiency:** Does this prompt version use more/fewer tokens for equivalent output?

---

## 10. Open Questions

1. **Bedrock Agent migration complexity** — The Monitors Agent uses Bedrock's managed agent framework, which handles multi-step reasoning internally. Moving this to the orchestration service means reimplementing the agent loop (retrieve → reason → act → observe). Is the benefit of unification worth the migration cost, or should Monitors remain a Bedrock Agent that simply registers with the Agent Registry for observability? Recommend: register for observability now, migrate execution later.

2. **Model cost allocation** — Should AI costs be attributed to the tenant whose data was processed? This enables per-customer ROI calculation but requires metering infrastructure. Recommend: yes, using token usage tracking per `tlcId`.

3. **Prompt versioning across providers** — If the Model Router fails over from OpenAI to Bedrock, the prompt format may need adjustment (OpenAI and Anthropic have different system prompt conventions). Should the Prompt Manager maintain provider-specific variants of each prompt? Recommend: yes, with a `provider` field on `PromptTemplate` and automatic selection by the Model Router.

4. **Agent marketplace** — Should customers be able to share agent configurations with each other (anonymized)? For example, a best-practice "Bank Reconciliation Matching Agent" configuration. This is a product decision with significant data privacy implications. Recommend: defer, but design the Agent Registry to support it.

5. **On-premises deployment** — Some enterprise customers may have data residency requirements that prevent sending data to OpenAI or even AWS Bedrock. Should the orchestration service support local LLM deployment (e.g., self-hosted Llama)? Recommend: design the Model Router's adapter pattern to support it, but do not build it until a customer requires it.

6. **Agent autonomy levels** — How much should agents be allowed to do without human approval? Current state: agents produce outputs that humans review. Future state: high-confidence agents auto-complete tasks. The autonomy level should be configurable per agent, per tenant, with audit logging at every level. Recommend: start with "suggest" mode (agent produces output, human approves), evolve to "auto-execute" mode for agents with proven track records (>95% human acceptance rate over 3+ months).
