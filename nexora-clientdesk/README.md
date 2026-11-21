# NEXORA ClientDesk

A responsive, local-first customer project workspace for NEXORA AI. Track customer requirements, budgets, project stages and delivery checklists in one place.

## Features
- Create and search customer projects.
- Filter by Discovery, Planning, Building, Testing or Delivered.
- Track customer budget, planned cost and actual spend in INR.
- See a warning when actual spend exceeds the customer budget.
- Update delivery stages and tick off handover checks.
- Add custom checklist items.
- Copy or download a plain-text project brief.
- Export and import a JSON backup.
- Responsive black-and-orange design.

## Run locally

No package installation or build step is required.

1. Download or clone this repository.
2. Open the nexora-clientdesk folder.
3. Open index.html in a modern browser, or use VS Code with the Live Server extension.

## Deploy to Vercel (static site)

1. Import the GitHub repository into Vercel.
2. Set Root Directory to nexora-clientdesk.
3. Framework preset: Other (static site).
4. Build command: leave empty.
5. Output directory: leave empty / use the project root if prompted.
6. Deploy only after reviewing the repository and confirming the intended public visibility.

The project has no environment variables, backend, database or paid API dependency.

## Data and privacy

Project data is saved in the current browser using localStorage. It is not sent to a server. Use Export backup before switching browsers/devices or clearing site data. Do not enter passwords, payment details, private identifiers or sensitive customer information.

## Budget note

Customer budget, planned cost and actual spend are manual planning fields. They are not a formal quote, invoice or accounting record. Confirm scope, price and any paid third-party service with the customer and an authorised adult before committing.

## Files

- index.html — page structure and form.
- styles.css — responsive visual design.
- app.js — project records, budget checks, checklist, storage and backup actions.
- PROJECT-BRIEF.md — product brief and acceptance criteria.

## License
Portfolio starter. Add a license before redistributing it as an open-source package.
