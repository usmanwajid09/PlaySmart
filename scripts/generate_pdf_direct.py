"""PlaySmart Phase 4 — Direct PDF Generator (no Word needed)
Creates a professional PDF matching CodeMap Phase 4 format with screenshots.
"""
import os
from fpdf import FPDF
from PIL import Image

BASE = os.path.dirname(os.path.abspath(__file__))
SHOTS = os.path.join(BASE, "hifi-screenshots", "individual")
OUT = os.path.join(BASE, "PlaySmart-Phase4-Report.pdf")

class PlaySmartPDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("Helvetica", "I", 8)
            self.set_text_color(150, 150, 150)
            self.cell(0, 5, "PlaySmart - Phase 4: High-Fidelity Design and Evaluation", align="L")
            self.cell(0, 5, f"{self.page_no()}", align="R")
            self.ln(8)

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 5, f"{self.page_no()}", align="C")

    def section_heading(self, num, title):
        self.set_font("Helvetica", "B", 18)
        self.set_text_color(30, 92, 151)
        self.cell(0, 12, f"{num} {title}", new_x="LMARGIN", new_y="NEXT")
        self.ln(3)

    def sub_heading(self, title):
        self.set_font("Helvetica", "B", 14)
        self.set_text_color(40, 40, 40)
        self.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
        self.ln(2)

    def status_badge(self, status="Met"):
        self.set_font("Helvetica", "B", 11)
        if status == "Met":
            self.set_text_color(0, 128, 0)
        elif status == "Partially Met":
            self.set_text_color(255, 140, 0)
        else:
            self.set_text_color(255, 0, 0)
        self.cell(0, 8, f"Status: {status}", new_x="LMARGIN", new_y="NEXT")
        self.set_text_color(0, 0, 0)
        self.ln(2)

    def body_text(self, text):
        self.set_font("Helvetica", "", 11)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 6, text)
        self.ln(3)

    def bold_text(self, label, text):
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(30, 30, 30)
        self.write(6, f"{label}: ")
        self.set_font("Helvetica", "", 11)
        self.write(6, text)
        self.ln(8)

    def bullet(self, text):
        self.set_font("Helvetica", "", 11)
        self.set_text_color(30, 30, 30)
        self.cell(6, 6, "-")
        self.multi_cell(0, 6, text)
        self.ln(1)

    def add_screenshot(self, name, caption=None, w=100):
        path = os.path.join(SHOTS, f"{name}.png")
        if not os.path.exists(path):
            self.set_font("Helvetica", "I", 10)
            self.cell(0, 8, f"[Image: {name}.png not found]", align="C", new_x="LMARGIN", new_y="NEXT")
            return

        # Get image dimensions to calculate proper aspect ratio
        with Image.open(path) as img:
            iw, ih = img.size
        aspect = ih / iw
        display_w = w
        display_h = display_w * aspect

        # Cap height to prevent overflow
        max_h = 180
        if display_h > max_h:
            display_h = max_h
            display_w = display_h / aspect

        # Check if we need a page break
        if self.get_y() + display_h + 15 > 270:
            self.add_page()

        x = (210 - display_w) / 2  # center
        self.image(path, x=x, w=display_w)
        if caption:
            self.set_font("Helvetica", "I", 9)
            self.set_text_color(100, 100, 100)
            self.cell(0, 6, caption, align="C", new_x="LMARGIN", new_y="NEXT")
            self.set_text_color(0, 0, 0)
        self.ln(4)


