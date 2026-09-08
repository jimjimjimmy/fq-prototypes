# Detect - Usability Test Script

**Last Updated**: April 19, 2026  
**Prototype Version**: Latest build with rule management, assignee editing, and enhanced confirmation workflows

## What's New in This Version

This test script reflects the following new capabilities added to the prototype:

**Rule Management**
- Full rule configuration page with live editing
- Editable rule parameters (field, operator, value)
- Severity level slider (1-5)
- Rule metrics display (anomalies, open, investigating, resolved)
- Active/Paused status toggle

**Assignee Management**
- Edit Assignees modal with search functionality
- Role labels (Preparer/Reviewer)
- Changes immediately reflected in inbox card avatars
- Dynamic filtering based on assignee changes
- Support for Dynamic Assignment

**Enhanced Workflows**
- Resolution confirmation modal with detailed "what happens next" section
- "Don't show me this again" option with localStorage persistence
- Dismissal modal with optional reason field for AI training
- Risk score tooltips in inbox (positioned below badges)
- Activity Log with period selector and total anomalies count
- Comment system with Alex Thompson as logged-in user

**UI Improvements**
- "Assigned to You" filter active by default
- Inbox collapse control on panel border
- AI scanning animation after tour completion
- Transaction search functionality
- Full transaction table display (scrolls with content area)
- Improved visual hierarchy and component consistency

## Test Objective
Evaluate whether users can immediately understand the value of Detect and successfully navigate core workflows for identifying and addressing financial anomalies.

**Primary Focus**: First-time user experience and value perception
**Duration**: 50-70 minutes per session (extended to include new features)
**Participants**: Finance managers, compliance officers, and accounting professionals

---

## Pre-Test Setup

### Moderator Preparation
- [ ] Load Detect with test data showing multiple anomalies across accounts
- [ ] Ensure Northwind Analytics is selected by default (highest risk account)
- [ ] Reset tour to show on first load (`localStorage.removeItem('hasSeenTour')`)
- [ ] Clear resolution modal preference (`localStorage.removeItem('dontShowResolutionModal')`)
- [ ] Prepare screen recording software
- [ ] Have consent forms ready

### Participant Context
"Thank you for participating in this usability test. Today you'll be exploring a new product called Detect that helps finance teams identify and address anomalies in financial transactions. We have several new features to test today, so the session may run 50-70 minutes. We're interested in your honest feedback—there are no wrong answers, and any confusion you experience helps us improve the product."

---

## Part 1: First Impressions (5-10 minutes)

### Initial Landing (Tour Experience)

**Instructions**: "I'm going to show you the product. Please experience it as you naturally would, and think aloud—tell me what you're thinking, what you notice, and what questions come to mind."

**[Allow participant to experience the guided tour]**

#### Observation Points
- [ ] Does the participant read each tour step or skip through?
- [ ] Do they seem engaged or confused during the tour?
- [ ] Do they try to interact with elements during the tour?
- [ ] What questions do they ask during the tour?

#### Post-Tour Questions (Ask immediately after tour completion)

1. **Value Comprehension**: "Based on what you just saw, in your own words, what does this product do?"
   - *Follow-up*: "What problem does it solve?"

2. **Immediate Relevance**: "On a scale of 1-10, how relevant does this product seem to your work?"
   - *Follow-up*: "What makes you say [rating]?"

3. **Clarity**: "Was anything confusing or unclear in that introduction?"

4. **Missing Information**: "Is there anything you wish had been explained that wasn't?"

---

## Part 2: Core Task Scenarios (25-30 minutes)

### Scenario 1: Identifying High-Priority Anomalies (7-10 min)

**Context**: "You're starting your workday and need to understand what requires your immediate attention."

**Task**: "Please show me how you would identify which accounts or anomalies need your attention first."

#### Success Criteria
- [ ] Participant notices the metrics in the header (Total Anomalies, High Risk, etc.)
- [ ] Participant explores the inbox and understands the risk scoring
- [ ] Participant uses sorting or filtering (bonus)
- [ ] Participant selects an anomaly to view details

