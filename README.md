# GarlicAI 🧄

Generate AI-powered carousel content and images from PDFs, text, and custom prompts directly from your terminal.

GarlicAI is an interactive CLI tool that helps creators, marketers, founders, and educators generate social-media carousel slides using OpenAI models and GPT-Image.

---

## Features

* 📄 Convert PDFs into carousel slide content
* ✍️ Generate carousel copy from text prompts
* 🖼️ Generate slide images with GPT-Image
* 📋 Copy generated prompts to clipboard
* 🎨 Configurable themes and settings
* ⚡ Fast interactive terminal experience
* 🤖 Powered by OpenAI

---

## Installation

### Global Installation

```bash
npm install -g garlicai
```

### Run with npx

```bash
npx garlicai
```

---

## Requirements

* Node.js 18+
* OpenAI API Key

---

## Setup

Create an OpenAI API key and export it as an environment variable:

```bash
export OPENAI_API_KEY="your_api_key"
```

Or create a `.env` file:

```env
OPENAI_API_KEY=your_api_key
```

---

## Usage

Start the CLI:

```bash
garlic
```

You will be guided through an interactive menu where you can:

* Generate carousel content from PDFs
* Generate carousel content from text
* Generate image prompts
* Generate slide images
* Copy prompts
* Update settings

---

## Example Workflow

### 1. Convert PDF → Carousel

```text
PDF
 ↓
AI Analysis
 ↓
Carousel Slides
 ↓
slide-1.txt
slide-2.txt
slide-3.txt
...
```

### 2. Generate Images

```text
Carousel Slides
 ↓
Image Prompts
 ↓
GPT-Image
 ↓
slide-1.png
slide-2.png
slide-3.png
...
```

## Development

Install dependencies:

```bash
bun install
```

Run in development mode:

```bash
bun run dev
```

Build:

```bash
bun run build
```

---

## Publishing

Verify package contents:

```bash
npm pack --dry-run
```

Publish:

```bash
npm publish
```

---

## Configuration

GarlicAI stores configuration in:

```text
setup.json
theme.json
```

You can edit these files directly or through the CLI settings menu.

---

## Output

Generated files are stored inside the `gen/` directory:

```text
gen/
 ├── slide-1.txt
 ├── slide-2.txt
 ├── slide-3.txt
 ├── slide-1.png
 ├── slide-2.png
 └── slide-3.png
```

---

## Tech Stack

* TypeScript
* Bun
* OpenAI SDK
* GPT-Image
* Inquirer
* Chalk
* Ora

---

## License

MIT

---

## Author

Built with ❤️ by the GarlicAI team.



This is pdf file of existing carousle post and i want to recreate this post analyse this pdf visials and text content and give me image geration prompts from this json arreay format like ["first slide prompt", "second slide prompt", ...] — no markdown fences, no preamble, no extra text.
INSTRUCTIONS: 
Dont include exsitng page branding or any other branding including text, profile picture, mention id
