You are a senior full-stack engineer and product designer. Build me a production-grade,
SaaS-level web application called "UniToolKit" using Next.js 14 (App Router),
TypeScript, and Tailwind CSS.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 HARD CONSTRAINTS (NEVER VIOLATE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- ZERO external API calls — no OpenAI, no Anthropic, no Google APIs, nothing
- ZERO backend server — no Express, no tRPC, no API routes that hit a DB
- ZERO user accounts — no auth, no login, no sessions
- ZERO file uploads to any server — all processing via browser APIs only
- ZERO paid services — every npm package used must be free and open source
- All data persistence = localStorage only
- The app must work fully offline after first load (PWA optional but preferred)

Every single tool runs inside the browser tab using:
  Web APIs (File API, Canvas, SubtleCrypto, FileReader, Blob, URL.createObjectURL)
  WebAssembly (pdf-lib, pdfjs-dist, @imgly/background-removal)
  Pure JavaScript logic (math, string manipulation, parsers)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 PRODUCT VISION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"UniToolKit" — A free, privacy-first browser toolkit built for university students.
47 tools across PDF, Image, Developer, and University categories.
Tagline: "Every tool a student actually needs. All in one tab. Forever free."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 DESIGN SYSTEM (MANDATORY — DO NOT DEVIATE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This must look like a premium SaaS product (Linear.app, Raycast, Vercel Dashboard).
NOT generic. NOT AI-generated looking. NOT blue-purple gradient on white.

COLORS (define as CSS variables in globals.css):
  --bg:          #0A0A0F
  --surface:     #111118
  --surface-2:   #16161F
  --border:      #1E1E2E
  --border-soft: rgba(255,255,255,0.06)
  --accent:      #6366F1   ← Indigo (primary)
  --accent-soft: #4F46E5
  --violet:      #A78BFA   ← Secondary
  --amber:       #F59E0B   ← University tools highlight
  --success:     #10B981
  --danger:      #EF4444
  --text:        #F1F5F9
  --text-muted:  #64748B
  --text-faint:  #334155

FONTS (load via next/font or @import from Google Fonts):
  Display:    "Bricolage Grotesque" (weights 400, 600, 800)
  Body:       "DM Sans" (weights 400, 500)
  Mono:       "JetBrains Mono" (weights 400, 600)

VISUAL RULES:
  - Dark theme only. No light mode toggle needed.
  - Cards: background var(--surface), border 1px solid var(--border-soft),
    border-radius 12px, backdrop-filter blur(8px)
  - On card hover: border brightens to rgba(99,102,241,0.3), subtle translateY(-2px),
    box-shadow 0 8px 32px rgba(99,102,241,0.1)
  - Hero background: CSS dot-grid pattern (radial-gradient dots, no image)
  - Gradient text: background: linear-gradient(135deg, #6366F1, #A78BFA);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent
  - Pill badges: rounded-full, tiny text, colored background at 15% opacity
  - All icons: Lucide React exclusively. No emoji. No Heroicons.
  - Animations: Framer Motion for mount/unmount. CSS transitions for hover.
  - Tool cards show: icon, name, one-liner, category badge, "Local" pill
  - Sidebar active item: left border 2px solid var(--accent), bg var(--surface-2)

NEVER USE:
  Inter font, Roboto, system-ui, Arial
  Purple gradient on white/light background
  Generic shadcn default styling without customization
  Cookie-cutter layouts copied from any template

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 PROJECT STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/app
  layout.tsx                   ← Root layout: Navbar, CMD+K provider, font variables
  page.tsx                     ← Landing page
  /tools/[slug]/page.tsx       ← Dynamic tool page (reads slug → renders tool component)
  /about/page.tsx
  /privacy/page.tsx

/components
  /ui/
    Button.tsx                 ← variants: primary, ghost, outline, danger
    Badge.tsx                  ← variants: indigo, amber, green, red
    Card.tsx
    Input.tsx
    Textarea.tsx
    Tooltip.tsx
    DropZone.tsx               ← Reusable drag-and-drop file zone
    ProgressBar.tsx
    Tabs.tsx
    CommandPalette.tsx         ← CMD+K using cmdk library
  /layout/
    Navbar.tsx
    Footer.tsx
    ToolSidebar.tsx            ← Left sidebar shown on /tools/* pages
  /sections/                   ← Landing page sections
    Hero.tsx
    ToolGrid.tsx
    WhySection.tsx
    UniSpotlight.tsx
  /tools/
    pdf/
      PdfMerge.tsx
      PdfSplit.tsx
      PdfCompress.tsx
      PdfToJpg.tsx
      JpgToPdf.tsx
      PdfToWord.tsx
      PdfToExcel.tsx
      PdfRotate.tsx
      PdfDeletePages.tsx
      PdfPageNumbers.tsx
      PdfWatermark.tsx
      PdfPasswordProtect.tsx
    image/
      ImageCompressor.tsx
      ImageResizer.tsx
      ImageConverter.tsx
      BackgroundRemover.tsx
      ImageCropper.tsx
      BulkImageResizer.tsx
      ImageToBase64.tsx
      AddWatermark.tsx
      ColorPicker.tsx
      MetadataViewer.tsx
    developer/
      JsonFormatter.tsx
      JwtDecoder.tsx
      Base64Tool.tsx
      UrlEncoder.tsx
      RegexTester.tsx
      HashGenerator.tsx
      UuidGenerator.tsx
      LoremIpsum.tsx
      ColorConverter.tsx
      MarkdownEditor.tsx
      DiffChecker.tsx
      CronParser.tsx
      CodeFormatter.tsx
      CssMinifier.tsx
      HtmlMinifier.tsx
    university/
      GpaCalculator.tsx
      DeadlineTracker.tsx
      CitationGenerator.tsx
      PlagiarismChecker.tsx
      WordCounter.tsx
      PomodoroTimer.tsx
      UnitConverter.tsx
      EquationEvaluator.tsx
      ResumeBuilder.tsx
      TimetableBuilder.tsx

/lib
  tools-registry.ts            ← Master list of all 47 tools with metadata
  utils.ts                     ← cn(), formatBytes(), downloadBlob(), etc.

/hooks
  useLocalStorage.ts
  useFileProcessor.ts
  useClipboard.ts

/types
  tool.ts                      ← Tool interface type definition

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TOOLS REGISTRY (lib/tools-registry.ts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Define a TypeScript interface:

interface Tool {
  slug: string
  title: string
  description: string
  category: 'pdf' | 'image' | 'developer' | 'university'
  icon: string          // Lucide icon name as string
  tags: string[]        // for CMD+K search
  isNew?: boolean
  isPopular?: boolean
}

Then export const tools: Tool[] = [ ...all 47 tools... ]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ ALL 47 TOOLS — IMPLEMENTATION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every tool must:
  ✅ Accept input via drag-and-drop OR paste OR typed input
  ✅ Show real-time processing feedback ("Running locally...")
  ✅ Provide Download and/or Copy output
  ✅ Show file size before/after where relevant
  ✅ Handle errors gracefully with a red error card
  ✅ Have a Reset button to clear state
  ✅ Work on mobile (responsive layout)

━━━ 📄 PDF TOOLS (12 tools) ━━━

Use: pdf-lib (create/modify PDFs), pdfjs-dist (render/parse PDFs)

1.  PDF Merge          → Accept multiple PDFs, drag to reorder, merge with pdf-lib
2.  PDF Split          → Input page ranges (e.g. "1-3, 5, 7-9"), extract with pdf-lib
3.  PDF Compress       → Re-encode embedded images at lower quality via pdf-lib
4.  PDF to JPG         → Render each page with pdfjs-dist Canvas, export JPGs in ZIP
5.  JPG/PNG to PDF     → Accept multiple images, combine into PDF with pdf-lib
6.  PDF to Word        → Extract text per page with pdfjs-dist, rebuild .docx with
                         the "docx" npm package (paragraphs, headings preserved)
7.  PDF to Excel       → Detect table-like text blocks with pdfjs-dist, export to
                         .xlsx using SheetJS (xlsx npm). Show extracted table preview.
8.  PDF Rotate         → Select pages + angle (90/180/270), rotate with pdf-lib
9.  Delete PDF Pages   → Enter page numbers to remove, rebuild PDF with pdf-lib
10. Add Page Numbers   → Options: position (bottom-center/corner), font size, start number
11. PDF Watermark      → Add diagonal text watermark to every page with pdf-lib
12. PDF Password       → Set open password using pdf-lib encryption (AES-256)

━━━ 🖼️ IMAGE TOOLS (10 tools) ━━━

Use: Canvas API, browser-image-compression, react-image-crop, JSZip, exifr, heic2any

13. Image Compressor   → Slider for quality (1–100%), shows before/after KB, download
14. Image Resizer      → Width/height inputs with aspect ratio lock, Canvas resize
15. Image Converter    → JPG ↔ PNG ↔ WebP ↔ HEIC (heic2any for HEIC input)
16. Background Remover → Use @imgly/background-removal (runs ONNX model via WASM,
                         NO API key needed, fully local)
17. Image Cropper      → react-image-crop with presets: Free, 1:1, 16:9, 4:3, Stories
18. Bulk Image Resizer → Process multiple images, download all as ZIP via JSZip
19. Image to Base64    → Convert image → base64 data URI and reverse
20. Add Watermark      → Text watermark with Canvas: font, opacity, position, angle
21. Color Picker       → Upload image, click to sample color → show HEX/RGB/HSL
22. Metadata Viewer    → Use exifr to extract EXIF: camera model, GPS, date, ISO, etc.

━━━ 💻 DEVELOPER TOOLS (15 tools) ━━━

23. JSON Formatter     → Textarea input, format/minify/validate JSON, syntax highlight
                         with a custom tokenizer (no external editor needed)
24. JWT Decoder        → Split by ".", base64url decode each part, pretty-print JSON.
                         Show expiry status (valid/expired/not-yet-valid) in color badge.
25. Base64 Tool        → Encode text → Base64 and decode Base64 → text. UTF-8 safe.
26. URL Encoder        → Encode/decode using encodeURIComponent. Parse query params
                         into a table view.
27. Regex Tester       → Live regex input, test string textarea, highlight all matches
                         inline, show capture groups in a table below.
28. Hash Generator     → Input text, output MD5 (crypto-js), SHA-1/256/512
                         (SubtleCrypto). One-click copy each hash.
29. UUID Generator     → Generate 1–100 UUIDs via crypto.randomUUID(). Copy all.
                         Also show UUID v1 timestamp-based format.
30. Lorem Ipsum        → Generate by: paragraphs / sentences / words / characters.
                         Classic Lorem or random Latin word bank.
31. Color Converter    → HEX ↔ RGB ↔ HSL ↔ CMYK with live color preview swatch.
                         Include a color picker input.
32. Markdown Editor    → Split-pane: left = raw MD textarea, right = rendered preview
                         via react-markdown + remark-gfm. Export as HTML or .md file.
33. Diff Checker       → Two text areas, show character-level or line-level diff with
                         red/green highlights using the "diff" npm package.
34. Cron Parser        → Input cron expression, show human readable text (cronstrue npm),
                         next 5 run times (cron-parser npm).
35. Code Formatter     → Paste code, select language (JS/TS/CSS/HTML/JSON), format
                         using prettier standalone. Download formatted file.
36. CSS Minifier       → Paste CSS, minify client-side, show size reduction %, download.
37. HTML Minifier      → Paste HTML, minify via html-minifier-terser, download.

━━━ 🎓 UNIVERSITY TOOLS (10 tools) ━━━

38. GPA Calculator
    - Add unlimited courses: name, credit hours, grade (A+/A/B+/B/C+/C/D/F)
    - Pakistani grading system (A+ = 4.0, A = 4.0, B+ = 3.5, B = 3.0, etc.)
    - Multi-semester support: add semesters, calculate per-semester GPA + CGPA
    - Persist in localStorage
    - Export as styled PDF report using jsPDF + html2canvas

39. Assignment Deadline Tracker
    - Add: subject, task, due date, priority (High/Medium/Low), status (Pending/Done)
    - Sort by due date. Color-coded urgency (red = today/tomorrow, yellow = this week)
    - Mark complete with strikethrough animation
    - Persist in localStorage. Export as PDF or CSV download.

40. Citation Generator (APA 7th / MLA 9th / Chicago / IEEE)
    - Source types: Book, Journal Article, Website, YouTube Video, Conference Paper,
      Thesis, Newspaper
    - Dynamic form fields based on source type
    - Auto-format citation string per selected style
    - Copy to clipboard. Export list as .txt or .docx

41. Plagiarism Checker (Local Similarity)
    - Two text areas: "My Text" vs "Reference Text"
    - Client-side n-gram similarity algorithm (Jaccard similarity on 3-grams)
    - Highlight overlapping phrases in both panels
    - Show similarity percentage with color-coded verdict
    - Disclaimer: "This is a local text comparison tool. Not connected to any database."

42. Word & Character Counter
    - Real-time: words, characters (with/without spaces), sentences,
      paragraphs, reading time (at 200 wpm), speaking time (at 130 wpm)
    - Keyword density table: top 10 most used words with frequency %
    - Useful for essays, reports, thesis abstracts

43. Pomodoro Timer
    - Default: 25 min work / 5 min break / 15 min long break
    - Fully customizable intervals
    - Session counter, total focused time today
    - Browser Notification API on session end
    - Ambient sound options (local audio: white noise, rain, cafe) via HTML5 Audio
    - Progress ring animation (SVG-based, CSS animated)

44. Unit Converter
    - Categories: Length, Mass, Temperature, Time, Data Size, Energy,
      Pressure, Speed, Area, Volume
    - Instant conversion as you type
    - Clean two-panel: input unit → output unit with swap button

45. Equation Evaluator
    - Input math expression as text: "sin(45deg) + log(100) / sqrt(16)"
    - Use mathjs to evaluate safely (no eval())
    - Show step-by-step breakdown where possible
    - History of last 20 calculations (localStorage)
    - Supports: trig, logarithms, exponents, fractions, complex numbers

46. Resume / CV Builder (Download as PDF)
    - Sections: Personal Info, Education, Experience, Skills, Projects,
      Certifications, Languages
    - Add/remove rows within each section
    - Live preview on right panel styled as a real CV
    - One clean professional template (dark-accented header, clean body)
    - Export as PDF via html2canvas + jsPDF
    - Persist in localStorage so user doesn't lose progress

47. Timetable Builder
    - Weekly grid: Monday–Saturday, 8:00 AM – 8:00 PM, 1-hour slots
    - Click slot → add subject/room/color
    - Each subject gets auto color-coded
    - Save to localStorage. Export as PNG (Canvas screenshot) or PDF.
    - Print-friendly layout option.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏠 LANDING PAGE — SECTION BY SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1 — Hero
  - Full-width. CSS dot-grid background (radial-gradient, no image).
  - Small pill badge: "✦ 47 Free Tools — No Signup Required"
  - H1 (Bricolage Grotesque, 72px, gradient text):
    "Every tool a student actually needs."
  - Subtitle (DM Sans, 20px, text-muted):
    "PDF, image, developer, and university utilities. All run in your browser.
     Your files never leave your device."
  - Two CTAs: [Browse Tools] (filled indigo) + [How it works ↓] (ghost)
  - Animated stat row: "47 Tools  •  0 Uploads  •  100% Private  •  Free Forever"
    Each stat fades in with staggered delay using Framer Motion.
  - Subtle aurora blob in background (CSS radial-gradient animation, low opacity)

SECTION 2 — Category Filter + Tool Grid
  - Filter tabs: All | PDF (12) | Image (10) | Developer (15) | University (10)
  - CMD+K search: pressing "/" or clicking search icon opens command palette
  - 4-column grid (2 on tablet, 1 on mobile)
  - Each card: icon (40px, indigo tinted), title, one-liner, category badge, "Local" pill
  - Framer Motion: stagger children 0.04s on filter change with AnimatePresence

SECTION 3 — Why UniToolKit
  - 3 columns, each with icon + heading + 2-line description:
    🔒 "Zero Uploads" — Files processed in your browser tab. We literally can't see them.
    ⚡ "Instant Results" — No server round-trip. Your CPU does the work. No waiting.
    🎓 "Built for Students" — GPA calc, citations, deadlines, CV builder — tools you need.

SECTION 4 — University Tools Spotlight
  - Amber/gold accent color section (different vibe from main)
  - Heading: "Tools your professor won't tell you about"
  - Horizontal scrollable row of 10 university tool cards with amber badge

SECTION 5 — Trust Banner
  - Full-width dark strip: "Open DevTools → Network Tab → Upload a file → See zero requests."
  - This is the ultimate privacy proof statement.

FOOTER
  - Left: Logo + tagline
  - Right: About, Privacy, Terms, Blog links
  - Bottom: "© 2025 UniToolKit — All processing happens in your browser"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 TOOL PAGE LAYOUT (SHARED SHELL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/tools/[slug] renders:

LEFT SIDEBAR (240px, sticky):
  - Category name as section header
  - List of all tools in that category
  - Active tool: left border accent + bg surface-2
  - Bottom: "🔒 Local Only — No uploads" trust badge

MAIN PANEL (flex-1):
  - Breadcrumb: Home > PDF Tools > PDF Merge
  - Tool header: icon + title + description + badges (category, local, isNew)
  - Tool-specific component below header
  - Every tool component follows this inner layout:
      [Input Zone] → [Options Panel] → [Output Zone] → [Action Buttons]
  - "Processing in your browser..." skeleton/spinner state
  - Error state: red card with error message + retry button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 PACKAGE.JSON DEPENDENCIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "typescript": "5.x",
    "tailwindcss": "3.x",
    "framer-motion": "^11",
    "lucide-react": "latest",
    "cmdk": "latest",
    "pdf-lib": "^1.17",
    "pdfjs-dist": "^4",
    "docx": "^8",
    "xlsx": "^0.18",
    "browser-image-compression": "^2",
    "react-image-crop": "^10",
    "heic2any": "^0.0.4",
    "exifr": "^7",
    "@imgly/background-removal": "^1",
    "jszip": "^3",
    "mathjs": "^12",
    "react-markdown": "^9",
    "remark-gfm": "^4",
    "diff": "^5",
    "cronstrue": "^2",
    "cron-parser": "^4",
    "crypto-js": "^4",
    "prettier": "^3",
    "html-minifier-terser": "^7",
    "jspdf": "^2",
    "html2canvas": "^1",
    "clsx": "^2",
    "tailwind-merge": "^2",
    "zustand": "^4",
    "date-fns": "^3"
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 NEXT.JS CONFIG (next.config.js)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Must configure:
  - webpack: alias "canvas" to false (for pdfjs in browser)
  - webpack: add rule for .wasm files (for @imgly/background-removal)
  - headers: set Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy
    for SharedArrayBuffer (required by background removal WASM)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ BUILD ORDER — STEP BY STEP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build in this exact sequence. Ask me before starting each step.

STEP 1 — Foundation
  - next.config.js (WASM + COOP/COEP headers)
  - tailwind.config.ts (custom colors, fonts, extend theme)
  - globals.css (CSS variables, base styles, dot-grid background class)
  - /lib/utils.ts (cn, formatBytes, downloadBlob helpers)
  - /types/tool.ts
  - /lib/tools-registry.ts (all 47 tools metadata)
  - /hooks/useLocalStorage.ts, useClipboard.ts, useFileProcessor.ts

STEP 2 — Layout & Navigation
  - Navbar.tsx (logo, nav links, search icon, CMD+K trigger)
  - Footer.tsx
  - CommandPalette.tsx (cmdk: search tools, keyboard nav, open tool on select)
  - Root layout.tsx

STEP 3 — Landing Page
  - Hero.tsx
  - ToolGrid.tsx (with filter tabs + AnimatePresence)
  - WhySection.tsx
  - UniSpotlight.tsx
  - page.tsx assembling all sections

STEP 4 — Tool Shell
  - ToolSidebar.tsx
  - /tools/[slug]/page.tsx (dynamic routing + component loader)
  - Shared UI: DropZone.tsx, ProgressBar.tsx, Button, Badge, Card, Tabs

STEP 5 — PDF Tools (all 12)
STEP 6 — Image Tools (all 10)
STEP 7 — Developer Tools (all 15)
STEP 8 — University Tools (all 10)

STEP 9 — Polish
  - Mobile responsiveness audit
  - Framer Motion stagger animations on all tool grids
  - Error boundary components
  - Loading skeleton states for file tools
  - About page + Privacy page

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ QUALITY CHECKLIST (verify before each step)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Zero network requests when using any tool
□ Works on mobile (375px viewport minimum)
□ All fonts load correctly via next/font
□ No TypeScript errors (strict mode)
□ No console errors in browser
□ CMD+K finds all 47 tools
□ localStorage persists GPA, deadlines, resume, timetable
□ Each tool has error handling (try/catch + user-visible error card)
□ Download button works (Blob + URL.createObjectURL)
□ Drag and drop works on all file-based tools

Start with STEP 1. Generate all files for that step completely,
then wait for my confirmation before proceeding to STEP 2.