#### Probing Questions
- "What helps you determine what's most important?"
- "What does the risk score tell you?"
- "How would you describe the difference between these anomalies?" [point to different risk levels]

#### Observation Points
- Do they notice the "Assigned to You" filter is active by default?
- Do they understand the relationship between inbox items and the content area?
- Do they comment on visual hierarchy/clarity?
- Do they hover over risk score badges to see tooltips?
- Do they notice the inbox collapse control on the border?

---

### Scenario 2: Understanding an Anomaly (7-10 min)

**Context**: "You've noticed an anomaly with a high risk score in Apex Ventures."

**Task**: "Please investigate this anomaly and explain what you've learned about it."

#### Success Criteria
- [ ] Participant reads the anomaly description/explanation
- [ ] Participant notices the AI vs. Rule detection badge
- [ ] Participant explores the affected transactions
- [ ] Participant expands transaction details (bonus)
- [ ] Participant hovers over the detection badge to see reasoning (bonus)

#### Probing Questions
- "What caused this anomaly to be flagged?"
- "How was this anomaly detected?" [after they explore]
- "What additional information would help you decide how to handle this?"
- "What do you think about the level of detail provided?"

#### Observation Points
- Do they notice and interact with the AI/Rule badges?
- Do they scroll to see the transactions table?
- Do they understand the sticky header behavior?
- Do they try to expand transaction rows for more details?

---

### Scenario 3: Taking Action on an Anomaly (7-10 min)

**Context**: "You've reviewed the anomaly and determined what action to take."

**Task**: "Please show me how you would handle this anomaly appropriately. Think aloud about your decision-making process."

#### Success Criteria
- [ ] Participant finds the actions panel (right side)
- [ ] Participant understands the sign-off workflow
- [ ] Participant notices the "Dismiss anomaly" option
- [ ] Participant completes at least one action (sign-off or dismiss)
- [ ] Participant reads and responds to resolution confirmation modal
- [ ] Participant notices the updated metrics/counts after action

#### Probing Questions
- "What's the difference between signing off and dismissing?"
- "When would you use each option?"
- "What happens after you sign off/dismiss?" [before they do it]
- *After dismissal modal*: "What do you think about being asked for a reason?"
- *After resolution modal*: "Was the confirmation modal helpful? What did you think of the 'don't show again' option?"
- *After action*: "Did the system respond as you expected?"

#### Observation Points
- Do they understand the required sign-offs concept?
- Do they notice the assignee avatars?
- Do they see the count updates in the header and inbox?
- Do they notice the visual changes to the anomaly card after dismissal?
- Do they read the resolution modal carefully or skip through it?
- Do they provide a dismissal reason or skip it?
- Do they understand that dismissal reasons help train the AI?
- Do they check "don't show me this again" on the resolution modal?

---

### Scenario 4: Collaboration & Context (5 min)

**Context**: "You want to understand what your team has already discussed about this anomaly."

**Task**: "How would you see what conversations or context already exists?"

#### Success Criteria
- [ ] Participant finds the comments section
- [ ] Participant reads existing comments (if available)
- [ ] Participant understands who left comments

#### Probing Questions
- "How would you add your own comment or question?"
- "Is there enough context here to make a decision?"

---

### Scenario 5: Managing Assignees (5-7 min)

**Context**: "You need to change who is responsible for reviewing this anomaly."

**Task**: "Please show me how you would add or remove team members who need to sign off on this anomaly."

#### Success Criteria
- [ ] Participant finds the Edit Assignees button (pencil icon)
- [ ] Participant opens the Edit Assignees modal
- [ ] Participant adds/removes assignees
- [ ] Participant saves changes
- [ ] Participant notices avatar changes in the inbox card
- [ ] Participant understands how assignee changes affect "Assigned to You" filter

#### Probing Questions
- "How would you add someone to this anomaly?"
- *After editing*: "Do you see your changes reflected anywhere else?"
- "What happens if you remove yourself as an assignee while the 'Assigned to You' filter is active?"
- "How do you know who is a Preparer versus a Reviewer?"

