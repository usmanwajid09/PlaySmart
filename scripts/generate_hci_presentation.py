"""PlaySmart HCI Principles Presentation Generator"""
import os
from fpdf import FPDF
from PIL import Image

BASE = os.path.dirname(os.path.abspath(__file__))
SHOTS = os.path.join(BASE, "hifi-screenshots", "individual")
OUT = os.path.join(BASE, "PlaySmart-HCI-Presentation.pdf")

# Color Palette (Kinetic Precision)
BG_COLOR = (14, 14, 14)  # #0E0E0E
PRIMARY_COLOR = (202, 253, 0)  # #CAFD00 (Volt)
TEXT_COLOR = (255, 255, 255)
SUBTEXT_COLOR = (173, 170, 170)

class HCIPresentation(FPDF):
    def __init__(self):
        super().__init__(orientation='L', unit='mm', format='A4')
        self.set_auto_page_break(auto=False)
        self.set_margins(15, 15, 15)

    def slide_header(self, title):
        self.set_fill_color(*BG_COLOR)
        self.rect(0, 0, 297, 210, 'F')
        
        # Title
        self.set_font("Helvetica", "B", 24)
        self.set_text_color(*PRIMARY_COLOR)
        self.set_y(15)
        self.cell(0, 15, title, align="L", new_x="LMARGIN", new_y="NEXT")
        
        # Divider
        self.set_draw_color(*PRIMARY_COLOR)
        self.set_line_width(0.5)
        self.line(15, 32, 282, 32)
        self.ln(10)

    def add_slide(self, title, description, screenshot_name=None, mapping_points=None):
        self.add_page()
        self.slide_header(title)
        
        # Layout: Left side Text (120mm), Right side Image (Rest)
        content_y = 45
        
        # Description
        self.set_y(content_y)
        self.set_font("Helvetica", "", 14)
        self.set_text_color(*TEXT_COLOR)
        self.multi_cell(110, 8, description)
        
        if mapping_points:
            self.ln(5)
            self.set_font("Helvetica", "B", 12)
            self.set_text_color(*PRIMARY_COLOR)
            self.cell(0, 8, "Key Implementations:", new_x="LMARGIN", new_y="NEXT")
            self.set_font("Helvetica", "", 12)
            self.set_text_color(*TEXT_COLOR)
            for point in mapping_points:
                self.cell(5, 7, "-", align="C")
                self.multi_cell(105, 7, point)
                self.ln(1)

        # Image
        if screenshot_name:
            path = os.path.join(SHOTS, f"{screenshot_name}.png")
            if os.path.exists(path):
                with Image.open(path) as img:
                    iw, ih = img.size
                aspect = ih / iw
                
                # Calculate max width/height for the right side
                max_w = 140
                max_h = 140
                
                display_w = max_w
                display_h = display_w * aspect
                
                if display_h > max_h:
                    display_h = max_h
                    display_w = display_h / aspect
                
                img_x = 140 + (140 - display_w) / 2
                img_y = 45 + (140 - display_h) / 2
                
                # Add a border to the phone screen
                self.set_draw_color(50, 50, 50)
                self.set_line_width(1)
                self.rect(img_x-1, img_y-1, display_w+2, display_h+2)
                
                self.image(path, x=img_x, y=img_y, w=display_w)

    def title_slide(self):
        self.add_page()
        self.set_fill_color(*BG_COLOR)
        self.rect(0, 0, 297, 210, 'F')
        
        # Center content
        self.set_y(80)
        self.set_font("Helvetica", "B", 48)
        self.set_text_color(*PRIMARY_COLOR)
        self.cell(0, 20, "PlaySmart", align="C", new_x="LMARGIN", new_y="NEXT")
        
        self.set_font("Helvetica", "", 24)
        self.set_text_color(*TEXT_COLOR)
        self.cell(0, 15, "Journey From Ground to Sky", align="C", new_x="LMARGIN", new_y="NEXT")
        
        self.ln(20)
        self.set_font("Helvetica", "", 14)
        self.set_text_color(*SUBTEXT_COLOR)
        self.cell(0, 10, "Human-Computer Interaction (HCI) Presentation", align="C", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 10, "Usman Wajid", align="C", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 10, "Abdulrehman Naseer", align="C", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 10, "Ahmad Masood", align="C", new_x="LMARGIN", new_y="NEXT")

