# NEXORA ClientDesk — Project Brief

## Product idea
NEXORA ClientDesk is a local-first customer project workspace for a small web and AI studio. It helps organise customer needs, budget boundaries, delivery stages and handover checks without requiring an account or paid API.

## Problem
Small projects often begin in scattered chats and notes. Important requirements, agreed budgets and final access checks can be missed. A lightweight project record makes the work easier to plan and verify.

## Intended users
- A small independent web-development or AI-services studio.
- A student or beginner building a supervised portfolio workflow.
- A small team that wants a simple, private project checklist.

## Core user journey
1. Add a project using a short client/business label.
2. Record the customer's need, service type, requested features and target date.
3. Set the customer budget and an internal planned-cost estimate.
4. Track the project through Discovery, Planning, Building, Testing and Delivered.
5. Record actual spend and monitor whether it exceeds the budget.
6. Complete the delivery checklist and export a project brief.
7. Export a JSON backup before changing devices or clearing browser data.

## Features
- Responsive black-and-orange NEXORA interface.
- Project creation and search/filter by stage.
- INR budget, planned cost and actual-spend tracking.
- Budget-overrun warning.
- Editable project stage and delivery checklist.
- Copy/download project brief.
- JSON backup export/import with basic input validation.
- Browser localStorage persistence.

## Privacy and limitations
- Data is stored only in the current browser's localStorage; there is no backend or cloud sync.
- Do not enter passwords, payment details, private identifiers or sensitive customer information.
- Browser data can be lost if site data is cleared; export backups regularly.
- This is an internal planning tool, not an invoicing, accounting, contract-signing or secure CRM system.
- Budget figures are user-entered planning values, not automatic market-price quotations.

## Success criteria
- A user can create, search, update and delete project records.
- A user can update stages, spend and checklist items.
- Budget overruns are visibly identified.
- A user can export/import a JSON backup and export a text project brief.
- The layout remains usable on phone, tablet and desktop widths.
