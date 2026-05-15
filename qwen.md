Add a "Meet the Developer" section to the About page 
and a subtle developer credit card to the landing page.
This section markets M Abu Hurairah as a developer to 
every visitor who uses the tools.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. LANDING PAGE — Sticky bottom-right floating card
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add a floating card fixed to bottom-right of screen:

position: fixed
bottom: 24px
right: 24px
z-index: 50

Card design:
  background: #FFFFFF
  border: 1px solid #D5EDD9
  border-radius: 14px
  padding: 14px 18px
  box-shadow: 0 8px 32px rgba(26,107,58,0.12)
  display: flex
  align-items: center
  gap: 12px
  cursor: pointer (links to abuhurairah.engineer)

Inside card:
  LEFT: Avatar circle
    width: 38px, height: 38px
    border-radius: 50%
    background: #0A2415
    display: flex, align-items: center, justify-content: center
    Text: "MAH"
    font-size: 11px, font-weight: 700, color: #FFFFFF

  RIGHT: Two lines
    Line 1: "Built by M Abu Hurairah"
      font-size: 12px, font-weight: 600, color: #0A2415
    Line 2: "Full-Stack Developer · UCP"
      font-size: 11px, color: #6B9478

  FAR RIGHT: Arrow icon →
    color: #1A6B3A, font-size: 14px

