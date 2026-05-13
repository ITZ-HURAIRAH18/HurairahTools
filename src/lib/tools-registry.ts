import { Tool } from '@/types/tool';

export const tools: Tool[] = [
  // PDF TOOLS
  { slug: 'pdf-merge', title: 'PDF Merge', description: 'Combine multiple PDFs into a single document.', category: 'pdf', icon: 'FilePlus2', tags: ['pdf', 'merge', 'combine', 'join'] },
  { slug: 'pdf-split', title: 'PDF Split', description: 'Extract specific page ranges from a PDF.', category: 'pdf', icon: 'Scissors', tags: ['pdf', 'split', 'extract', 'cut'] },
  { slug: 'pdf-compress', title: 'PDF Compress', description: 'Reduce the file size of your PDF documents.', category: 'pdf', icon: 'Minimize2', tags: ['pdf', 'compress', 'reduce', 'size'] },
  { slug: 'pdf-to-jpg', title: 'PDF to JPG', description: 'Convert PDF pages into high-quality JPG images.', category: 'pdf', icon: 'Image', tags: ['pdf', 'jpg', 'convert', 'image'] },
  { slug: 'jpg-to-pdf', title: 'JPG to PDF', description: 'Convert multiple images into a single PDF.', category: 'pdf', icon: 'FileImage', tags: ['jpg', 'png', 'image', 'pdf', 'convert'] },
  { slug: 'pdf-to-word', title: 'PDF to Word', description: 'Extract text from PDF and export as .docx.', category: 'pdf', icon: 'FileText', tags: ['pdf', 'word', 'docx', 'convert', 'text'] },
  { slug: 'pdf-to-excel', title: 'PDF to Excel', description: 'Extract table data from PDF to an Excel file.', category: 'pdf', icon: 'Table', tags: ['pdf', 'excel', 'spreadsheet', 'xlsx', 'table'] },
  { slug: 'pdf-rotate', title: 'PDF Rotate', description: 'Rotate pages in a PDF document.', category: 'pdf', icon: 'RotateCw', tags: ['pdf', 'rotate', 'turn'] },
  { slug: 'pdf-delete-pages', title: 'Delete PDF Pages', description: 'Remove specific pages from a PDF document.', category: 'pdf', icon: 'FileMinus2', tags: ['pdf', 'delete', 'remove', 'pages'] },
  { slug: 'pdf-page-numbers', title: 'Add Page Numbers', description: 'Insert page numbers into a PDF.', category: 'pdf', icon: 'ListOrdered', tags: ['pdf', 'page numbers', 'insert'] },
  { slug: 'pdf-watermark', title: 'PDF Watermark', description: 'Add a text watermark to every page in a PDF.', category: 'pdf', icon: 'Droplet', tags: ['pdf', 'watermark', 'stamp'] },
  { slug: 'pdf-password', title: 'PDF Password', description: 'Protect your PDF with AES-256 encryption.', category: 'pdf', icon: 'Lock', tags: ['pdf', 'password', 'protect', 'encrypt', 'security'] },

  // IMAGE TOOLS
  { slug: 'image-compressor', title: 'Image Compressor', description: 'Compress images with adjustable quality.', category: 'image', icon: 'Minimize', tags: ['image', 'compress', 'reduce', 'quality'] },
  { slug: 'image-resizer', title: 'Image Resizer', description: 'Resize images to specific dimensions.', category: 'image', icon: 'Scaling', tags: ['image', 'resize', 'dimensions', 'width', 'height'] },
  { slug: 'image-converter', title: 'Image Converter', description: 'Convert between JPG, PNG, WebP, and HEIC.', category: 'image', icon: 'Repeat', tags: ['image', 'convert', 'jpg', 'png', 'webp', 'heic'] },
  { slug: 'background-remover', title: 'Background Remover', description: 'Remove image backgrounds locally using AI.', category: 'image', icon: 'Eraser', tags: ['image', 'background', 'remove', 'transparent', 'ai'] },
  { slug: 'image-cropper', title: 'Image Cropper', description: 'Crop images with preset aspect ratios.', category: 'image', icon: 'Crop', tags: ['image', 'crop', 'cut', 'ratio'] },
  { slug: 'bulk-image-resizer', title: 'Bulk Image Resizer', description: 'Resize multiple images at once and download as ZIP.', category: 'image', icon: 'Layers', tags: ['image', 'bulk', 'resize', 'multiple', 'zip'] },
  { slug: 'image-to-base64', title: 'Image to Base64', description: 'Convert an image to a Base64 data URI.', category: 'image', icon: 'Code', tags: ['image', 'base64', 'encode', 'uri'] },
  { slug: 'add-watermark', title: 'Add Watermark', description: 'Overlay a text watermark on an image.', category: 'image', icon: 'Stamp', tags: ['image', 'watermark', 'overlay'] },
  { slug: 'color-picker', title: 'Color Picker', description: 'Sample colors from an image.', category: 'image', icon: 'Pipette', tags: ['image', 'color', 'picker', 'sample', 'hex', 'rgb'] },
  { slug: 'metadata-viewer', title: 'Metadata Viewer', description: 'Extract EXIF data from images (camera model, GPS, etc.).', category: 'image', icon: 'Info', tags: ['image', 'metadata', 'exif', 'info', 'gps'] },

  // DEVELOPER TOOLS
  { slug: 'json-formatter', title: 'JSON Formatter', description: 'Format, minify, and validate JSON.', category: 'developer', icon: 'Braces', tags: ['developer', 'json', 'format', 'minify', 'validate'] },
  { slug: 'jwt-decoder', title: 'JWT Decoder', description: 'Decode and inspect JSON Web Tokens.', category: 'developer', icon: 'Key', tags: ['developer', 'jwt', 'decode', 'token', 'auth'] },
  { slug: 'base64-tool', title: 'Base64 Tool', description: 'Encode and decode Base64 strings.', category: 'developer', icon: 'Binary', tags: ['developer', 'base64', 'encode', 'decode'] },
  { slug: 'url-encoder', title: 'URL Encoder', description: 'Encode and decode URLs and parse query parameters.', category: 'developer', icon: 'Link', tags: ['developer', 'url', 'encode', 'decode', 'query'] },
  { slug: 'regex-tester', title: 'Regex Tester', description: 'Test regular expressions with real-time highlighting.', category: 'developer', icon: 'Regex', tags: ['developer', 'regex', 'test', 'match', 'expression'] },
  { slug: 'hash-generator', title: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.', category: 'developer', icon: 'Hash', tags: ['developer', 'hash', 'md5', 'sha', 'generate'] },
  { slug: 'uuid-generator', title: 'UUID Generator', description: 'Generate multiple v4 UUIDs quickly.', category: 'developer', icon: 'Fingerprint', tags: ['developer', 'uuid', 'guid', 'generate', 'random'] },
  { slug: 'lorem-ipsum', title: 'Lorem Ipsum Generator', description: 'Generate random placeholder text.', category: 'developer', icon: 'Type', tags: ['developer', 'lorem', 'ipsum', 'placeholder', 'text'] },
  { slug: 'color-converter', title: 'Color Converter', description: 'Convert between HEX, RGB, HSL, and CMYK.', category: 'developer', icon: 'Palette', tags: ['developer', 'color', 'convert', 'hex', 'rgb', 'hsl', 'cmyk'] },
  { slug: 'markdown-editor', title: 'Markdown Editor', description: 'Write and preview Markdown with real-time rendering.', category: 'developer', icon: 'PenTool', tags: ['developer', 'markdown', 'editor', 'preview', 'md'] },
  { slug: 'diff-checker', title: 'Diff Checker', description: 'Compare two text blocks and highlight the differences.', category: 'developer', icon: 'Diff', tags: ['developer', 'diff', 'compare', 'text', 'differences'] },
  { slug: 'cron-parser', title: 'Cron Parser', description: 'Parse cron expressions into human-readable text.', category: 'developer', icon: 'Clock', tags: ['developer', 'cron', 'parse', 'time', 'schedule'] },
  { slug: 'code-formatter', title: 'Code Formatter', description: 'Format JS, TS, CSS, HTML, and JSON code.', category: 'developer', icon: 'Code2', tags: ['developer', 'code', 'format', 'prettier', 'beautify'] },
  { slug: 'css-minifier', title: 'CSS Minifier', description: 'Minify CSS code to reduce file size.', category: 'developer', icon: 'FileJson', tags: ['developer', 'css', 'minify', 'compress'] },
  { slug: 'html-minifier', title: 'HTML Minifier', description: 'Minify HTML code for production use.', category: 'developer', icon: 'FileCode2', tags: ['developer', 'html', 'minify', 'compress'] },

  // UNIVERSITY TOOLS
  { slug: 'gpa-calculator', title: 'GPA Calculator', description: 'Calculate semester and cumulative GPA.', category: 'university', icon: 'Calculator', tags: ['university', 'gpa', 'calculator', 'grades', 'cgpa'] },
  { slug: 'deadline-tracker', title: 'Deadline Tracker', description: 'Track assignments and deadlines.', category: 'university', icon: 'CalendarDays', tags: ['university', 'deadline', 'tracker', 'assignments', 'tasks'] },
  { slug: 'citation-generator', title: 'Citation Generator', description: 'Generate APA, MLA, Chicago, and IEEE citations.', category: 'university', icon: 'Quote', tags: ['university', 'citation', 'generator', 'apa', 'mla', 'reference'] },
  { slug: 'plagiarism-checker', title: 'Plagiarism Checker', description: 'Compare text locally for similarity.', category: 'university', icon: 'SearchCheck', tags: ['university', 'plagiarism', 'checker', 'similarity', 'compare'] },
  { slug: 'word-counter', title: 'Word Counter', description: 'Count words, characters, and reading time.', category: 'university', icon: 'BarChart2', tags: ['university', 'word', 'counter', 'characters', 'reading time'] },
  { slug: 'pomodoro-timer', title: 'Pomodoro Timer', description: 'Customizable focus timer with ambient sounds.', category: 'university', icon: 'Timer', tags: ['university', 'pomodoro', 'timer', 'focus', 'study'] },
  { slug: 'unit-converter', title: 'Unit Converter', description: 'Convert various units of measurement.', category: 'university', icon: 'ArrowRightLeft', tags: ['university', 'unit', 'converter', 'measurements'] },
  { slug: 'equation-evaluator', title: 'Equation Evaluator', description: 'Safely evaluate math expressions.', category: 'university', icon: 'FunctionSquare', tags: ['university', 'equation', 'evaluator', 'math', 'calculator'] },
  { slug: 'resume-builder', title: 'Resume Builder', description: 'Create and download a professional CV.', category: 'university', icon: 'FileUser', tags: ['university', 'resume', 'builder', 'cv', 'maker'] },
  { slug: 'timetable-builder', title: 'Timetable Builder', description: 'Design your weekly class schedule.', category: 'university', icon: 'CalendarRange', tags: ['university', 'timetable', 'builder', 'schedule', 'classes'] },
];
