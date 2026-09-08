# FQ Prototypes

FloQast product design prototypes - source backup, case study archive, and cross-machine reference.

**Owner:** Jimmy Chen (jimmy@typographic.com / jimmy.chen@floqast.com)  
**Last synced from:** `product-and-design` repo (FloQast GitHub)

---

## Projects

| Project | Stack | Status | Deployed |
|---------|-------|--------|----------|
| [admin-agent](admin-agent/) | Vite + React + FlowUI | prototyping | - |
| [agents-playbooks](agents-playbooks/) | Vite + React + FlowUI | prototyping | - |
| [ai-variance-prototype](ai-variance-prototype/) | HTML | prototyping | - |
| [auditreportreboot](auditreportreboot/) | Vite + React + FlowUI | prototyping | - |
| [bulk-invite-user](bulk-invite-user/) | Vite + React + FlowUI | prototyping | - |
| [catalyst](catalyst/) | Vite + React + shadcn | prototyping | - |
| [coso-ai-rcm](coso-ai-rcm/) | Vite + React + FlowUI | exploration | - |
| [data-studio](data-studio/) | Vite + React + FlowUI | prototyping | - |
| [defender](defender/) | Vite + React + FlowUI | prototyping | - |
| [detect-prototype](detect-prototype/) | HTML | prototyping | - |
| [fdm-rollup](fdm-rollup/) | Vite + React + FlowUI | prototyping | - |
| [inbox-prototype](inbox-prototype/) | HTML | prototyping | - |
| [mike-ux-feedback-4-2026](mike-ux-feedback-4-2026/) | Vite + React + FlowUI | review | - |
| [recs-ag-grid](recs-ag-grid/) | Vite + React + AG Grid | prototyping | - |
| [recs-multicurrency](recs-multicurrency/) | Vite + React + FlowUI | prototyping | [live](https://sturdy-adventure-7p4zk32.pages.github.io/projects/recs-multicurrency/) |
| [recs-side-drawer](recs-side-drawer/) | Vite + React + FlowUI | active | [live](https://sturdy-adventure-7p4zk32.pages.github.io/projects/recs-side-drawer/) |
| [recs-translation](recs-translation/) | HTML | prototyping | [live](https://sturdy-adventure-7p4zk32.pages.github.io/projects/recs-translation/) |
| [scheduler-1-many](scheduler-1-many/) | Vite + React + FlowUI | prototyping | - |
| [table-standards](table-standards/) | HTML | prototyping | - |
| [transform-extract](transform-extract/) | HTML | prototyping | - |

---

## Running a prototype locally

Most projects are Vite + React. To run:

```bash
cd <project>/prototype
npm install
npm run dev
```

Projects that use `_shared` components have a sibling `_shared/` directory already included.
`flowui-cache/` (the bundled FlowUI library) is not committed. Run the `figma-prototype-setup`
skill from the `product-and-design` repo to generate it, then copy it into the project's
`prototype/` directory.

---

## Case studies

Each project has a `case-study/` folder with a `README.md` covering problem, decisions, and outcomes.
Fill it in as the project progresses or after stakeholder review.

---

## Syncing updates

This repo is a periodic snapshot. To pull the latest from the FloQast source:

```bash
rsync -a --exclude=node_modules/ --exclude=dist/ --exclude=flowui-cache/ \
  ~/Documents/product-and-design/projects/<name>/ ~/Documents/fq-prototypes/<name>/
cd ~/Documents/fq-prototypes
git add -A
git commit -m "sync: <name> from product-and-design"
GITHUB_TOKEN=$(gh auth token --hostname github.com -u jimjimjimmy 2>/dev/null)
git push "https://jimjimjimmy:${GITHUB_TOKEN}@github.com/jimjimjimmy/fq-prototypes.git" main
```