def build():
    pdf = PlaySmartPDF()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()

    # ═══════════════════════════════════════════════════════════════════
    # TITLE PAGE
    # ═══════════════════════════════════════════════════════════════════
    pdf.ln(60)
    pdf.set_font("Helvetica", "B", 40)
    pdf.set_text_color(30, 92, 151)
    pdf.cell(0, 15, "PlaySmart", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)
    pdf.set_font("Helvetica", "", 18)
    pdf.set_text_color(68, 68, 68)
    pdf.cell(0, 10, "Phase 4: High-Fidelity Design and Evaluation", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(15)
    pdf.set_font("Helvetica", "", 12)
    pdf.set_text_color(85, 85, 85)
    for line in [
        "Human Computer Interaction",
        "",
        "Team Members: Usman Wajid, Ahmad Masood, Abdulrehman Naseer",
        "Instructor: Arslan Asif",
        "Date: April 2026",
    ]:
        pdf.cell(0, 8, line, align="C", new_x="LMARGIN", new_y="NEXT")

    # ═══════════════════════════════════════════════════════════════════
    # 1. INTRODUCTION
    # ═══════════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_heading("1.", "Introduction")
    pdf.body_text(
        "PlaySmart is a football training management platform designed to help individual players "
        "and coaches organize, track, and optimize their training sessions. It enables users to "
        "browse drill libraries, plan structured training sessions, track performance progress, "
        "and prepare for matches - all through a cohesive mobile interface."
    )
    pdf.body_text(
        "This document presents the Phase 4 deliverables for the Human Computer Interaction course. "
        "It focuses on a high-fidelity design assessment of the PlaySmart prototype, evaluating "
        "both its visual design and interaction quality. In addition, a formal heuristic evaluation "
        "has been conducted using Nielsen's 10 Usability Heuristics to systematically identify "
        "usability strengths and areas for improvement. Together, these analyses aim to provide a "
        "comprehensive understanding of the platform's user experience and design effectiveness."
    )
    pdf.ln(5)

    # ═══════════════════════════════════════════════════════════════════
    # 2. HIGH-FIDELITY DESIGN
    # ═══════════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_heading("2.", "High-Fidelity Design")
    pdf.body_text(
        "This section evaluates the PlaySmart prototype against each requirement listed in the "
        "Phase 4 assignment brief. Each criterion is assessed as Met, Partially Met, or Not Met, "
        "with observations grounded in the actual screens produced. Stitch link: "
        "https://stitch.withgoogle.com/projects/12363635124012461076"
    )

    # ─── 2.1 Typography ─────────────────────────────────────────────
    pdf.ln(3)
    pdf.sub_heading("2.1 Typography")
    pdf.status_badge("Met")
    pdf.body_text(
        "The design consistently uses a modern, clean typeface combination across all 14 screens, "
        "creating a cohesive and professional visual identity. Space Grotesk is used for display "
        "headings and large performance statistics, giving the interface a bold, athletic feel. "
        "Inter is used for all body text, labels, and secondary content, ensuring excellent "
        "readability at smaller sizes."
    )
    pdf.body_text(
        "A clear typographic hierarchy is maintained throughout: large H1 headings for screen "
        "titles (e.g., 'Player Dashboard', 'Speed Training'), well-defined H2 section "
        "headers for organizing content within screens, and smaller body text for descriptions, "
        "drill instructions, and metadata. All-caps labels are used consistently for metadata "
        "tags (REPS, SETS, BPM, DURATION), creating a clear visual distinction between content "
        "types."
    )
    pdf.body_text(
        "An especially strong design decision is the use of contrasting font weights - bold "
        "headings against regular body text - which guides the eye through the information "
        "hierarchy naturally. The volt-green (#CAFD00) accent color on key text elements "
        "(like CTA labels) further reinforces the visual hierarchy without relying solely on "
        "font size."
    )
    pdf.add_screenshot("welcome", "Figure 1: Welcome Screen - Typography hierarchy with Space Grotesk headings", 85)
    pdf.add_screenshot("speed_detail", "Figure 2: Speed Training Detail - All-caps labels for REPS/SETS metadata", 85)

    # ─── 2.2 Color ─────────────────────────────────────────────────
    pdf.add_page()
    pdf.sub_heading("2.2 Color")
    pdf.status_badge("Met")
    pdf.body_text(
        "A coherent and purposeful color palette is applied consistently across all screens, "
        "contributing to a clear and visually stable interface. The design uses a dark mode "
        "foundation (#0E0E0E charcoal background) paired with high-contrast light text (#FFFFFF), "
        "ensuring strong readability and reducing visual strain during extended use - particularly "
        "important for athletes checking their phones in bright outdoor conditions."
    )
    pdf.body_text(
        "A distinct volt-green (#CAFD00) is used as the primary interactive color and is "
        "consistently applied to key call-to-action elements such as 'Get Started,' "
        "'Start Training,' and 'Enter Training Facility,' as well as active navigation "
        "states and progress indicators. This consistency helps users quickly identify interactive "
        "components and reinforces predictable behavior across the interface."
    )
    pdf.body_text(
        "Semantic color usage is handled effectively to communicate system states. Green indicators "
        "are used for completion status and successful actions. Orange/amber communicates "
        "in-progress or warning states (e.g., medium fatigue levels in Match Preparation). "
        "Red (#FF7351) is reserved for error states, destructive actions, and high-fatigue alerts. "
        "This disciplined use of color strengthens feedback clarity and aligns well with "
        "established usability conventions."
    )
    pdf.add_screenshot("player_dashboard", "Figure 3: Player Dashboard - Volt-green CTAs on dark background", 85)
    pdf.add_screenshot("ui_states", "Figure 4: UI States - Semantic color: green (success), red (error), orange (warning)", 85)

    # ─── 2.3 Grouping ───────────────────────────────────────────────
    pdf.add_page()
    pdf.sub_heading("2.3 Grouping")
    pdf.status_badge("Met")
    pdf.body_text("All five principles of screen design and layout are actively applied across the prototype:")
    for title, desc in [
        ("Grouping", "Related elements are grouped into distinct cards and sections. The Player Dashboard organizes quick-action cards in a 2x2 grid. Settings groups options into categories (Notifications, Preferences, Account)."),
        ("Ordering", "Forms follow natural top-to-bottom reading order. Training Detail positions drill name above description above exercise list above action button."),
        ("Alignment", "Left-alignment for content-heavy screens (Dashboard, Drill Library). Center-alignment for Welcome screen hero text and Training Completed summary."),
        ("Whitespace", "Generous padding within all cards. Dark tonal layering (#0E0E0E to #1A1A1A to #262626) creates visual breathing room without explicit dividers."),
        ("Decoration", "Minimal and purposeful. Volt-green accent only for interactive elements. No gratuitous gradients or drop shadows. Status colors serve functional, not decorative, purposes."),
    ]:
        pdf.bold_text(title, desc)
    pdf.add_screenshot("training_categories", "Figure 5: Training Categories - Grouped category cards with consistent spacing", 85)
    pdf.add_screenshot("profile_settings", "Figure 6: Settings - Grouped sections for Notifications, Preferences, Account", 85)

    # ─── 2.4 Navigation Paths ───────────────────────────────────────
    pdf.add_page()
    pdf.sub_heading("2.4 Navigation Paths")
    pdf.status_badge("Met")
    pdf.body_text("All navigational paths within the system are covered by the prototype. The complete user journey from first visit through to active usage is represented:")
    for nav in [
        "Welcome Screen -> Login / Sign Up",
        "Login -> [correct credentials] -> Player Home Dashboard",
        "Dashboard -> Training Categories -> Speed/Shooting/Tactics -> Drill Detail -> Start Training -> Training In Progress -> Training Completed",
        "Dashboard -> Drill Library -> Filter/Search -> Drill Card",
        "Dashboard -> My Progress (via bottom nav) -> Weekly/Monthly stats",
        "Dashboard -> Match Preparation -> Checklist + Team Readiness",
        "Coach Dashboard -> Create Session -> Training Calendar",
        "Profile & Settings -> [save changes] -> Success Toast -> Dashboard",
    ]:
        pdf.bullet(nav)
    pdf.body_text("All inner screens include a persistent bottom navigation bar with 5 tabs (Home, Drills, Plan, Progress, Profile), ensuring no dead ends exist within the prototype flow.")
    pdf.add_screenshot("drill_library", "Figure 7: Drill Library - Bottom navigation bar visible on all screens", 85)
    pdf.add_screenshot("coach_dashboard", "Figure 8: Coach Dashboard - Role-specific navigation with all paths accessible", 85)

    # ─── 2.5 UI Elements ────────────────────────────────────────────
    pdf.add_page()
    pdf.sub_heading("2.5 UI Elements")
    pdf.status_badge("Met")
    pdf.body_text("All required UI elements are present and integrated into the prototype:")
    pdf.bold_text("Dialog Boxes", "The 'Delete Training Session?' confirmation dialog is a fully designed modal overlay with a title, warning text, and two action buttons ('Cancel' and 'Delete'). The dialog uses the error color (#FF7351) for the destructive action.")
    pdf.bold_text("Progress Indicators", "The Training In Progress screen displays a real-time circular timer. The Player Progress screen shows a 75% circular progress ring and daily activity bar chart. The Profile screen includes a 'Syncing training data... 65%' linear progress bar.")
    pdf.bold_text("Message/Toast Notifications", "Three distinct toast notifications: (1) green success toast for 'Session saved successfully!', (2) red error toast for 'Failed to sync data', and (3) informational feedback for completed actions.")
    pdf.add_screenshot("training_inprogress", "Figure 9: Training In Progress - Circular timer and exercise progress", 85)
    pdf.add_screenshot("ui_states", "Figure 10: UI States - Dialog box, success/error toasts, and progress bar", 85)

    # ─── 2.6 Realistic Content ──────────────────────────────────────
    pdf.add_page()
    pdf.sub_heading("2.6 Realistic Content")
    pdf.status_badge("Met")
    pdf.body_text("Placeholder text such as 'Lorem Ipsum' is entirely absent from the prototype. All content is realistic, meaningful, and domain-appropriate for a football training platform:")
    for item in [
        "Player names: Ahmad Masood, Coach Arslan",
        "Training categories: Shooting, Speed, Tactics",
        "Drill names: Sprint Intervals, Ball Control Mastery, Passing Triangle, Agility Ladder",
        "Exercise details: 10x Jump-Jacks, 10x Sprint, 5x High-Knees",
        "Progress stats: 12 Sessions, 8.5 Hours, 47 Drills, 75% weekly goal",
        "Match prep items: Fitness Check, Tactical Drills, Warm-up Plan, Mental Readiness",
        "Fatigue indicators: Low (green), Medium (orange), High (red)",
        "Calendar events: Speed Training (Mon 9AM), Team Tactics (Wed 3PM)",
    ]:
        pdf.bullet(item)
    pdf.add_screenshot("match_preparation", "Figure 11: Match Preparation - Realistic checklist and team readiness data", 85)
    pdf.add_screenshot("progress_tracking", "Figure 12: Progress Tracking - Realistic stats (12 sessions, 8.5h, 47 drills)", 85)
    pdf.add_screenshot("calendar", "Figure 13: Training Calendar - Realistic weekly schedule", 85)

    # ═══════════════════════════════════════════════════════════════════
    # 3. COMPLETE SCREEN CATALOG
    # ═══════════════════════════════════════════════════════════════════
    pdf.add_page()
    pdf.section_heading("3.", "Complete Screen Catalog")
    pdf.body_text("Below is the complete set of 14 high-fidelity screens designed for PlaySmart:")
    pdf.ln(3)

    all_screens = [
        ("welcome", "1. Welcome / Splash Screen"),
        ("login", "2. Login / Sign Up"),
        ("player_dashboard", "3. Player Home Dashboard"),
        ("training_categories", "4. Training Categories"),
        ("speed_detail", "5. Speed Training Detail"),
        ("training_inprogress", "6. Training In Progress"),
        ("training_completed", "7. Training Completed"),
        ("drill_library", "8. Drill Library"),
        ("progress_tracking", "9. Player Progress Tracking"),
        ("coach_dashboard", "10. Coach Dashboard"),
        ("match_preparation", "11. Match Preparation"),
        ("calendar", "12. Training Plan Calendar"),
        ("profile_settings", "13. Profile & Settings"),
        ("ui_states", "14. UI Interaction States"),
    ]
    for fname, title in all_screens:
        pdf.add_screenshot(fname, title, 80)
        pdf.ln(2)

    # Save
    pdf.output(OUT)
    sz = os.path.getsize(OUT) / 1024
    print(f"\nPhase 4 PDF Report generated: {OUT} ({sz:.0f} KB)")

if __name__ == "__main__":
    build()
