# Stitch Mockup Prompt for Career Search Assistant

## Application Overview
Create mockups for a **Career Search Assistant** web application designed for a recently retired purchasing manager (Joe Bishop, 60+ years old) who is seeking his next career opportunity. The app combines Google's Career Dreamer tool, an AI-powered recruiter assistant, job tracking, and resume customization tools.

**User Profile**: 
- Retired professional with 30+ years experience in procurement/purchasing
- Tech-savvy but prefers clear, straightforward interfaces
- Values direct, honest feedback (no fluff)
- Needs guidance through modern job search process

**Tech Stack**: 
- Built with Mantine UI framework (React)
- Clean, professional design
- Accessible and easy to navigate
- Modern but not overly flashy

---

## Page 1: Landing Page (Home)

**Purpose**: Convince Joe to try Google's Career Dreamer tool and explain the benefits

**Key Sections**:
1. **Hero Section**
   - Large headline: "Turn 30 Years of Experience Into Your Next Big Thing"
   - Subtitle: "Google's Career Dreamer Tool + Your Personal AI Recruiter"
   - Clean, centered layout

2. **Benefits Section** (Most prominent)
   - Gradient background (purple/blue theme)
   - Three large cards in a row:
     - Card 1: "Stand Out from the Crowd" - explains how 30+ years of experience translates to modern keywords
     - Card 2: "Build an Impressive Resume (with AI)" - highlights AI-powered resume creation
     - Card 3: "Discover Jobs You Haven't Thought Of" - shows the "Dream Career Graph" feature
   - Each card has an icon, bold title, and compelling copy

3. **"Explore Paths" Video Section**
   - Video player showcasing the career discovery feature
   - Image below video showing the visual career graph
   - Explanation of blue dots (database careers) vs green dots (AI-generated ideas)
   - Light background with border

4. **"Show Me How to Use It!" Button**
   - Large, prominent call-to-action button
   - Expands to reveal step-by-step guide

5. **Step-by-Step Guide** (when expanded)
   - 7 cards showing screenshots paired with text:
     - Step 1: Enter Last Job (with screenshot)
     - Step 2: Enter Last Company (with screenshot)
     - Step 3: Confirm Last Job (with screenshot)
     - Step 4: Confirm Skills (with screenshot)
     - Step 5: Enter All Experience (with screenshot)
     - Step 6: Explore Paths (referenced, already shown above)
     - Step 7: Chat with Gemini (with screenshot)

6. **FAQ Section**
   - Accordion-style questions
   - Clean, readable format
   - Answers common questions about Career Dreamer

**Design Notes**: 
- Professional color scheme (blues, grays)
- Generous white space
- Clear typography hierarchy
- Trust-building elements

---

## Page 2: Chat Interface (AI Recruiter)

**Purpose**: Allow Joe to chat with his AI recruiter expert about jobs, resume advice, and career guidance

**Layout**:
- Left sidebar: Thread list/selector with "New Thread" button
- Main area: Chat conversation
- Bottom: Input area with text field, microphone icon, and send button

**Chat Features**:
- Message bubbles (user messages on right/blue, AI on left/gray)
- Badges showing "You" vs "AI Recruiter"
- Welcome message when no messages exist
- Loading indicator when AI is thinking
- Stop generation button during streaming

**Design Notes**:
- Clean, messaging-app aesthetic
- Easy to read conversation history
- Prominent voice input option
- Scrollable message area

---

## Page 3: Resume Customization Page

**Purpose**: Help Joe customize his resume for specific job postings

**Unique Split-Screen Layout**:
- **Left Half (50%)**: Chat interface for AI assistance
  - URL input field at top with help text about using company websites
  - Chat messages below
  - Input field at bottom
  
- **Right Half (50%)**: Resume preview
  - Live resume preview in iframe/canvas frame
  - Professional resume template styling
  - Updates in real-time as changes are made

**Key Flow**:
1. User enters job URL in top input field
2. System scrapes job posting
3. Resume moves to right side
4. AI analyzes job and provides fit score + recommendations
5. User chats with AI to customize resume
6. Resume preview updates on the right

**Design Notes**:
- Clear visual separation between chat and resume
- Resume should look like a real document (paper-like styling)
- Chat interface similar to Page 2 but more compact

---

## Page 4: Tools Page

**Purpose**: Central hub organizing all career tools by stage

**Layout**: Three main sections organized vertically:

