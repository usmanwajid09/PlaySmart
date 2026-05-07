const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, PageBreak, ShadingType } = require("docx");
const fs = require("fs");
const path = require("path");

const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const headerShading = { type: ShadingType.SOLID, color: "2E75B6" };
const lightShading = { type: ShadingType.SOLID, color: "D9E2F3" };
const greenShading = { type: ShadingType.SOLID, color: "E2EFDA" };
const yellowShading = { type: ShadingType.SOLID, color: "FFF2CC" };

function hCell(text) {
  return new TableCell({ children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 20 })], alignment: AlignmentType.CENTER })], shading: headerShading, borders });
}
function dCell(text, shading) {
  return new TableCell({ children: [new Paragraph({ children: [new TextRun({ text, size: 20 })], spacing: { after: 40 } })], shading, borders });
}
function para(text, opts = {}) { return new Paragraph({ children: [new TextRun({ text, ...opts })], spacing: { after: 100 } }); }
function boldPara(label, text) { return new Paragraph({ children: [new TextRun({ text: label, bold: true }), new TextRun({ text })], spacing: { after: 100 } }); }
function bullet(text) { return new Paragraph({ text, bullet: { level: 0 }, spacing: { after: 60 } }); }

function heuristicSection(num, name, description, rating, evidence, issues, improvements) {
  const items = [];
  items.push(new Paragraph({ children: [new TextRun({ text: `Heuristic ${num}: ${name}`, bold: true, size: 28, color: "1A5C97" })], heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 100 } }));
  items.push(para(description, { italics: true, color: "555555" }));
  items.push(new Paragraph(""));

  // Rating table
  items.push(new Table({ rows: [
    new TableRow({ children: [hCell("Rating (1-5)"), hCell("Compliance Level")] }),
    new TableRow({ children: [
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${rating} / 5`, bold: true, size: 28 })], alignment: AlignmentType.CENTER })], borders, shading: rating >= 4 ? greenShading : rating >= 3 ? yellowShading : undefined }),
      dCell(rating >= 4 ? "Strong Compliance" : rating >= 3 ? "Moderate Compliance" : "Needs Improvement", rating >= 4 ? greenShading : rating >= 3 ? yellowShading : undefined),
    ] }),
  ], width: { size: 100, type: WidthType.PERCENTAGE } }));
  items.push(new Paragraph(""));

  // Evidence
  items.push(new Paragraph({ children: [new TextRun({ text: "Evidence from Design:", bold: true, size: 22, color: "2E75B6" })], spacing: { after: 60 } }));
  for (const e of evidence) items.push(bullet(e));
  items.push(new Paragraph(""));

  // Issues
  items.push(new Paragraph({ children: [new TextRun({ text: "Issues Identified:", bold: true, size: 22, color: "CC0000" })], spacing: { after: 60 } }));
  if (issues.length === 0) items.push(para("No significant issues identified.", { italics: true, color: "666666" }));
  else {
    items.push(new Table({ rows: [
      new TableRow({ children: [hCell("#"), hCell("Issue Description"), hCell("Severity"), hCell("Screen")] }),
      ...issues.map((iss, i) => new TableRow({ children: [dCell(`${i+1}`), dCell(iss[0]), dCell(iss[1]), dCell(iss[2])] }))
    ], width: { size: 100, type: WidthType.PERCENTAGE } }));
  }
  items.push(new Paragraph(""));

  // Improvements
  items.push(new Paragraph({ children: [new TextRun({ text: "Suggested Improvements:", bold: true, size: 22, color: "006600" })], spacing: { after: 60 } }));
  for (const imp of improvements) items.push(bullet(imp));
  items.push(new Paragraph({ children: [new PageBreak()] }));
  return items;
}

async function buildWorkbook() {
  const children = [];

  // TITLE PAGE
  for (let i = 0; i < 6; i++) children.push(new Paragraph(""));
  children.push(new Paragraph({ children: [new TextRun({ text: "Heuristic Evaluation Workbook", bold: true, size: 56, color: "1A5C97" })], alignment: AlignmentType.CENTER }));
  children.push(new Paragraph({ children: [new TextRun({ text: "PlaySmart - Football Training App", size: 32, color: "444444" })], alignment: AlignmentType.CENTER }));
  children.push(new Paragraph(""));
  children.push(new Paragraph({ children: [new TextRun({ text: "Based on Jakob Nielsen's 10 Usability Heuristics", italics: true, size: 24, color: "666666" })], alignment: AlignmentType.CENTER }));
  children.push(new Paragraph(""));
  for (const line of ["Evaluators: Usman Wajid, Ahmad Masood, Abdulrehman Naseer", "Instructor: Arslan Asif", "Date: April 2025", "", "Project Link: https://stitch.withgoogle.com/projects/12363635124012461076"])
    children.push(new Paragraph({ children: [new TextRun({ text: line, size: 22, color: "555555" })], alignment: AlignmentType.CENTER }));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // SUMMARY TABLE
  children.push(new Paragraph({ text: "Evaluation Summary", heading: HeadingLevel.HEADING_1, spacing: { after: 200 } }));
  children.push(new Table({ rows: [
    new TableRow({ children: [hCell("#"), hCell("Heuristic"), hCell("Rating"), hCell("Status")] }),
    ...[ ["1","Visibility of System Status","4","Strong"],["2","Match Between System & Real World","5","Strong"],["3","User Control and Freedom","4","Strong"],["4","Consistency and Standards","5","Strong"],["5","Error Prevention","3","Moderate"],["6","Recognition Rather Than Recall","5","Strong"],["7","Flexibility and Efficiency of Use","4","Strong"],["8","Aesthetic and Minimalist Design","5","Strong"],["9","Help Users with Errors","3","Moderate"],["10","Help and Documentation","3","Moderate"]
    ].map((r, i) => new TableRow({ children: r.map(c => dCell(c, i % 2 === 1 ? lightShading : undefined)) }))
  ], width: { size: 100, type: WidthType.PERCENTAGE } }));
  children.push(new Paragraph(""));
  children.push(boldPara("Overall Score: ", "41 / 50 (82% - Good Usability)"));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // HEURISTIC 1
  children.push(...heuristicSection(1, "Visibility of System Status",
    "The system should always keep users informed about what is going on through appropriate feedback within reasonable time.",
    4,
    ["Training In-Progress screen shows real-time countdown timer, current exercise name, and set/rep counter",
     "Player Progress screen displays weekly goal completion ring at 75% with daily bar charts",
     "Training Completed screen provides comprehensive session summary (time, exercises, calories)",
     "Bottom navigation bar highlights the active tab with volt green (#CAFD00) accent",
     "Match Preparation screen shows 50% progress bar for checklist completion"],
    [["No loading skeleton screens shown during initial data fetch","Medium","All screens"],
     ["Sync status not visible when training data is being uploaded","Low","Training Completed"]],
    ["Add skeleton loading screens during initial page loads to indicate content is being fetched",
     "Display a subtle sync indicator in the status bar when data is being uploaded to the server",
     "Add pull-to-refresh animation to indicate data refresh capability"]
  ));

  // HEURISTIC 2
  children.push(...heuristicSection(2, "Match Between System and Real World",
    "The system should speak the users' language, with words, phrases, and concepts familiar to the user.",
    5,
    ["Uses authentic football terminology: 'Drills', 'Sessions', 'RPE', 'Sprint Intervals', 'Passing Triangle'",
     "Training categories use familiar sport icons and labels: Shooting, Speed, Tactics",
     "RPE (Rate of Perceived Exertion) scale 1-10 matches industry-standard athletic assessment",
     "Calendar uses standard weekly format (Mon-Sun) familiar to all users",
     "Coach dashboard uses terms like 'Player Roster', 'Session History' matching real coaching workflows",
     "Fatigue indicators use intuitive traffic-light colors: green (Low), yellow (Medium), red (High)"],
    [],
    ["Consider adding brief tooltips for technical terms like RPE for casual users",
     "Include metric/imperial toggle for distance and weight measurements"]
  ));

  // HEURISTIC 3
  children.push(...heuristicSection(3, "User Control and Freedom",
    "Users often choose system functions by mistake and need a clearly marked emergency exit.",
    4,
    ["Every screen (except Welcome) has a back arrow for navigation",
     "Confirmation dialog appears before destructive actions: 'Delete Training Session?'",
     "Cancel button present on all dialog overlays",
     "Bottom navigation provides direct access to any section from any screen",
     "Profile screen includes 'Switch to Coach Mode' for role switching"],
    [["No undo option after deleting a training session (even with confirmation)","Medium","Confirmation Dialog"],
     ["Cannot pause and resume a training session mid-workout","Medium","Training In-Progress"]],
    ["Implement 'Undo' toast notification for 5 seconds after deletion allowing recovery",
     "Add pause/resume functionality to the in-progress training timer",
     "Allow users to save partial session progress if they need to exit early"]
  ));

  // HEURISTIC 4
  children.push(...heuristicSection(4, "Consistency and Standards",
    "Users should not have to wonder whether different words, situations, or actions mean the same thing.",
    5,
    ["Consistent bottom navigation bar across all 14 screens with identical styling",
     "Uniform card design: surface-container-high background, no borders, consistent spacing",
     "Typography hierarchy maintained: Space Grotesk for headings, Inter for body text",
     "Color system applied consistently: volt green for primary actions, white for text, gray for metadata",
     "Button styles uniform: primary (#CAFD00), secondary (surface), ghost (transparent), destructive (red)",
     "Filter chips maintain same style in Drill Library and Training Categories screens"],
    [],
    ["Document and share the design system tokens for future development consistency",
     "Create a component library reference for developers implementing the interface"]
  ));

  // HEURISTIC 5
  children.push(...heuristicSection(5, "Error Prevention",
    "Even better than good error messages is a careful design which prevents a problem from occurring.",
    3,
    ["Confirmation dialog prevents accidental session deletion",
     "Login form includes field validation for email format and password requirements",
     "RPE scale provides bounded input (1-10) preventing invalid entries",
     "Category filters constrain drill browsing to valid categories only"],
    [["No real-time validation feedback on login form fields","Medium","Login Screen"],
     ["No warning when scheduling overlapping training sessions","Medium","Training Calendar"],
     ["No confirmation when adding a high-intensity drill for a player with high fatigue","High","Drill Library"]],
    ["Add inline validation with real-time feedback as users type in form fields",
     "Implement schedule conflict detection when creating new training sessions",
     "Show fatigue-aware warnings when coaches assign intense drills to fatigued players",
     "Add auto-save for in-progress session creation to prevent data loss"]
  ));

  // HEURISTIC 6
  children.push(...heuristicSection(6, "Recognition Rather Than Recall",
    "Minimize the user's memory load by making objects, actions, and options visible.",
    5,
    ["Dashboard displays all 4 quick-action cards simultaneously (Plan Training, Drill Library, Progress, Match Prep)",
     "Drill cards show all key information upfront: name, duration, difficulty level, and category",
     "Training Calendar provides visual overview of entire week's schedule at a glance",
     "Player Progress shows aggregated stats (12 Sessions, 8.5 Hours, 47 Drills) without requiring navigation",
     "Coach Dashboard shows team readiness with color-coded indicators visible immediately",
     "Bottom navigation icons paired with text labels for recognition"],
    [],
    ["Add 'Recent Drills' section on the dashboard for quick re-access",
     "Show recently viewed screens in a breadcrumb or history pattern"]
  ));

  // HEURISTIC 7
  children.push(...heuristicSection(7, "Flexibility and Efficiency of Use",
    "Accelerators may speed up interaction for expert users without encumbering novices.",
    4,
    ["Filter chips in Drill Library allow quick category filtering (All, Fitness, Skills, Tactical)",
     "Search bar in Drill Library enables direct drill lookup by name",
     "Quick-action cards on Dashboard provide one-tap access to common tasks",
     "Weekly/Monthly toggle on Progress screen allows different time-frame views",
     "Coach can browse drill library directly or through category-filtered views"],
    [["No keyboard shortcuts or gesture-based navigation for power users","Low","All screens"],
     ["No 'Quick Start' button for immediately beginning a recommended drill","Medium","Player Dashboard"]],
    ["Add a prominent 'Start Training Now' button on the dashboard for immediate workout initiation",
     "Implement swipe gestures for navigating between calendar days/weeks",
     "Add 'Favorites' or 'Pinned Drills' for frequently used exercises"]
  ));

  // HEURISTIC 8
  children.push(...heuristicSection(8, "Aesthetic and Minimalist Design",
    "Dialogues should not contain information which is irrelevant or rarely needed.",
    5,
    ["Dark 'Kinetic Precision' theme reduces visual noise and focuses attention on content",
     "Tonal layering creates depth without cluttering borders or shadows",
     "Information hierarchy clear: large numbers for key stats, small labels for metadata",
     "Cards contain only essential information; details available on drill detail screens",
     "Color used purposefully: volt green only for primary actions and active states",
     "Generous whitespace (2rem+) between sections prevents cognitive overload",
     "No decorative icons; every visual element serves a functional purpose"],
    [],
    ["Consider progressive disclosure for Match Preparation checklist details",
     "Offer a 'compact mode' toggle for information-dense views preferred by coaches"]
  ));

  // HEURISTIC 9
  children.push(...heuristicSection(9, "Help Users Recognize, Diagnose, and Recover from Errors",
    "Error messages should be expressed in plain language, precisely indicate the problem, and suggest a solution.",
    3,
    ["Error toast message clearly states problem: 'Failed to sync data. Please check your connection.'",
     "Error message includes actionable 'Retry' link for immediate recovery",
     "Red color coding (#FF7351) for error states provides immediate visual distinction",
     "Success toast confirms completed actions: 'Session saved successfully!'"],
    [["Error messages don't provide specific technical details about the failure cause","Medium","UI States"],
     ["No offline mode indicator or guidance when network is unavailable","High","All screens"],
     ["Form validation errors not specific enough (e.g., 'Invalid input' vs specific guidance)","Medium","Login"]],
    ["Provide specific error descriptions: 'No internet connection' vs generic 'Failed to sync'",
     "Add offline mode banner with guidance: 'You're offline. Data will sync when connected.'",
     "Show field-level validation messages: 'Email must include @' instead of generic 'Invalid'",
     "Add error logging and 'Report Issue' option for persistent problems"]
  ));

  // HEURISTIC 10
  children.push(...heuristicSection(10, "Help and Documentation",
    "It may be necessary to provide help and documentation focused on the user's task.",
    3,
    ["Login screen provides clear labels and placeholder text guiding input",
     "RPE scale includes numbered options (1-10) for guided self-assessment",
     "Training categories include descriptive labels (Shooting, Speed, Tactics) aiding selection",
     "Match Preparation checklist items have clear labels indicating required actions"],
    [["No onboarding tutorial for first-time users explaining key features","High","Welcome Screen"],
     ["No contextual help tooltips on complex features like RPE or fatigue tracking","Medium","Multiple screens"],
     ["No FAQ or help section accessible from the app","Medium","Settings"]],
    ["Add a brief onboarding walkthrough (3-4 screens) after first login highlighting key features",
     "Implement contextual '?' tooltips on RPE scale ('1 = No Effort, 10 = Maximum Effort')",
     "Add a 'Help & FAQ' section in Settings with common questions and video tutorials",
     "Include inline guidance text for first-time actions: 'Tap a drill to see details'"]
  ));

  // SUMMARY & RECOMMENDATIONS
  children.push(new Paragraph({ text: "Summary & Key Recommendations", heading: HeadingLevel.HEADING_1, spacing: { after: 200 } }));
  
  children.push(new Paragraph({ children: [new TextRun({ text: "Strengths:", bold: true, size: 24, color: "006600" })], spacing: { after: 100 } }));
  children.push(bullet("Excellent visual consistency across all 14 screens (Heuristic 4: 5/5)"));
  children.push(bullet("Strong use of real-world football terminology and intuitive metaphors (Heuristic 2: 5/5)"));
  children.push(bullet("Outstanding aesthetic design with purposeful minimalism (Heuristic 8: 5/5)"));
  children.push(bullet("Effective recognition-based navigation reducing memory load (Heuristic 6: 5/5)"));
  children.push(new Paragraph(""));

  children.push(new Paragraph({ children: [new TextRun({ text: "Priority Improvements:", bold: true, size: 24, color: "CC0000" })], spacing: { after: 100 } }));
  children.push(bullet("HIGH: Add onboarding tutorial for first-time users (Heuristic 10)"));
  children.push(bullet("HIGH: Implement fatigue-aware drill warnings for player safety (Heuristic 5)"));
  children.push(bullet("HIGH: Add offline mode support with sync indicators (Heuristic 9)"));
  children.push(bullet("MEDIUM: Add pause/resume for in-progress training sessions (Heuristic 3)"));
  children.push(bullet("MEDIUM: Implement real-time form validation with specific messages (Heuristic 5)"));
  children.push(bullet("MEDIUM: Add contextual help tooltips for technical features (Heuristic 10)"));

  const doc = new Document({ sections: [{ children }] });
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(__dirname, "PlaySmart-Heuristic-Evaluation.docx"), buf);
  console.log("Heuristic Workbook generated: PlaySmart-Heuristic-Evaluation.docx (" + Math.round(buf.length/1024) + " KB)");
}

buildWorkbook().catch(console.error);
