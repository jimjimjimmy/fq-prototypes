# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **research and architecture documentation project** for FloQast's Close product rearchitecture initiative — not a source code repository. It contains strategic analysis, technical architecture documentation, leadership interviews, competitive analysis, and UX redesign plans.

**Primary Author:** Benjamin Ellis (Product Design Manager)
**Date:** February 2026

## Document Structure

- `01_Current_State_Analysis.md` — Compilation of current state deficiencies, leadership perspectives, and customer pain points
- `02_Close_Product_Deep_Dive.md` — Deep dive into Close product architecture, folder coupling issues, and checklist/grid problems
- `03_Technical_Architecture_Confluence.md` — Technical systems documentation: service architecture (C4 diagrams), MongoDB collections, AI services, authentication (GAuth ADR), ECS migration details, Snowflake data warehouse
- `04_Project_Catalyst_Reference.md` — UX redesign initiative: new navigation, global search, drill-down views, timeline/Gantt, AI assistant integration
- `FloQast_Close_Rearchitecture_Report.pdf` / `.docx` — Comprehensive report combining all findings

## Key Architectural Context

**Current Stack:** AWS Lambda (migrating to ECS), MongoDB/DocumentDB, Snowflake, Step Functions, AppSync (WebSocket), S3

**Core Problem:** FloQast Close has a folder-centric data model where folders serve triple duty as organization, permissioning, and storage sync anchors. This tight coupling is the primary architectural debt driving the rearchitecture.

**Strategic Direction:** Evolve from folder-centric to task-centric architecture with:
- Checklist item as master object (rich container with sub-tasks, dependencies, documents, review notes, agents, transactions)
- Search-first navigation replacing folder hierarchy
- Unified data ingestion via FloLake Silver Layer
- Event-driven workflow engine replacing static rule routing
- ReBAC (Relationship-Based Access Control) decoupling permissions from folders

**Concurrent Initiative:** Project Catalyst is a UX-layer redesign (left nav, global search, task/inbox view, drill-down object view, close timeline) targeting FQGO Spring 2026 showcase.

## Working With These Documents

- Documents reference Confluence pages, Slack channels, Gong recordings, and internal FloQast systems that are not included here
- Technical details (service names, collection schemas, API routes) reflect the state as of Feb 2026 and may drift
- The PDF/DOCX report is a formatted compilation; the markdown files are the living source documents