#### Observation Points
- Do they find the edit button easily?
- Do they understand the search functionality in the modal?
- Do they notice the role labels (Preparer/Reviewer)?
- Do they verify their changes in the inbox card?
- Do they understand the connection between assignees and filtering?

---

### Scenario 6: Exploring Rules (7-10 min)

**Context**: "You want to understand and configure the rules that detect anomalies."

**Task**: "Please show me how you would view and modify the detection rules."

#### Success Criteria
- [ ] Participant finds the Rules button in the header
- [ ] Participant opens the Rules modal
- [ ] Participant clicks on a rule to view details
- [ ] Participant navigates to the Rule Detail page
- [ ] Participant edits rule fields (name, description, status, parameters, severity)
- [ ] Participant understands the rule metrics (anomalies, open, investigating, resolved)
- [ ] Participant navigates back to the main page

#### Probing Questions
- "How would you view all the detection rules?"
- "How would you change a rule?"
- *On detail page*: "What can you edit on this page?"
- "What do the metrics at the top tell you?"
- "How would you adjust how strict this rule is?"
- "What's the difference between Active and Paused status?"

#### Observation Points
- Do they find the Rules button easily?
- Do they understand the rule table (name, status, assignees, anomalies, risk score)?
- Do they realize the detail page is live-editable without an "Edit" button?
- Do they interact with the severity level slider?
- Do they edit the rule parameters (field, operator, value)?
- Do they understand who the rule owner is versus assignees?
- Do they notice the Dynamic Assignment options?

---

### Scenario 7: Viewing Activity History (5 min)

**Context**: "You want to see a history of all anomaly activity and resolved items."

**Task**: "Please show me how you would view past activity and change the time period."

#### Success Criteria
- [ ] Participant finds the Activity Log button in the header
- [ ] Participant opens the Activity Log drawer
- [ ] Participant views the activity feed
- [ ] Participant changes the period using the dropdown
- [ ] Participant notices the total anomalies count

#### Probing Questions
- "How would you see what happened yesterday or last week?"
- "What information does the activity log show you?"
- "Is this useful for audit purposes?"

#### Observation Points
- Do they find the Activity Log button easily?
- Do they understand the period selector?
- Do they notice the total anomalies metric?
- Do they understand the value for compliance/auditing?

---

### Scenario 8: Managing Workload (Optional, 3-5 min)

**Task**: "Show me how you would focus only on the anomalies assigned to you."

#### Success Criteria
- [ ] Participant finds and uses the "Assigned to You" filter
- [ ] Participant notices the filtered results
- [ ] Participant understands this filter is on by default

---

## Part 3: Post-Test Questionnaire (10-15 minutes)

### Value Perception

1. **Immediate Value**: "Thinking about your first 30 seconds with the product, did you immediately understand its value?"
   - [ ] Yes, very clear
   - [ ] Somewhat clear
   - [ ] Not clear
   - *Follow-up*: "What contributed to that impression?"

2. **Problem/Solution Fit**: "Does this solve a real problem you face in your work?"
   - Scale: 1 (Not at all) to 5 (Absolutely)
   - *Follow-up*: "Can you explain?"

3. **Information Clarity**: "Rate how well you understood what you were seeing:"
   - Anomaly importance/priority: 1-5
   - Why anomalies were flagged: 1-5
   - What actions to take: 1-5
   - Overall system organization: 1-5

### Feature Awareness

"I'm going to list some features. Please tell me if you noticed each one and whether you understood its purpose."

