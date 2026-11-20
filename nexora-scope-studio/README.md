# NEXORA Scope Studio

A responsive, no-backend project discovery and budget-planning web app for the NEXORA AI portfolio. Visitors can describe a digital project, choose a first-release scope, compare that scope with an intended budget, and generate a brief they can copy or download.

## Project brief

**Problem:** Early customer conversations often begin with an unclear idea, an unknown feature list, and a budget that has not been connected to the scope.

**Solution:** Scope Studio gives a customer a guided, two-minute intake flow and creates a structured project brief with an illustrative INR planning range and a budget-aware MVP suggestion.

**Audience:** Small businesses, creators, local organisations, and founders exploring a website, mobile app, AI solution, or workflow automation.

**Primary user journey:**
1. Select a project type.
2. Describe the outcome and choose size, design, features, integrations, budget, and timeline.
3. Review the indicative estimate and suggested first phase.
4. Generate, copy, or download the project brief.

## Features

- Responsive black-and-orange NEXORA AI design.
- Four project types: website, mobile app, AI solution, and automation.
- Scope, feature, integration, design, budget, and timeline inputs.
- Transparent, illustrative INR estimate with budget-fit guidance.
- MVP-first guidance when selected budget is below the estimated scope.
- Generated project brief with copy and \`.txt\` download actions.
- Accessible form labels, keyboard focus states, and reduced-motion support.
- No account, backend, paid API, external library, or server submission.

## Run locally

No build step or package installation is required.

1. Download or clone this repository.
2. Open \`index.html\` in a modern browser, or open the folder in VS Code and use a local static server.

## Deploy on Vercel (static)

1. Import the GitHub repository into Vercel after signing in and granting the required repository access.
2. Set **Root Directory** to \`nexora-scope-studio\`.
3. Select **Other** / no framework preset.
4. Leave Build Command and Install Command empty.
5. Set Output Directory to \`.\` if the dashboard requires a value.
6. Deploy. No environment variables are needed.

A deployment is not included in this source commit; it must be created from an authorised Vercel account after access is approved.

## Estimate disclaimer

The displayed prices are rough planning examples only. They are not a quote, guarantee, or promise of delivery cost. A real proposal must be based on confirmed requirements, third-party services, hosting, security, testing, support, and the customer's approval. Paid services must be disclosed and approved separately.

## Privacy

The app has no backend and does not transmit or persist form entries. Brief generation, copy, and download happen in the visitor's browser. The visitor chooses whether and where to share the downloaded brief.

## Quality checks

- No third-party JavaScript or CSS dependencies.
- Inputs are read with \`FormData\` and output is rendered with \`textContent\` (not injected as HTML).
- Required project name and goal are validated before a brief is generated.
- Estimate recalculates when form inputs change.
- Reset clears the generated brief and recalculates the default estimate.
