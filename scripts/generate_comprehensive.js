const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ImageRun, ExternalHyperlink, PageBreak, ShadingType } = require("docx");
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

function img(filePath, w = 450) {
  if (!filePath || !fs.existsSync(filePath)) return new TextRun({ text: "[Image not available]", italics: true, color: "999999" });
  return new ImageRun({ data: fs.readFileSync(filePath), transformation: { width: w, height: Math.round(w * 1.5) }, type: "png" });
}

function imgLandscape(filePath, w = 550) {
  if (!filePath || !fs.existsSync(filePath)) return new TextRun({ text: "[Image not available]", italics: true, color: "999999" });
  return new ImageRun({ data: fs.readFileSync(filePath), transformation: { width: w, height: Math.round(w * 0.6) }, type: "png" });
}

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ text, heading: level, spacing: { before: 300, after: 150 } });
}

function para(text, opts = {}) {
  return new Paragraph({ children: [new TextRun({ text, ...opts })], spacing: { after: 150 } });
}

function boldPara(label, text) {
  return new Paragraph({ children: [new TextRun({ text: label, bold: true }), new TextRun({ text })], spacing: { after: 150 } });
}

function bullet(text) {
  return new Paragraph({ text, bullet: { level: 0 }, spacing: { after: 80 } });
}

const headerShading = { type: ShadingType.SOLID, color: "2E75B6" };
const altShading = { type: ShadingType.SOLID, color: "F2F2F2" };
const noBorder = { style: BorderStyle.NONE, size: 0 };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

