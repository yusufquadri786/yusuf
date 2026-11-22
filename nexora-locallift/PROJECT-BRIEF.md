# Project Brief — NEXORA LocalLift

## Summary

NEXORA LocalLift is a lightweight digital-presence readiness self-check for small businesses. It helps an owner or project consultant identify gaps in a business's website experience, discoverability, trust information and enquiry flow.

## Problem

Small businesses often know they need a stronger online presence but are unsure which improvements should come first. A generic sales pitch does not help them understand the gaps or choose a realistic first step.

## Audience

- Local shops, cafés and restaurants.
- Tutors and coaching services.
- Independent professionals.
- Home and local service providers.
- Small creator-led brands.

## Core user journey

1. Enter a business name and category.
2. Select the business's main digital goal.
3. Answer 10 practical Yes / Partly / No questions.
4. Review a score and four category breakdowns.
5. Read prioritised suggestions.
6. Download or print the self-assessment report.

## Scoring model

Each of the four categories is worth 25 points. Yes earns 100% of a question's weight, Partly earns 50%, and No earns 0%.

| Category | Questions | Weight |
|---|---|---:|
| Website experience | Current website (10), mobile experience (8), clear next action (7) | 25 |
| Discovery | Updated Google profile (10), active social profile (8), visible contact details (7) | 25 |
| Trust and clarity | Genuine reviews (10), clear services/details (8), pricing or quote path (7) | 25 |
| Enquiry and conversion | Enquiry/booking path (12), follow-up routine (13) | 25 |
| **Total** | **10 questions** | **100** |

## Design direction

- Premium dark charcoal background.
- NEXORA orange highlights and warm neutral typography.
- Card-based form sections with clear mobile spacing.
- Progress-friendly question grouping and accessible focus states.
- Print-friendly results.

## Technical approach

- Semantic HTML form.
- Vanilla JavaScript with an explicit scoring model.
- CSS Grid and responsive breakpoints.
- Browser-only report generation using Blob download and print.
- No external dependencies, APIs, cookies or persistent storage.

## Privacy and safety

The tool is a self-assessment, not a live scan. It does not fetch a submitted URL or send business information to a remote service. Users should not enter personal customer records.

## Acceptance checks

- All 10 questions must be answered before scoring.
- Maximum score is 100 and minimum score is 0.
- Partial answers contribute exactly half of their question weight.
- Recommendations exclude answers marked Yes and are ordered by weighted gap.
- User-entered business name is rendered as text, not HTML.
- Report download uses the current assessment.
- Layout remains usable at narrow mobile widths.
- No paid service, secret, backend or external data request is required.

## Out of scope

- Automatic website crawling or security scanning.
- Google Business Profile or social account connection.
- Lead capture, CRM or customer database.
- Promises about sales, rankings or business outcomes.
