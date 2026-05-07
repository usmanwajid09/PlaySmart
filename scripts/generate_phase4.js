const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ImageRun, ExternalHyperlink, PageBreak, ShadingType, TabStopType } = require("docx");
const fs = require("fs");
const path = require("path");

const SHOTS = path.join(__dirname, "hifi-screenshots");
const STORY = path.join(__dirname, "storyboard-images");
const WIRE = path.join(__dirname, "wireframe-images");

function findImg(dir, keyword) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  const f = files.find(n => n.includes(keyword) && n.endsWith('.png'));
  return f ? path.join(dir, f) : null;
}

function img(filePath, w = 500) {
  if (!filePath || !fs.existsSync(filePath)) return new TextRun({ text: "[Image not available]", italics: true, color: "999999" });
  return new ImageRun({ data: fs.readFileSync(filePath), transformation: { width: w, height: Math.round(w * 1.5) }, type: "png" });
}

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ text, heading: level, spacing: { before: 200, after: 100 } });
}

function para(text, opts = {}) {
  return new Paragraph({ children: [new TextRun({ text, ...opts })], spacing: { after: 120 } });
}

function boldPara(label, text) {
  return new Paragraph({ children: [new TextRun({ text: label, bold: true }), new TextRun({ text })], spacing: { after: 120 } });
}

function bullet(text) {
  return new Paragraph({ text, bullet: { level: 0 }, spacing: { after: 60 } });
}

function linkPara(label, url, linkText) {
  return new Paragraph({ children: [
    new TextRun({ text: label, bold: true }),
    new ExternalHyperlink({ children: [new TextRun({ text: linkText, style: "Hyperlink" })], link: url })
  ], spacing: { after: 120 } });
}

const headerShading = { type: ShadingType.SOLID, color: "2E75B6" };
const altShading = { type: ShadingType.SOLID, color: "D9E2F3" };
const noBorder = { style: BorderStyle.NONE, size: 0 };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

function headerCell(text) {
  return new TableCell({ children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 20 })], alignment: AlignmentType.CENTER })], shading: headerShading, borders });
}
function dataCell(text, shaded = false) {
  return new TableCell({ children: [new Paragraph({ children: [new TextRun({ text, size: 20 })], spacing: { after: 40 } })], shading: shaded ? altShading : undefined, borders });
}

function styledTable(headers, rows) {
  return new Table({
    rows: [
      new TableRow({ children: headers.map(h => headerCell(h)), tableHeader: true }),
      ...rows.map((r, i) => new TableRow({ children: r.map(c => dataCell(c, i % 2 === 1)) }))
    ],
    width: { size: 100, type: WidthType.PERCENTAGE }
  });
}

