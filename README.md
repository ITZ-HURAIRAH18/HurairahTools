# HurairahToolsKit 🛠️

**Every tool a student actually needs. All in one tab. Forever free.**

HurairahToolsKit is a free, privacy-first browser toolkit built for university students and developers. 47 powerful utilities for PDF, image, developer, and academic tasks—all running locally in your browser with **zero server uploads, zero accounts, zero tracking**.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)

---

## ✨ Key Features

🔒 **100% Privacy-First**  
All processing happens in your browser. Files never leave your device. No backend. No logins. No tracking.

⚡ **Instantly Available**  
47 tools ready to use. No sign-up, no friction. Click, upload, download. That's it.

🎓 **Built for Students**  
GPA calculator, deadline tracker, citation generator, plagiarism checker, resume builder, timetable scheduler—tools your professors won't mention.

💻 **Fully Offline**  
Works completely offline after first load. PWA-ready. Use it on the plane, in the library, anywhere.

🎨 **Beautiful & Fast**  
Clean white + green SaaS design. Responsive on mobile. Zero bloat. Instant feedback.

---

## 🛠️ 47 Tools Across 4 Categories

### 📄 PDF Tools (12)
- **Merge** — Combine multiple PDFs, drag to reorder
- **Split** — Extract specific pages by range
- **Compress** — Reduce file size while keeping quality
- **to JPG** — Convert each page to image format (ZIP download)
- **to Word** — Extract text and rebuild as .docx
- **to Excel** — Parse tables and export to .xlsx
- **Rotate** — Spin pages 90°/180°/270°
- **Delete Pages** — Remove unwanted pages
- **Page Numbers** — Add page numbers with custom positioning
- **Watermark** — Add text watermark to all pages
- **Password Protect** — Encrypt with AES-256
- **JPG/PNG to PDF** — Convert images to PDF documents

### 🖼️ Image Tools (10)
- **Compressor** — Quality slider, instant size preview
- **Resizer** — Crop to dimensions with aspect ratio lock
- **Converter** — JPG ↔ PNG ↔ WebP ↔ HEIC
- **Background Remover** — Remove backgrounds (local WASM, no API)
- **Cropper** — Interactive crop with 1:1, 16:9, 4:3 presets
- **Bulk Resizer** — Batch process multiple images (ZIP download)
- **to Base64** — Convert image ↔ base64 data URI
- **Watermark** — Add text overlay with opacity and rotation
- **Color Picker** — Sample colors from image (HEX/RGB/HSL)
- **Metadata Viewer** — Extract EXIF, GPS, camera info

### 💻 Developer Tools (15)
- **JSON Formatter** — Validate, format, minify JSON with syntax highlighting
- **JWT Decoder** — Decode and validate tokens with expiry status
- **Base64 Tool** — Encode/decode text (UTF-8 safe)
- **URL Encoder** — Encode/decode with query parameter parser
- **Regex Tester** — Live regex matching with capture group highlighting
- **Hash Generator** — MD5, SHA-1/256/512 hashing
- **UUID Generator** — Generate 1–100 UUIDs instantly
- **Lorem Ipsum** — Generate by paragraphs, sentences, words, or characters
- **Color Converter** — HEX ↔ RGB ↔ HSL ↔ CMYK with live preview
- **Markdown Editor** — Split-pane editor with live preview and export
- **Diff Checker** — Line-by-line and character-level diff highlighting
- **Cron Parser** — Decode cron expressions and show next 5 run times
- **Code Formatter** — Format JavaScript, TypeScript, CSS, HTML, JSON
- **CSS Minifier** — Minify CSS with size reduction stats
- **HTML Minifier** — Minify and compress HTML files

### 🎓 University Tools (10)
- **GPA Calculator** — Multi-semester GPA tracking (Pakistani grading system)
- **Deadline Tracker** — Priority-based assignment management
- **Citation Generator** — APA, MLA, Chicago, IEEE styles
- **Plagiarism Checker** — Local text similarity detection
- **Word Counter** — Words, characters, sentences, reading time, keyword density
- **Pomodoro Timer** — Customizable work/break intervals with ambient sounds
- **Unit Converter** — Length, mass, temperature, time, energy, volume, etc.
- **Equation Evaluator** — Math expression parser with step-by-step breakdown
- **Resume Builder** — Create beautiful CV with live preview (export as PDF)
- **Timetable Builder** — Weekly schedule grid with color-coded subjects

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/ITZ-HURAIRAH18/HurairahTools.git
cd HurairahTools

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will auto-reload as you make changes.

### Build for Production