| Feature | Noticed? | Understood? | Notes |
|---------|----------|-------------|-------|
| AI vs. Rule detection badges | Y/N | Y/N | |
| Risk scoring (high/medium/low) | Y/N | Y/N | |
| Risk score tooltips (in inbox) | Y/N | Y/N | |
| Header metrics (open, resolved, dismissed) | Y/N | Y/N | |
| Transaction details (expandable rows) | Y/N | Y/N | |
| Transaction search functionality | Y/N | Y/N | |
| Sticky header when scrolling | Y/N | Y/N | |
| Assignee avatars with tooltips | Y/N | Y/N | |
| Edit Assignees functionality | Y/N | Y/N | |
| Assignee changes reflected in inbox | Y/N | Y/N | |
| "Assigned to You" filter (default on) | Y/N | Y/N | |
| Sorting options (by risk, anomalies, alphabetical) | Y/N | Y/N | |
| Anomaly navigation (dropdown) | Y/N | Y/N | |
| Comment icon with count badge (in inbox) | Y/N | Y/N | |
| Comment system (with Alex Thompson as user) | Y/N | Y/N | |
| Completed badge (with tooltip breakdown) | Y/N | Y/N | |
| Dismissal modal with optional reason | Y/N | Y/N | |
| Resolution confirmation modal | Y/N | Y/N | |
| "Don't show me this again" option | Y/N | Y/N | |
| Rules modal and table | Y/N | Y/N | |
| Rule detail page (live editing) | Y/N | Y/N | |
| Severity level slider | Y/N | Y/N | |
| Activity Log with period selector | Y/N | Y/N | |
| Inbox collapse control | Y/N | Y/N | |
| AI scanning animation (post-tour) | Y/N | Y/N | |

### Usability & Satisfaction

1. **Ease of Use**: "How easy was it to accomplish the tasks I gave you?"
   - Scale: 1 (Very difficult) to 5 (Very easy)

2. **Information Architecture**: "Did the layout make sense? Was information where you expected it to be?"

3. **Visual Design**: "Did the visual design help or hinder your understanding?"
   - *Follow-up*: "Any specific elements that stood out (positively or negatively)?"

4. **Missing Capabilities**: "What features or information were you looking for that you didn't find?"

5. **Workflow Concerns**: "Can you envision using this in your day-to-day work?"
   - *Follow-up*: "What would make it more useful?"

### Competitive Context

6. **Current Solution**: "How do you currently handle financial anomaly detection?"

7. **Comparison**: "How does this compare to your current approach?"

### Recommendations

8. **Likelihood to Adopt**: "If this were available tomorrow, how likely would you be to use it?"
   - Scale: 1 (Not at all likely) to 5 (Extremely likely)

9. **Top Priority Improvement**: "If you could change one thing about this product, what would it be?"

10. **Strongest Feature**: "What did you find most valuable or impressive?"

---

## Part 4: Specific Feature Deep-Dive (5-10 minutes)

### AI Detection Reasoning

**Task**: "Hover over one of the purple 'AI' badges and read what appears."

**Questions**:
- "Is this level of detail helpful?"
- "Does it increase or decrease your trust in the AI detection?"
- "Would you want more or less detail?"

### Rules vs. AI Detection

**Questions**:
- "What's the difference between an anomaly detected by AI versus one detected by a rule?"
- "Does one seem more trustworthy than the other?"
- "How would you decide which detection method to prioritize?"

### Completed State

**If participant saw Completed badges**:
- "What does the 'Completed' badge tell you?"
- "Is this information useful? How would you use it?"
- "What does the tooltip show when you hover over it?"

### Resolution Workflow

**Questions about the resolution confirmation modal**:
- "Was the modal helpful or disruptive?"
- "Did you understand the 'What happens next' section?"
- "Would you check 'Don't show me this again'? Why or why not?"
- "Does this give you confidence that the anomaly is properly handled?"

### Dismissal Reasoning

**Questions about dismissal modal**:
- "Why do you think the system asks for a dismissal reason?"
- "Would you typically provide a reason or skip it?"
- "Does knowing it helps train the AI make you more likely to provide a reason?"

### Rule Management

**Questions about rule configuration**:
- "Was it clear that you could edit the rule fields directly?"
- "Is the level of control appropriate for your role?"
- "Would you want to create new rules or just modify existing ones?"
- "What did you think of the severity level slider?"

### Assignee Management

**Questions about editing assignees**:
- "Was it easy to add or remove assignees?"
- "Did you notice the changes reflected in the inbox immediately?"
- "How would you use this feature in your daily workflow?"
- "What did you think of the role labels (Preparer/Reviewer)?"