function headerCell(text) {
  return new TableCell({ children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 24 })], alignment: AlignmentType.CENTER })], shading: headerShading, borders });
}
function dataCell(text, shaded = false) {
  return new TableCell({ children: [new Paragraph({ children: [new TextRun({ text, size: 22 })], spacing: { after: 40 } })], shading: shaded ? altShading : undefined, borders });
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
  children.push(new Paragraph({ children: [new TextRun({ text: "Comprehensive Phase 3 & 4 Implementation Report", size: 36, color: "444444" })], alignment: AlignmentType.CENTER }));
  children.push(new Paragraph(""));
  children.push(new Paragraph({ children: [new TextRun({ text: "HCI Design, Prototyping, and Heuristic Evaluation", italics: true, size: 24, color: "666666" })], alignment: AlignmentType.CENTER }));
  children.push(new Paragraph(""));
  for (const line of ["Team Members: Usman Wajid, Ahmad Masood, Abdulrehman Naseer", "Instructor: Arslan Asif", "Date: April 2025"])
    children.push(new Paragraph({ children: [new TextRun({ text: line, size: 22, color: "555555" })], alignment: AlignmentType.CENTER }));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // TOC
  children.push(heading("Table of Contents"));
  const tocItems = [
    "1. Introduction",
    "2. Phase 3: Conceptual Design & Interface Metaphors",
    "3. Phase 3: Scenarios & Storyboards",
    "4. Phase 3: Concrete Design & Wireframing",
    "5. Phase 4: High-Fidelity Implementation & UI Components",
    "6. Nielsen Norman Group: 10 Usability Heuristics Evaluation",
    "7. Conclusion"
  ];
  for (const item of tocItems) children.push(para(item));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // 1. INTRODUCTION
  children.push(heading("1. Introduction"));
  children.push(para("This comprehensive report outlines the end-to-end design and implementation process for the PlaySmart application, aligning with the Human-Computer Interaction principles outlined in Chapter 12 (Design, Prototyping, and Construction) and Jakob Nielsen's 10 Usability Heuristics."));
  children.push(para("The document demonstrates how we translated initial user requirements into a conceptual design (Interface Metaphors, Scenarios, Storyboards), progressed to low-fidelity concrete designs (Wireframes), and finally constructed an interactive, high-fidelity prototype adhering to strict usability standards."));
  
  // 2. CONCEPTUAL DESIGN & METAPHORS
  children.push(heading("2. Phase 3: Conceptual Design & Interface Metaphors"));
  children.push(para("A conceptual model outlines what people can do with a product and what concepts are needed to understand how to interact with it. We utilized familiar interface metaphors to combine users' existing knowledge with our new system."));
  children.push(bullet("The \"Dashboard\" Metaphor: Acts as the central hub, similar to a car's dashboard or a physical command center, providing a quick overview of all crucial metrics and quick actions."));
  children.push(bullet("The \"Roster\" Metaphor: Used for the coach's interface, matching the real-world physical clipboard coaches use to manage their players."));
  children.push(bullet("The \"Library\" Metaphor: The Drill Library categorizes exercises logically, matching how users browse books or media."));

  // 3. SCENARIOS & STORYBOARDS
  children.push(heading("3. Phase 3: Scenarios & Storyboards"));
  children.push(para("To evaluate the conceptual design, we developed storyboards (a cartoon-like series of scenes) illustrating a scenario where 'Coach Hamza' plans a training session. This method helped visualize context, environment, and system response before any code was written."));
  
  for (let i = 1; i <= 6; i++) {
    const f = findImg(STORY, `frame${i}`);
    if (f) {
      children.push(heading(`Storyboard Panel ${i}`, HeadingLevel.HEADING_3));
      children.push(new Paragraph({ children: [imgLandscape(f, 500)], alignment: AlignmentType.CENTER }));
    }
  }
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // 4. CONCRETE DESIGN & WIREFRAMES
  children.push(heading("4. Phase 3: Concrete Design & Wireframing"));
  children.push(para("We transitioned from conceptual to concrete design by creating low-fidelity wireframes. These wireframes focused on layout, screen structure, and navigation hierarchy rather than aesthetics."));
  children.push(para("We strictly followed the 'Rules of Wireframing' outlined in the course:"));
  children.push(bullet("No Color: We used strictly grayscale (white, black, and gray)."));
  children.push(bullet("Placeholders: We used standard placeholders ('X' boxes for images) and simplified text."));
  children.push(bullet("Standard Symbols: Common UI patterns like magnifying glasses and standard navigation icons were utilized."));

  const wireframes = [
    ["splash", "Splash Screen"], ["login", "Login Screen"], ["dashboard", "Player Dashboard"],
    ["trainings", "Training Categories"], ["speed-detail", "Drill Detail"], ["progress", "Progress Tracking"]
  ];
  for (const [key, title] of wireframes) {
    const f = findImg(WIRE, key);
    if (f) {
      children.push(heading(`Wireframe: ${title}`, HeadingLevel.HEADING_3));
      children.push(new Paragraph({ children: [img(f, 300)], alignment: AlignmentType.CENTER }));
    }
  }
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // 5. HIGH-FIDELITY IMPLEMENTATION & UI COMPONENTS
  children.push(heading("5. Phase 4: High-Fidelity Implementation & UI Components"));
  children.push(para("Moving to Phase 4, we constructed the final high-fidelity prototype using Google Stitch, applying the 'Kinetic Precision' design system. We implemented all standard UI components necessary for an intuitive experience."));
  
  children.push(heading("5.1 Navigation Components", HeadingLevel.HEADING_2));
  children.push(boldPara("Bottom Navigation Bars: ", "Implemented globally across all main screens to provide immediate access to Home, Drills, Plan, Progress, and Profile."));
  children.push(boldPara("Breadcrumbs & Back Navigation: ", "To prevent users from getting lost, secondary screens (like Drill Details or Match Prep) feature persistent backward navigation (back arrows) in the top-left corner, ensuring users can easily trace their steps back to the root navigation level."));
  
  children.push(heading("5.2 Menus and Content Areas", HeadingLevel.HEADING_2));
  children.push(boldPara("Grid Menus: ", "The dashboard uses a 2x2 grid menu for quick actions, optimizing touch targets for mobile users."));
  children.push(boldPara("Scrollable Content Areas: ", "Horizontal scrolls are used for categories ('Order Again' equivalent for recent drills), while vertical scrolling is used for the Drill Library list."));
  
  children.push(heading("5.3 Input Fields and Labels", HeadingLevel.HEADING_2));
  children.push(boldPara("Form Inputs: ", "Implemented with clear contextual labels above the fields and placeholder text inside, changing to a primary-color border on focus state."));
  
  children.push(heading("High-Fidelity Examples", HeadingLevel.HEADING_3));
  const hifiShots = ["welcome_and_login", "player_dashboard", "coach_dashboard_and_calendar", "match_preparation_and_calendar"];
  for (const key of hifiShots) {
    const f = findImg(SHOTS, key);
    if (f) {
      children.push(new Paragraph({ children: [img(f, 300)], alignment: AlignmentType.CENTER }));
    }
  }
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // 6. HEURISTICS
  children.push(heading("6. Nielsen Norman Group: 10 Usability Heuristics Evaluation"));
  children.push(para("We systematically evaluated our high-fidelity implementation against Jakob Nielsen's 10 Usability Heuristics."));

  const heuristics = [
    ["1. Visibility of System Status", "The design clearly communicates its state. We implemented real-time countdown timers during training sessions, progress rings on the dashboard showing weekly completion (e.g., 75%), and active state highlighting on the bottom navigation bar."],
    ["2. Match Between System and Real World", "The app speaks the user's language using standard football terminology ('RPE', 'Tactical Drills'). Fatigue indicators use real-world 'traffic light' conventions (Green/Yellow/Red) for intuitive understanding."],
    ["3. User Control and Freedom", "We provided 'emergency exits'. Every sub-screen features a back arrow (acting as breadcrumb navigation). Destructive actions feature cancel buttons on modal dialogs."],
    ["4. Consistency and Standards", "The app follows industry conventions. The bottom tab bar, button styling, and layout structures are uniform across all 14 screens, adhering strictly to the 'Kinetic Precision' design system."],
    ["5. Error Prevention", "We prevent slips by using constraints. The RPE scale is limited to 1-10. Crucial destructive actions like deleting a session prompt a confirmation dialog before committing."],
    ["6. Recognition Rather Than Recall", "Important information is visible. The Drill Library uses recognizable visual cards, and the Dashboard immediately presents recent stats so the user doesn't have to remember them from previous visits."],
    ["7. Flexibility and Efficiency of Use", "Accelerators speed up interaction. Filter chips allow expert users to instantly sort the drill library. Dashboard quick actions act as shortcuts to frequently used features."],
    ["8. Aesthetic and Minimalist Design", "The dark UI focuses solely on essentials. All distracting, unnecessary elements have been removed. We utilize tonal layering rather than heavy borders to separate content cleanly."],
    ["9. Help Users Recognize, Diagnose, and Recover from Errors", "Error messages are expressed in plain language. If a sync fails, a red toast banner explicitly states the connection issue and offers a 'Retry' action to recover."],
    ["10. Help and Documentation", "Context is provided where needed. Input fields feature clear placeholder text, and complex metrics feature brief subtext labels. We plan to integrate contextual tooltips in the final build."]
  ];

  for (const [title, desc] of heuristics) {
    children.push(heading(title, HeadingLevel.HEADING_2));
    children.push(para(desc));
  }
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // 7. CONCLUSION
  children.push(heading("7. Conclusion"));
  children.push(para("This report demonstrates the successful implementation of the PlaySmart application, bridging the gap between theoretical interaction design concepts and practical, high-fidelity construction."));
  children.push(para("By adhering to the principles of Conceptual and Concrete Design (Phase 3) and strictly evaluating our interfaces against Nielsen's 10 Heuristics (Phase 4), we have engineered an interface that is not only aesthetically premium but deeply intuitive, user-controlled, and highly functional."));

  const doc = new Document({ sections: [{ children }] });
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(__dirname, "PlaySmart-Comprehensive-Documentation.docx"), buf);
  console.log("Comprehensive Report generated: PlaySmart-Comprehensive-Documentation.docx");
}

buildReport().catch(console.error);