Behavior:
  - Appears after user scrolls 300px down (not on load)
  - Clicking opens abuhurairah.engineer in new tab
  - Can be dismissed with an X button (stores in localStorage
    so it doesn't reappear same session)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. ABOUT PAGE — Full developer profile page
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Route: /about

Build a personal profile page with these sections:

HERO CARD (top of page):
  background: #EEF7F1
  border: 1px solid #D5EDD9
  border-radius: 16px
  padding: 40px
  display: flex, gap: 32px, align-items: center

  LEFT SIDE — Avatar:
    width: 88px, height: 88px
    border-radius: 50%
    background: #0A2415
    font-size: 24px, font-weight: 800, color: white
    Text: "MAH"
    border: 3px solid #1A6B3A

  RIGHT SIDE:
    Name: "M Abu Hurairah"
      font-size: 28px, font-weight: 800, color: #0A2415
      font-family: Bricolage Grotesque

    Role badges row (display: flex, gap: 8px, margin: 8px 0):
      ["Full-Stack Developer"] ["Final Year CS · UCP"]
      ["Open Source Builder"]
      Each badge: bg #EEF7F1, border #D5EDD9, color #1A6B3A,
      border-radius: 999px, font-size: 11px, padding: 4px 12px,
      font-weight: 600

    Bio (14px, color: #3D6B4F, line-height: 1.7, max-width: 480px):
      "I'm a final-year Computer Science student at the University
      of Central Punjab (UCP) and a practicing Full-Stack Developer.
      I built HurairahTools because I was tired of slow, sketchy
      online tools that upload your files to unknown servers.
      So I built 47 utilities that run entirely in your browser —
      free, private, and forever."

    Links row (display: flex, gap: 12px, margin-top: 16px):
      [🌐 Portfolio ↗]  → abuhurairah.engineer
      [💻 GitHub ↗]     → github.com/ITZ-HURAIRAH18
      Both: primary ghost button style

TECH STACK SECTION:
  Heading: "Tech Stack"
    font-size: 13px, font-weight: 700, color: #9AB8A0,
    letter-spacing: 1px, text-transform: uppercase
    margin-bottom: 16px

  Display as pill grid (display: flex, flex-wrap: wrap, gap: 8px):
    Technologies to show:
    Next.js · TypeScript · React · Python · Django · FastAPI
    Node.js · Express.js · PostgreSQL · MongoDB · Docker
    WebSockets · JWT Auth · n8n Automation · Tailwind CSS

    Each pill:
      background: #FFFFFF
      border: 1px solid #D5EDD9
      border-radius: 999px
      padding: 6px 14px
      font-size: 12px
      font-weight: 500
      color: #0A2415
      On hover: border-color #1A6B3A, color #1A6B3A

PROJECTS SECTION:
  Heading: "Other Projects"
  Subtitle: "A few things I've built beyond HurairahTools"

  Grid: 2 columns, gap 16px

  Each project card:
    background: #FFFFFF
    border: 1px solid #D5EDD9
    border-radius: 12px
    padding: 20px
    On hover: border-color #1A6B3A

    Top row: Project name (font-weight: 700, #0A2415)
             + GitHub icon link (right-aligned)
    Description: 13px, color: #3D6B4F, margin: 8px 0
    Tags row: tech pills (smaller, 10px)

  Projects to list:
    1. FinScope
       "Real-time crypto & stock analytics dashboard"
       Tags: React, WebSocket, Chart.js

    2. HireLens
       "AI-powered resume analysis with LangChain"
       Tags: FastAPI, LangChain, React

    3. DonorHub
       "Charity & donation platform (MERN stack)"
       Tags: MongoDB, Express, React, Node.js

    4. LoanVerse
       "Loan management system"
       Tags: Django, React, PostgreSQL

    5. NexGen
       "Meeting scheduling with WebRTC"
       Tags: WebRTC, Node.js, React

    6. Supportify
       "AI customer support automation"
       Tags: Telegram, FastAPI, n8n

STORY SECTION:
  Heading: "Why I built HurairahTools"
  Style: blockquote-style card
    background: #EEF7F1
    border-left: 3px solid #1A6B3A
    border-radius: 0 12px 12px 0
    padding: 24px 28px

  Text (14px, #3D6B4F, line-height: 1.8):
    "Every time I needed to compress a PDF before submitting
    an assignment, or convert an image for a presentation,
    or generate a citation for my thesis — I'd find some
    sketchy website that uploads your file to a server you
    know nothing about, shows you ads, and makes you wait.

    So I built the tools myself. 47 of them. All running
    entirely in your browser. Your files never touch a server —
    because there is no server.

    This is my way of giving back to every student who's
    been in the same situation."

    — M Abu Hurairah, CS Student & Developer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. EVERY TOOL PAGE — Subtle developer credit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

At the bottom of every tool page, after the tool UI,
add a small credit line:

<div style={{
  marginTop: '48px',
  paddingTop: '20px',
  borderTop: '1px solid #D5EDD9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}}>
  <span style={{ fontSize: '12px', color: '#9AB8A0' }}>
    Built by{' '}
    
      href="https://abuhurairah.engineer"
      target="_blank"
      style={{ color: '#1A6B3A', fontWeight: 600, textDecoration: 'none' }}
    >
      M Abu Hurairah
    </a>
    {' '}· This tool runs 100% in your browser
  </span>
  
    href="https://abuhurairah.engineer"
    target="_blank"
    style={{
      fontSize: '12px',
      color: '#1A6B3A',
      fontWeight: 600,
      textDecoration: 'none',
    }}
  >
    View Portfolio ↗
  </a>
</div>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. PAGE TITLE & META (SEO — gets you found on Google)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update app/layout.tsx metadata:

export const metadata = {
  title: 'HurairahTools — Free Browser Tools by M Abu Hurairah',
  description: `47 free PDF, image, developer, and university tools
    built by M Abu Hurairah, a Full-Stack Developer and CS student
    at UCP. Everything runs in your browser — no uploads, no signup,
    no tracking.`,
  keywords: [
    'M Abu Hurairah',
    'HurairahTools',
    'Abu Hurairah developer',
    'free PDF tools',
    'browser tools no upload',
    'student tools free',
    'GPA calculator online',
    'citation generator free',
    'UCP developer portfolio',
  ],
  authors: [{ name: 'M Abu Hurairah', url: 'https://abuhurairah.engineer' }],
  creator: 'M Abu Hurairah',
  openGraph: {
    title: 'HurairahTools by M Abu Hurairah',
    description: '47 free tools. All run in your browser. Built by a student.',
    url: 'https://hurairahtools.vercel.app',
    siteName: 'HurairahTools',
    type: 'website',
  },
}

Each tool page metadata:
  title: `[Tool Name] — HurairahTools by M Abu Hurairah`
  description: `Free [tool name] tool by M Abu Hurairah. Runs 100% in
    your browser — no file uploads, no signup required.`
    