---

## Closing (5 minutes)

1. "Is there anything else you'd like to share about your experience?"

2. "Any questions for me about the product or the test?"

3. Thank participant and explain next steps (if applicable)

---

## Moderator Observation Checklist

### Critical Success Indicators
- [ ] Participant understood the core purpose within 2 minutes
- [ ] Participant could navigate between anomalies confidently
- [ ] Participant found and used the actions panel without prompting
- [ ] Participant understood the difference between sign-off and dismiss
- [ ] Participant noticed visual feedback after taking actions
- [ ] Participant successfully edited assignees and saw changes reflected
- [ ] Participant accessed and understood the rule detail page
- [ ] Participant engaged with resolution and dismissal modals appropriately

### Red Flags
- [ ] Participant missed the right panel entirely
- [ ] Participant couldn't determine anomaly priority/importance
- [ ] Participant didn't understand what the transactions showed
- [ ] Participant confused by the three-panel layout
- [ ] Participant couldn't find how to take action
- [ ] Participant skipped/dismissed the tour without engaging
- [ ] Participant didn't realize the rule detail page was editable
- [ ] Participant dismissed resolution/dismissal modals without reading
- [ ] Participant couldn't find the edit assignees functionality
- [ ] Participant didn't understand assignee changes affected filtering

### Delight Moments
- [ ] Participant commented positively on visual design
- [ ] Participant discovered a feature unprompted and found it useful
- [ ] Participant expressed excitement about solving a current pain point
- [ ] Participant asked when they could start using it
- [ ] Participant appreciated the AI scanning animation
- [ ] Participant found value in the resolution confirmation clarity
- [ ] Participant liked being able to provide dismissal reasons for AI training
- [ ] Participant enjoyed the live-editing experience on the rule detail page
- [ ] Participant noticed and appreciated assignee changes reflected immediately

---

## Data Collection

### Quantitative Metrics
- Time to first action (from tour end)
- Time to complete each scenario
- Number of clicks to complete each task
- Number of errors/wrong paths taken
- Feature discovery rate (% of features noticed)

### Qualitative Insights
- Hesitation points (where participants pause or seem confused)
- Questions asked during tasks
- Verbal reactions (positive/negative)
- Suggested improvements
- Workflow concerns

---

## Post-Session Analysis Questions

1. **Value Clarity**: Did the participant articulate the product value accurately and quickly?

2. **Mental Model**: Did the participant's mental model match the intended product design?

3. **Workflow Fit**: Could the participant envision this fitting into their actual work?

4. **Barriers**: What prevented the participant from being successful (if applicable)?

5. **Opportunities**: What features or capabilities would elevate this from useful to essential?

---

## Variations for Different User Types

### For Finance Managers
- Emphasize workload management and team coordination aspects
- Ask about delegation and oversight workflows
- Probe on reporting and audit trail needs

### For Compliance Officers
- Focus on audit trail and documentation
- Emphasize rule management and AI transparency
- Ask about regulatory requirements and evidence gathering

### For Accounting Staff
- Emphasize day-to-day anomaly resolution workflow
- Focus on transaction details and validation
- Ask about integration with existing accounting systems

---

## Success Criteria for Product

A successful test session includes:
- ✅ Participant articulates core value within first 3 minutes
- ✅ Participant completes 80%+ of tasks without significant assistance
- ✅ Participant rates "immediate understanding" as 4/5 or higher
- ✅ Participant expresses interest in using the product (3/5 or higher likelihood)
- ✅ Participant identifies at least one current pain point this would solve
- ✅ Participant successfully navigates to and edits rule configurations
- ✅ Participant understands the resolution workflow and modal confirmations
- ✅ Participant successfully manages assignees and sees reflected changes

---

## Follow-Up Recommendations

Based on test results, consider:
- A/B testing alternative onboarding flows
- Card sorting exercise for information architecture validation
- Diary study to understand real-world anomaly workflows
- Comparative testing against existing solutions
- Prototype testing of suggested improvements
