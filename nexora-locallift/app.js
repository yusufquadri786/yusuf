const form = document.querySelector("#auditForm");
const results = document.querySelector("#results");
const scoreRing = document.querySelector("#scoreRing");
const scoreValue = document.querySelector("#scoreValue");
const scoreLabel = document.querySelector("#scoreLabel");
const scoreMessage = document.querySelector("#scoreMessage");
const categoryBars = document.querySelector("#categoryBars");
const recommendationList = document.querySelector("#recommendationList");
let latestReport = null;

const categories = [
  { title: "Website experience", fields: [{ key: "website", weight: 10, label: "Create or refresh a simple website", detail: "Give visitors one clear place to understand the business, services and contact options." }, { key: "mobile", weight: 8, label: "Improve the mobile experience", detail: "Check text size, loading, navigation and tap targets on a phone." }, { key: "cta", weight: 7, label: "Make the next step obvious", detail: "Add one clear call, message, booking or purchase action to key pages." }] },
  { title: "Discovery", fields: [{ key: "google", weight: 10, label: "Complete the Google Business Profile", detail: "Review business hours, category, contact details, photos and service information." }, { key: "social", weight: 8, label: "Refresh one social profile", detail: "Use a consistent description, current contact details and recent useful updates." }, { key: "contact", weight: 7, label: "Make contact details easy to find", detail: "Show the preferred contact method in a consistent place." }] },
  { title: "Trust and clarity", fields: [{ key: "reviews", weight: 10, label: "Show genuine customer feedback", detail: "Invite real customers to leave honest reviews and display feedback with permission." }, { key: "services", weight: 8, label: "Explain services and key details", detail: "Clarify what is offered, who it helps, service areas and opening hours." }, { key: "pricing", weight: 7, label: "Explain pricing or quote steps", detail: "Share useful starting information or explain how customers can request a quote." }] },
  { title: "Enquiry and conversion", fields: [{ key: "booking", weight: 12, label: "Add a simple enquiry or booking path", detail: "Offer a short contact form, booking link or clear message option." }, { key: "followup", weight: 13, label: "Set a reliable enquiry follow-up routine", detail: "Choose who replies, where enquiries are tracked and when customers can expect a response." }] }
];

const valueScore = { yes: 1, partial: 0.5, no: 0 };
const valueLabel = { yes: "Yes", partial: "Partly / needs checking", no: "No" };

function getAnswer(key) {
  return form.querySelector(`input[name="${key}"]:checked`)?.value || "no";
}

function scoreAssessment() {
  const breakdown = categories.map(category => {
    const earned = category.fields.reduce((sum, field) => sum + field.weight * valueScore[getAnswer(field.key)], 0);
    return { title: category.title, score: Math.round(earned), max: 25 };
  });
  const total = Math.round(breakdown.reduce((sum, category) => sum + category.score, 0));
  const recommendations = categories.flatMap(category => category.fields
    .filter(field => getAnswer(field.key) !== "yes")
    .map(field => ({ ...field, category: category.title, answer: getAnswer(field.key), priority: field.weight * (1 - valueScore[getAnswer(field.key)]) })))
    .sort((a, b) => b.priority - a.priority);
  return { total, breakdown, recommendations };
}

function scoreDescription(score) {
  if (score >= 85) return { label: "Strong foundations", message: "The basics look well covered. Focus on consistency and small improvements." };
  if (score >= 65) return { label: "Building momentum", message: "Several foundations are in place. A few focused improvements could make the experience clearer." };
  if (score >= 40) return { label: "Room to grow", message: "There are useful building blocks, but customers may still face gaps when finding or contacting the business." };
  return { label: "Start with the essentials", message: "Choose a small number of practical basics and build from there, one step at a time." };
}

