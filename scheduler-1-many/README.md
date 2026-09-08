# Scheduler 1:Many

> Post-MVP exploration: one schedule orchestrating many tasks, in its own FloQast module.

## What This Is

The MVP Scheduler (Minnie Newman's work, `project/scheduler`) is an Admin Settings tab for managing jobs across the platform — one job per schedule. This project explores the *next* iteration: Scheduler as its own product surface, where a single schedule orchestrates an ordered sequence of tasks.

The prototype is also Grant's first hands-on FloQast prototype — built as a learning vehicle alongside an exploratory product idea.

## Team

| Name | Role |
|------|------|
| Grant Atherholt | Product Manager (lead) |

## Quick Links

- **Figma:** [Project Schedule](https://www.figma.com/design/OSbs5FfJ1zDwzDHlZl2kfh/Project-Schedule?node-id=91-107)
- **Jira:** [IDEA-2576](https://floqast.atlassian.net/browse/IDEA-2576) (shared with the MVP)
- **Parent MVP:** `project/scheduler` branch (not yet merged to main), owner: Minnie Newman

## Current State

Project just created. Exploration phase. App shell scaffolded — content area is intentionally blank, ready for 1:Many concept work.

## Run the Prototype

```bash
cd projects/scheduler-1-many/prototype
npm install
npm run dev
```

> **First time?** The prototype depends on FloQast's private `@floqastinc/flow-ui_*` packages, which live on GitHub Packages. You need a GitHub Personal Access Token (PAT) with `read:packages` scope in your `~/.npmrc` before `npm install` will succeed.
>
> Quickest path:
> 1. Create a PAT at github.com → Settings → Developer settings → Personal access tokens → Tokens (classic). Check `read:packages`.
> 2. Add this line to `~/.npmrc` (create it if missing):
>    ```
>    //npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE
>    ```
> 3. Re-run `npm install` from this directory.
>
> See `knowledge/onboarding/setup-lessons.md` for context — this is a known gap for non-engineering team members.