1. **"Search for a Job" Section** (Blue theme)
   - Career Dreamer card (with "Aspirational" badge)
   - Job Feed card (with "Coming Soon" badge)
   - Each card has icon, title, description, and navigation button

2. **"Apply for a Job" Section** (Green theme)
   - AI Resume & Cover Letter card
   - AI Proofreading card
   - Each card has icon, title, description, and navigation button

3. **"Prepare for an Interview" Section** (Orange theme)
   - Interview Tips card
   - Google Interview Warmup card
   - Each card has icon, title, description, and navigation button

**Design Notes**:
- Clear visual hierarchy with section headers
- Card-based design for each tool
- Color-coded by stage for easy scanning
- Professional, organized appearance

---

## Page 5: Interview Prep Page

**Purpose**: Explain and promote Google Interview Warmup tool

**Key Sections**:
1. **Hero Section**
   - Gradient background (pink/red theme)
   - Large title: "Google Interview Warmup"
   - Description and "Start Practicing Now" button

2. **Video Canvas**
   - Two videos side-by-side showing:
     - Real-time practice demo
     - AI insights & feedback demo

3. **Feature Sections**:
   - What It Does (with icons: Practice Speaking, Get Hints, AI Insights)
   - How to Use It (numbered list)
   - Question Types (3 cards: Background, Situational, Technical)
   - AI-Powered Insights (explanation with list)

4. **FAQ Section**
   - Accordion component with expandable questions
   - Comprehensive answers about the tool

**Design Notes**:
- Educational and informative
- Video content prominently featured
- Clean, scannable layout

---

## Page 6: Interview Tips Page

**Purpose**: Provide expert interview tips before, during, and after interviews

**Key Sections**:
1. **Hero Section**
   - Gradient background (red/orange theme)
   - Large title: "Interview Tips"
   - Description with Google Career Certificates credit

2. **Main Accordion Sections**:
   - **Before the Interview** (expanded by default)
     - Practice tips
     - Self-reflection questions
     - Research & preparation checklist
   - **During the Interview**
     - Key tips with checkmarks
     - Emphasis on being authentic
   - **After the Interview**
     - Follow-up checklist

3. **Question Types Section**:
   - Behavioral Questions (with STAR method card)
   - Technical Questions (with step-by-step process)
   - Background Questions (with present/past/future structure)

**Design Notes**:
- Accordion-based for easy navigation
- Clear visual hierarchy
- Practical, actionable advice
- Professional color scheme

---

## Navigation Structure

**Top Navigation Bar** (sticky header):
- Logo/Title: "Career Search Assistant"
- Tabs: Home | Chat | Jobs | Tools | Tips | Resume
- Icons accompany each tab name

**Design Consistency Across All Pages**:
- Mantine UI component library styling
- Consistent spacing and typography
- Professional color palette (blues, grays, with accent colors)
- Accessible contrast ratios
- Mobile-responsive (but prioritize desktop view)

---

## Color Palette Recommendations
- Primary Blue: #1a73e8 (accent color)
- Gray backgrounds: Light grays for cards, white for main content
- Gradient sections: Purple/blue for benefits, pink/red for interview tools
- Success Green: For "Apply" stage
- Warning Orange: For "Prepare" stage

## Typography
- Headlines: Bold, clear hierarchy (40px for hero, 24px for section headers)
- Body text: 16px, readable line height
- Clear distinction between headings and body

## Key Design Principles
1. **Clarity over cleverness** - Direct, no-nonsense design
2. **Trust-building** - Professional, polished appearance
3. **Accessibility** - Large text, clear contrast, easy navigation
4. **Progressive disclosure** - Show what's needed, hide complexity
5. **Action-oriented** - Clear CTAs and next steps

---

## Specific Mockup Requests

Please create mockups for:
1. Landing Page (full scrollable page showing all sections)
2. Chat Interface (with example conversation)
3. Resume Customization Page (split-screen with chat and resume preview)
4. Tools Page (showing all three sections)
5. Interview Prep Page (showing key sections)
6. Interview Tips Page (showing accordion structure)

Each mockup should show:
- Desktop view (primary focus)
- Clean, professional aesthetic
- Real content/placeholder text
- Proper spacing and visual hierarchy
- Interactive elements (buttons, inputs, etc.)

---

**Note for Stitch**: This is a real application currently being built. The mockups should inspire improvements and help visualize the ideal user experience. Focus on making the interface welcoming yet professional, guiding a seasoned professional through a modern job search process.