async function buildReport() {
  const children = [];
  
  // TITLE PAGE
  for (let i = 0; i < 8; i++) children.push(new Paragraph(""));
  children.push(new Paragraph({ children: [new TextRun({ text: "PlaySmart", bold: true, size: 72, color: "1A5C97" })], alignment: AlignmentType.CENTER }));
  children.push(new Paragraph({ children: [new TextRun({ text: "Phase 4: High-Fidelity Design and Heuristic Evaluation", size: 36, color: "444444" })], alignment: AlignmentType.CENTER }));
  children.push(new Paragraph(""));
  children.push(new Paragraph({ children: [new TextRun({ text: "A Human-Centered Football Training and Performance Planning Interface", italics: true, size: 24, color: "666666" })], alignment: AlignmentType.CENTER }));
  children.push(new Paragraph(""));
  for (const line of ["Team Members: Usman Wajid, Ahmad Masood, Abdulrehman Naseer", "Instructor: Arslan Asif", "Date: April 2025"])
    children.push(new Paragraph({ children: [new TextRun({ text: line, size: 22, color: "555555" })], alignment: AlignmentType.CENTER }));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // TOC
  children.push(heading("Table of Contents"));
  for (const item of ["1. Introduction","2. Design System","3. High-Fidelity Screen Catalog","4. Navigation Flow & Interaction Design","5. UI Components Showcase","6. Design Principles Applied","7. Conclusion","Appendix: Design Links"])
    children.push(para(item));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // 1. INTRODUCTION
  children.push(heading("1. Introduction"));
  children.push(para('This phase transforms the low-fidelity wireframes from Phase 3 into polished, high-fidelity mockups using the "Kinetic Precision" design system - a dark, performance-focused visual language for athletes and coaches.'));
  children.push(para("Phase 4 delivers two key artifacts:"));
  children.push(bullet("High-Fidelity Designs: 14 complete screens covering all navigational paths including player flows, coach flows, and system interaction states"));
  children.push(bullet("Heuristic Evaluation Workbook: Systematic evaluation against Jakob Nielsen's 10 Heuristic Principles"));
  children.push(linkPara("Interactive Prototype: ", "https://stitch.withgoogle.com/projects/12363635124012461076", "PlaySmart Hi-Fi Designs - Stitch"));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // 2. DESIGN SYSTEM
  children.push(heading("2. Design System"));
  children.push(heading("2.1 Color Palette", HeadingLevel.HEADING_2));
  children.push(para('The "Kinetic Precision" design system uses a dark, high-contrast palette:'));
  children.push(styledTable(["Token","Hex","Usage"], [
    ["Surface (Base)","#0E0E0E","Primary background - charcoal foundation"],
    ["Primary (Volt)","#CAFD00","Critical actions, CTAs, active states"],
    ["Primary Light","#F3FFCA","Text on dark, subtle highlights"],
    ["Secondary","#ECE856","Supporting metrics, secondary indicators"],
    ["Error","#FF7351","Error states, destructive actions"],
    ["On Surface","#FFFFFF","Primary text on dark backgrounds"],
    ["On Surface Variant","#ADAAAA","Secondary text, metadata"],
  ]));
  children.push(new Paragraph(""));
  children.push(heading("2.2 Typography", HeadingLevel.HEADING_2));
  children.push(styledTable(["Role","Font","Usage"], [
    ["Display / Headline","Space Grotesk","Screen titles, performance stats, drill names"],
    ["Title","Inter Semi-Bold","Card headers, section titles"],
    ["Body","Inter Regular","Descriptions, instructions, content"],
    ["Label","Inter All-Caps","Metadata (REPS, SETS, BPM), timestamps"],
  ]));
  children.push(new Paragraph(""));
  children.push(heading("2.3 Layout Principles", HeadingLevel.HEADING_2));
  children.push(bullet("Tonal Layering: Depth through background color shifts, not drop shadows"));
  children.push(bullet("No-Line Rule: Sections separated by tonal shifts, not 1px borders"));
  children.push(bullet("Glassmorphism: Floating elements use backdrop-blur with semi-transparent backgrounds"));
  children.push(bullet("Spacing: Consistent 8px grid with generous whitespace"));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // 3. SCREEN CATALOG
  children.push(heading("3. High-Fidelity Screen Catalog"));
  children.push(para("The following 14 screens represent the complete PlaySmart interface with realistic content and consistent styling."));

  const screens = [
    ["welcome_and_login","Welcome & Login Screens","Welcome screen with tagline and Get Started CTA. Login with email/password, social login, and registration."],
    ["player_dashboard","Player Dashboard","Central hub with quick actions, upcoming session card, weekly progress bar, and streak counter."],
    ["training_categories","Training Categories","Organized drill categories (Shooting, Speed, Tactics) with visual cards showing drill count and difficulty."],
    ["speed_detail_and_training","Speed Training & In-Progress","Detailed drill view with exercises and rep counts. In-progress timer with current exercise and progress indicator."],
    ["training_completed_and_drill","Training Completed & Drill Library","Post-session summary with RPE rating. Filterable grid of all drills with category chips."],
    ["player_progress","Player Progress Tracking","Weekly/monthly dashboard with progress ring (75%), bar charts, session stats, and streak tracker."],
    ["coach_dashboard_and_calendar","Coach Dashboard & Calendar","Coach home with Create Session, Player Roster, Drill Library, Session History. Weekly calendar with color-coded sessions."],
    ["match_preparation","Match Preparation","Pre-match checklist with toggles, team readiness with fatigue indicators (green/yellow/red), and readiness scores."],
    ["profile_settings","Profile & Settings / UI States","User profile, notification toggles, theme preferences. Confirmation dialogs, success/error toasts, progress indicators."],
  ];

  for (const [key, title, desc] of screens) {
    children.push(heading(title, HeadingLevel.HEADING_3));
    const imgPath = findImg(SHOTS, key);
    if (imgPath) {
      children.push(new Paragraph({ children: [img(imgPath, 520)], alignment: AlignmentType.CENTER }));
      children.push(new Paragraph({ children: [new TextRun({ text: title, italics: true, size: 18, color: "666666" })], alignment: AlignmentType.CENTER }));
    }
    children.push(para(desc));
    children.push(new Paragraph(""));
  }

  children.push(heading("Project Overview", HeadingLevel.HEADING_3));
  for (const key of ["playsmart_hifi_overview_top","playsmart_hifi_overview_bottom"]) {
    const p = findImg(SHOTS, key);
    if (p) children.push(new Paragraph({ children: [img(p, 580)], alignment: AlignmentType.CENTER }));
  }
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // 4. NAVIGATION
  children.push(heading("4. Navigation Flow & Interaction Design"));
  children.push(heading("4.1 Bottom Navigation Bar", HeadingLevel.HEADING_2));
  children.push(styledTable(["Tab","Destination","Description"], [
    ["Home","Player/Coach Dashboard","Central hub with quick actions"],
    ["Drills","Drill Library","Browse and filter drills"],
    ["Plan","Training Calendar","Weekly schedule management"],
    ["Progress","Player Progress","Performance tracking"],
    ["Profile","Settings & Profile","Account management"],
  ]));
  children.push(new Paragraph(""));
  children.push(heading("4.2 Key Navigation Paths", HeadingLevel.HEADING_2));
  children.push(bullet("Player Training: Home > Categories > Drill Detail > Start > In-Progress > Completed"));
  children.push(bullet("Coach Session: Dashboard > Create Session > Date > Focus > Drills > Review > Created"));
  children.push(bullet("Drill Discovery: Home > Library > Filter > Search > Drill Card > Detail"));
  children.push(bullet("Progress Review: Home > Progress > Weekly/Monthly > Charts > History"));
  children.push(bullet("Match Prep: Home > Match Prep > Checklist > Team Readiness > Start"));
  children.push(new Paragraph(""));
  children.push(heading("4.3 System Feedback Components", HeadingLevel.HEADING_2));
  children.push(styledTable(["Component","Type","Example"], [
    ["Confirmation Dialog","Modal Overlay","Delete Training Session?"],
    ["Success Toast","Banner","Session saved successfully!"],
    ["Error Message","Banner","Failed to sync data"],
    ["Progress Indicator","Circular + Bar","Syncing data... 65%"],
  ]));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // 5. UI COMPONENTS
  children.push(heading("5. UI Components Showcase"));
  children.push(styledTable(["Component","Style","Usage"], [
    ["Primary Button","#CAFD00 fill, dark text","Start Training, Save, Get Started"],
    ["Secondary Button","#262626 fill, light text","View Details, Back to Home"],
    ["Ghost Button","Transparent, white text","Cancel, Dismiss"],
    ["Destructive Button","#FF7351 fill, white text","Delete, Remove"],
    ["Cards","#20201F bg, no borders","Drill cards, session cards, stat cards"],
    ["Input Fields","#262626 bg, primary focus border","Login, search, RPE input"],
    ["Chips","Full roundness, #636100 bg","Category filters (All, Fitness, Skills)"],
    ["Progress Ring","Primary color, circular","Weekly goal completion (75%)"],
    ["Toggle Switch","Primary when ON","Notification preferences, theme"],
  ]));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // 6. DESIGN PRINCIPLES
  children.push(heading("6. Design Principles Applied"));
  children.push(heading("6.1 Shneiderman's Eight Golden Rules", HeadingLevel.HEADING_2));
  const shneiderman = [
    ["Consistency","Consistent nav, card styles, buttons, typography across all 14 screens"],
    ["Universal Usability","Player/coach roles, high contrast WCAG AA, outdoor readability"],
    ["Informative Feedback","Toasts for save/delete, progress indicators, timer updates"],
    ["Closure","Training Completed summary, confirmation dialogs, session review step"],
    ["Error Prevention","Form validation, disabled buttons, confirmation dialogs, RPE labels"],
    ["Reversal","Back navigation, undo capability, cancel buttons, swipe-back"],
    ["User Control","Manual RPE, customizable notifications, mode switching, direct nav"],
    ["Reduce Memory Load","Dashboard quick actions, upfront drill info, visual progress ring"],
  ];
  for (const [t,d] of shneiderman) children.push(boldPara(`${t}: `, d));

  children.push(heading("6.2 Norman's Design Principles", HeadingLevel.HEADING_2));
  for (const [t,d] of [
    ["Visibility","Interactive elements clearly visible, bottom nav always present, volt green CTAs"],
    ["Feedback","Button states, toast notifications, progress animations, completion checkmarks"],
    ["Constraints","Calendar date limits, RPE 1-10, category filters constrain results"],
    ["Mapping","House=home, calendar=plan, green/yellow/red=risk levels"],
    ["Consistency","Uniform components, same patterns for similar actions"],
    ["Affordance","Buttons look pressable, toggles show on/off, cards appear tappable"],
  ]) children.push(boldPara(`${t}: `, d));

  children.push(heading("6.3 Theo Mandel's Guidelines", HeadingLevel.HEADING_2));
  for (const [t,d] of [
    ["Place Users in Control","Choose own training path, skip onboarding, switch modes, free navigation"],
    ["Reduce Memory Load","Dashboard cards eliminate memorization, drill cards show all info, calendar reference"],
    ["Interface Consistency","Single design system, consistent spacing/typography/color, predictable patterns"],
  ]) children.push(boldPara(`${t}: `, d));

  children.push(heading("6.4 Five Principles of Screen Design", HeadingLevel.HEADING_2));
  children.push(styledTable(["Principle","Application"], [
    ["Grouping","Related elements in cards, quick actions in 2x2 grid, settings by category"],
    ["Ordering","Logical task flow, most-used actions first, chronological calendar"],
    ["Alignment","Left-aligned text, centered progress rings/CTAs, grid-based layout"],
    ["Whitespace","2rem+ padding, tonal layering creates breathing room, no crowding"],
    ["Decoration","Minimal decoration, volt green used purposefully, content-first approach"],
  ]));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // 7. CONCLUSION
  children.push(heading("7. Conclusion"));
  children.push(para("Phase 4 demonstrates clear progression from low-fidelity wireframes to production-ready high-fidelity designs. The PlaySmart interface comprises 14 complete screens covering all user flows."));
  children.push(bullet("14 high-fidelity screens with consistent Kinetic Precision design system"));
  children.push(bullet("Complete navigation coverage with all paths documented"));
  children.push(bullet("Role-based interfaces for players and coaches"));
  children.push(bullet("Comprehensive UI component library (buttons, cards, inputs, chips, dialogs, toasts)"));
  children.push(bullet("Systematic application of Shneiderman's, Norman's, and Mandel's principles"));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // APPENDIX
  children.push(heading("Appendix: Design Links"));
  children.push(styledTable(["Design","Platform","Link"], [
    ["Hi-Fi Designs (Phase 4)","Google Stitch","https://stitch.withgoogle.com/projects/12363635124012461076"],
    ["Lo-Fi Wireframes (Phase 3)","Google Stitch","https://stitch.withgoogle.com/projects/14852019868932687382"],
    ["Alternative Design 1","Figma","https://www.figma.com/make/f8gpGhvqfnCadzPZSdnxCw/alterntive-1"],
  ]));

  const doc = new Document({ sections: [{ children }] });
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(__dirname, "PlaySmart-Phase4-Report.docx"), buf);
  console.log("Phase 4 Report generated: PlaySmart-Phase4-Report.docx (" + Math.round(buf.length/1024) + " KB)");
}

buildReport().catch(console.error);