function addText(parent, tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function renderReport(report, businessName, businessType, goal) {
  const description = scoreDescription(report.total);
  document.querySelector("#resultTitle").textContent = `${businessName} — readiness report`;
  document.querySelector("#resultSubtitle").textContent = `${businessType} · Goal: ${goal}`;
  scoreValue.textContent = report.total;
  scoreLabel.textContent = description.label;
  scoreMessage.textContent = description.message;
  scoreRing.style.setProperty("--score", `${report.total}%`);

  categoryBars.replaceChildren();
  report.breakdown.forEach(category => {
    const row = document.createElement("div");
    row.className = "bar-row";
    const meta = document.createElement("div");
    meta.className = "bar-meta";
    addText(meta, "span", "", category.title);
    addText(meta, "span", "", `${category.score} / ${category.max}`);
    row.append(meta);
    const track = document.createElement("div");
    track.className = "bar-track";
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", category.title);
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", "25");
    track.setAttribute("aria-valuenow", String(category.score));
    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.width = `${category.score / 25 * 100}%`;
    track.append(fill);
    row.append(track);
    categoryBars.append(row);
  });

  recommendationList.replaceChildren();
  if (report.recommendations.length === 0) {
    const item = document.createElement("li");
    addText(item, "strong", "", "Keep the foundations up to date");
    addText(item, "p", "", "Your answers show that all listed basics are in place. Review details regularly and ask customers what could be clearer.");
    recommendationList.append(item);
  } else {
    report.recommendations.slice(0, 7).forEach(recommendation => {
      const item = document.createElement("li");
      const copy = document.createElement("div");
      addText(copy, "strong", "", recommendation.label);
      addText(copy, "p", "", `${recommendation.category} · ${recommendation.detail} Your answer: ${valueLabel[recommendation.answer]}.`);
      item.append(copy);
      recommendationList.append(item);
    });
  }
}

function buildTextReport(report, businessName, businessType, goal) {
  const description = scoreDescription(report.total);
  const lines = [
    "NEXORA LOCALLIFT — DIGITAL PRESENCE SELF-CHECK",
    "================================================",
    `Business: ${businessName}`,
    `Type: ${businessType}`,
    `Main goal: ${goal}`,
    `Readiness score: ${report.total}/100 — ${description.label}`,
    "",
    "CATEGORY BREAKDOWN",
    ...report.breakdown.map(item => `- ${item.title}: ${item.score}/25`),
    "",
    "RECOMMENDED NEXT STEPS",
    ...(report.recommendations.length
      ? report.recommendations.slice(0, 7).map((item, index) => `${index + 1}. ${item.label} — ${item.detail} (Answer: ${valueLabel[item.answer]})`)
      : ["All listed basics were marked Yes. Keep the information accurate and review it regularly."]),
    "",
    "Note: This is a self-assessment based on user answers, not a technical scan, ranking guarantee or professional certification.",
    "Privacy: This report is generated locally in your browser. No answers are uploaded by this tool."
  ];
  return lines.join("\n");
}

form.addEventListener("submit", event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const businessName = document.querySelector("#businessName").value.trim();
  const businessType = document.querySelector("#businessType").value;
  const goal = document.querySelector("#mainGoal").value;
  if (!businessName || !businessType) return;
  const report = scoreAssessment();
  latestReport = { report, businessName, businessType, goal };
  renderReport(report, businessName, businessType, goal);
  results.classList.remove("hidden");
  results.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#downloadButton").addEventListener("click", () => {
  if (!latestReport) return;
  const { report, businessName, businessType, goal } = latestReport;
  const blob = new Blob([buildTextReport(report, businessName, businessType, goal)], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `nexora-locallift-${businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "report"}.txt`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
});

document.querySelector("#printButton").addEventListener("click", () => window.print());

document.querySelector("#resetButton").addEventListener("click", () => {
  form.reset();
  latestReport = null;
  results.classList.add("hidden");
  form.scrollIntoView({ behavior: "smooth", block: "start" });
});

if (typeof module !== "undefined" && module.exports) {
  module.exports = { categories, valueScore, scoreAssessment, scoreDescription, buildTextReport };
}