def build():
    pres = HCIPresentation()
    
    # 1. Title Slide
    pres.title_slide()
    
    # 2. Project Overview
    pres.add_slide(
        "Project Overview: PlaySmart",
        "PlaySmart is an elite football training platform designed to bridge the gap between players and professional coaching methods.",
        "welcome",
        [
            "Target Audience: High-performance athletes and professional coaches.",
            "Core Goal: Optimize training efficiency through data-driven tracking.",
            "Visual Identity: 'The Kinetic Engine' - dark mode with high-visibility accents."
        ]
    )
    
    # 3. Visibility of System Status (Heuristic #1)
    pres.add_slide(
        "1. Visibility of System Status",
        "The system always keeps users informed about what is going on, through appropriate feedback within a reasonable time.",
        "training_inprogress",
        [
            "Real-time countdown timers during active drills.",
            "Progress bars showing completion percentage of the current set.",
            "Dynamic status labels ('Current: Sprint Intervals') so the user knows their exact phase."
        ]
    )
    
    # 4. Match Between System & Real World (Heuristic #2)
    pres.add_slide(
        "2. Match System & Real World",
        "The design speaks the users' language, using words, phrases, and concepts familiar to the user, rather than system-oriented terms.",
        "training_categories",
        [
            "Professional football terminology: Shooting, Speed, Tactics, Agility.",
            "Iconography that matches athletic equipment and actions.",
            "Metric units used by athletes: BPM, Reps, Sets, and RPE (Rate of Perceived Exertion)."
        ]
    )
    
    # 5. User Control & Freedom (Heuristic #3)
    pres.add_slide(
        "3. User Control & Freedom",
        "Users often perform actions by mistake and need a clearly marked 'emergency exit' to leave the unwanted action without a long process.",
        "ui_states",
        [
            "Confirmation dialogs before destructive actions (e.g., deleting a session).",
            "Clear 'Cancel' and 'Back' options on all sub-screens.",
            "Flexible session management allowing users to pause or skip drills."
        ]
    )
    
    # 6. Consistency & Standards (Heuristic #4)
    pres.add_slide(
        "4. Consistency & Standards",
        "Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform conventions.",
        "player_dashboard",
        [
            "Uniform Bottom Navigation Bar across the entire application.",
            "Consistent use of 'Volt Green' for primary actions (CTAs).",
            "Standardized card layouts for drills, sessions, and progress stats."
        ]
    )
    
    # 7. Recognition Rather Than Recall (Heuristic #6)
    pres.add_slide(
        "5. Recognition Rather Than Recall",
        "Minimize the user's memory load by making objects, actions, and options visible. The user should not have to remember information.",
        "drill_library",
        [
            "Visual drill cards with preview images to help recognition.",
            "Quick-action cards on the dashboard for frequent tasks.",
            "Recent activity and upcoming session summaries visible immediately."
        ]
    )
    
    # 8. Aesthetic & Minimalist Design (Heuristic #8)
    pres.add_slide(
        "6. Aesthetic & Minimalist Design",
        "Interfaces should not contain information which is irrelevant or rarely needed. Every extra unit of information competes with relevant units.",
        "player_dashboard",
        [
            "Tonal layering replaces 1px border lines for a cleaner look.",
            "Generous white space (breathing room) around data points.",
            "Only the most critical metrics (streak, goal, next session) are prioritized."
        ]
    )
    
    # 9. Informative Feedback (Shneiderman's Rule)
    pres.add_slide(
        "7. Informative Feedback",
        "For every user action, there should be an appropriate system response to confirm the action was successful.",
        "ui_states",
        [
            "Success Toast: 'Session saved successfully!' after a workout.",
            "Error Feedback: High-visibility red warnings for data sync failures.",
            "Visual Toggles: Clear on/off states in profile settings."
        ]
    )
    
    # 10. Flexibility & Efficiency (Heuristic #7)
    pres.add_slide(
        "8. Flexibility & Efficiency of Use",
        "Accelerators - unseen by the novice user - may speed up the interaction for the expert user.",
        "coach_dashboard",
        [
            "Quick-create shortcuts for coaches to launch sessions.",
            "Category filters in the Drill Library for fast navigation.",
            "Bulk actions for match preparation checklists."
        ]
    )

    # 11. Error Prevention & Recovery (Heuristic #5 & #9)
    pres.add_slide(
        "9. Error Prevention & Recovery",
        "Good error messages are expressed in plain language, precisely indicate the problem, and constructively suggest a solution.",
        "ui_states",
        [
            "Clear error banners with descriptive problem statements.",
            "Confirmation before session deletion to prevent accidental loss.",
            "Guidance-driven inputs for training data entry."
        ]
    )

    # 12. Final Design Showcase
    pres.add_slide(
        "Final Implementation",
        "The PlaySmart project successfully integrates HCI principles into a high-performance training tool.",
        "progress_tracking",
        [
            "14 High-Fidelity screens delivered.",
            "Role-based dashboards for Players and Coaches.",
            "Production-ready design system (Kinetic Precision)."
        ]
    )

    pres.output(OUT)
    print(f"HCI Presentation generated: {OUT}")

if __name__ == "__main__":
    build()