```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack

**Frontend Framework**
- [Next.js 14](https://nextjs.org) — App Router, server components, optimized builds
- [React 18](https://react.dev) — UI rendering
- [TypeScript 5](https://www.typescriptlang.org) — Type safety

**Styling**
- [Tailwind CSS 3](https://tailwindcss.com) — Utility-first CSS
- Custom CSS variables — Green SaaS design system
- Fonts: Bricolage Grotesque (display), DM Sans (body), JetBrains Mono (code)

**Animation & Interactivity**
- [Framer Motion](https://www.framer.com/motion) — Smooth transitions and stagger animations
- [cmdk](https://cmdk.paco.me) — Command palette for tool discovery

**PDF Processing**
- [pdf-lib](https://pdf-lib.js.org) — Create and modify PDFs
- [pdfjs-dist](https://mozilla.github.io/pdf.js) — Render and parse PDFs

**Image Processing**
- Canvas API — Built-in image manipulation
- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) — JPEG/PNG compression
- [react-image-crop](https://github.com/DominicTobias/react-image-crop) — Interactive crop tool
- [@imgly/background-removal](https://www.remove.bg/api) — WASM-based background removal (no API key)
- [exifr](https://github.com/MikeKovarik/exifr) — EXIF metadata extraction

**Developer Tools**
- [mathjs](https://mathjs.org) — Math expression evaluation
- [prettier](https://prettier.io) — Code formatting
- [SheetJS (xlsx)](https://sheetjs.com) — Excel generation
- [cronstrue](https://github.com/bradymholt/cronstrue) — Cron expression parser
- [crypto-js](https://cryptojs.gitbook.io) — SHA/MD5 hashing

**Data Persistence**
- localStorage — Client-side data storage (no backend database)

**Icons & UI**
- [lucide-react](https://lucide.dev) — Beautiful SVG icons
- Custom components (Button, Badge, Card, Input, Textarea, etc.)

**Additional Utilities**
- [date-fns](https://date-fns.org) — Date manipulation
- [JSZip](https://stuk.github.io/jszip) — ZIP file generation
- [html-minifier-terser](https://github.com/terser/html-minifier-terser) — HTML minification
- [jsPDF](https://github.com/parallax/jsPDF) — PDF export
- [html2canvas](https://html2canvas.hertzen.com) — HTML to image conversion

---

## 🎨 Design System

**Color Palette**
- **Primary:** `#1A6B3A` — Forest green
- **Background:** `#F8FAF7` — Off-white with green tint
- **Surface:** `#FFFFFF` — Pure white
- **Text:** `#0A2415` — Near-black with green tone
- **Accent (University):** `#D97706` — Warm amber
- **Borders:** `#E0EDE2` — Soft green-tinted

**Typography**
- Display: Bricolage Grotesque (400, 600, 800)
- Body: DM Sans (400, 500)
- Code: JetBrains Mono (400, 600)

**Principles**
- Clean, minimal aesthetic
- White-dominant with green accents
- No dark mode, no gradients, no clutter
- Responsive: 1 col (mobile), 2 col (tablet), 4 col (desktop)

---

## 🔐 Privacy & Security

✅ **Zero External APIs** — No calls to third-party servers  
✅ **100% Client-Side** — All processing in your browser  
✅ **No User Accounts** — No logins, no data collection  
✅ **No File Uploads** — Files stay on your device  
✅ **No Tracking** — No analytics, no ads, no cookies  
✅ **WASM-Based Tools** — Heavy processing via WebAssembly for speed  

**LocalStorage Usage**
- GPA calculator data
- Deadline tracker entries
- Resume/CV progress
- Timetable schedules

All data is stored locally on your device and can be cleared anytime. We have **zero access** to it.

---

## 🌐 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome  | ✅ 90+  | Full support, best performance |
| Firefox | ✅ 88+  | Full support |
| Safari  | ✅ 14+  | Full support (except HEIC on some versions) |
| Edge    | ✅ 90+  | Full support |

---

## 📋 License

MIT License — See [LICENSE](./LICENSE) file for details.

Built for students. Free forever. No strings attached.

---

## 👨‍💻 Author

**M Abu Hurairah**

- 🌐 Portfolio: [hurairahtools.com](https://hurairahtools.com)
- 💼 LinkedIn: [M Abu Hurairah](https://linkedin.com/in/hurairah)
- 🐙 GitHub: [@ITZ-HURAIRAH18](https://github.com/ITZ-HURAIRAH18)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Feedback & Support

Have suggestions? Found a bug? Questions about a tool?

- Open an issue on [GitHub](https://github.com/ITZ-HURAIRAH18/HurairahTools/issues)
- Email: hello@hurairahtools.com

---

**Built with ❤️ by M Abu Hurairah**

*Because every student deserves free, powerful tools. No catch. No compromise. Forever.* 
