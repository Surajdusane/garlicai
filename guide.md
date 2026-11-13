# 🎠 GarlicAI — Complete User Guide

## What is GarlicAI?

GarlicAI is a terminal-based tool that helps you create carousel post images for Instagram, LinkedIn, Twitter, etc. using AI. It uses OpenAI to generate both the content (text prompts) and the actual images.

---

## 📁 Project Structure

```
carousleterminal/
├── src/                          # Source code
│   ├── index.ts                  # Entry point: setup → theme → main menu
│   ├── assets/
│   │   ├── prompts/              # System prompts for AI
│   │   └── pdf/                  # WASM binary for PDF rendering
│   ├── lib/
│   │   ├── ai/                   # OpenAI API calls (text → prompts, PDF → prompts)
│   │   ├── clients/              # OpenAI client setup
│   │   ├── copy-prompts/         # Copy PDF→carousel prompt to clipboard
│   │   ├── generate-images/      # Text→Images & Image→Image logic
│   │   ├── generate-prompts/     # 4 methods to create prompt files
│   │   ├── imageai/              # Single image generation using GPT-Image-2
│   │   ├── menu/                 # Interactive menu screens
│   │   ├── prompt/               # Prompt builders for clipboard
│   │   ├── setup/                # First-time API key setup
│   │   └── theme/                # Theme color/font setup
│   ├── utils/                    # Helper functions (file, terminal, colors, clipboard)
│   └── constents/                # Constants (config file paths, fonts, model names)
├── dist/                         # Built npm package
├── gen/                          # Where generated files are saved
├── setup.json                    # Your OpenAI API key (auto-generated)
├── theme.json                    # Your theme color + font (auto-generated)
├── package.json                  # "garlicai" npm package
└── guide.md                      # THIS FILE
```

### Key Files You'll See

| File/Folder | Purpose |
|---|---|
| `setup.json` | Stores your OpenAI API key (created automatically during setup) |
| `theme.json` | Stores your chosen color & font theme (created automatically during setup) |
| `gen/` folder | All generated prompt files and images go here |
| `slide-1.txt`, `slide-2.txt`... | Individual slide prompt files created by "Generate Prompts" |
| `slide-1.png`, `slide-2.png`... | Individual slide images created by "Generate Images" |

---

## 🚀 Getting Started (First Time)

### Prerequisites

- **Node.js 18+** installed on your computer
- An **OpenAI API key** (get one from https://platform.openai.com/api-keys)

### Step 1: Start GarlicAI

Open a terminal/command prompt in an **empty folder** and run:

```
npx garlicai
```

> If the folder is empty, GarlicAI will automatically take you through Setup on first run.

---

## 1️⃣ First-Time Setup: API Key + Theme

When you run `npx garlicai` for the first time (or if `setup.json` is missing), you will see:

### Step A: Enter OpenAI API Key

1. The tool asks: **"Enter your OpenAI API key"**
2. Paste your key (starts with `sk-...`)
3. It validates the key automatically
4. On success, the key is saved to `setup.json` in your current folder

### Step B: Choose Theme

After the API key is saved, you're asked to set up a **theme**:

1. **Enter a hex color** — e.g. `#E53935` (red), `#548125` (green), `#1E88E5` (blue)
   - The tool checks if the color is readable on a dark background
   - Type `y` to confirm if it warns about low contrast
   - You'll see a preview of the color
2. **Choose a font** — Select from a list (Inter, Montserrat, Poppins, etc.)
3. **Optional instructions** — You can add special instructions for image generation (e.g. "make it look like a torn paper collage"). Press Enter to skip.

The theme is saved to `theme.json`.

### Changing Setup Later

From the main menu, choose **"Edit Settings"** →
- **"Update OpenAI API key"** — lets you enter a new key
- **"Edit theme"** — lets you pick a new color/font

---

## 2️⃣ Main Menu Overview

After setup, you see the **Main Menu** with these options:

```
1. Generate Prompts     → Create slide prompt files
2. Generate Images      → Create slide images from prompts
3. Edit Settings        → Change API key or theme
4. Copy Prompts         → Copy special prompts to clipboard
5. PDF to Images        → Convert PDF pages to PNG images
6. Exit                 → Quit the program
```

---

## 3️⃣ Method A: Generate Images Using Prompts (Text → Image)

This method lets you create a full carousel from an **existing carousel PDF** plus **AI-generated prompts**.

### Complete Step-by-Step Workflow

#### Step 1: Download your existing carousel as PDF

1. Use a Chrome extension (like "Save as PDF" or any carousel downloader) to download your reference carousel post
2. Save the PDF file in the **same folder** where you ran `npx garlicai`

#### Step 2: Copy the PDF→Carousel prompt to clipboard

From the main menu, choose **"Copy Prompts"** → **"Copy PDF → Carousel Prompt"**

This copies a special instruction prompt to your clipboard. This prompt tells AI how to analyze a PDF and generate carousel slide prompts.

#### Step 3: Use ChatGPT (or any AI website)

1. Go to ChatGPT (chat.openai.com) or any AI chat website
2. Upload your PDF file to the chat
3. Paste the prompt you copied in Step 2
4. The AI will analyze the PDF and return a **JSON array** like:
   ```json
   ["slide 1 prompt", "slide 2 prompt", "slide 3 prompt", ...]
   ```
5. Copy this JSON output and save it as a `.json` file in your working folder (e.g. `carousel-output.json`)

> **Where to save the JSON file?** Save it in the same folder where you're running `npx garlicai`. You can use any name like `mycarousel.json`.

#### Step 4: Convert JSON → prompt files

From the main menu, choose **"Generate Prompts"** → **"Convert AI result (JSON file) → prompt files"**

1. Select your JSON file from the list
2. Type a **folder name** to save prompts in (e.g. `my-prompts`)
   - The tool will create this folder inside your current directory
3. The tool reads the JSON array and creates one `.txt` file per slide
   - `my-prompts/slide-1.txt`
   - `my-prompts/slide-2.txt`
   - etc.

Each `.txt` file contains a detailed image-generation prompt for one carousel slide.

#### Step 5: Generate images from the prompt files

From the main menu, choose **"Generate Images"** → **"Generate Images Using Prompts"**

1. **Select the source folder** — Choose the folder you created in Step 4 (e.g. `my-prompts`)
2. **Select which prompts to use** — Check the boxes for the slides you want to generate (or select all)
3. **Enter output folder name** — Type a name for the images folder (e.g. `my-images`)
4. **Choose confirmation mode:**
   - **"Generate ALL selected images"** — generates all at once after one confirmation
   - **"Confirm each image individually"** — asks before generating each slide
   - **"Cancel"** — go back
5. The tool calls OpenAI's GPT-Image-2 and generates `slide-1.png`, `slide-2.png`, etc. in the output folder

Done! Your carousel slide images are ready in the folder you specified.

---

## 4️⃣ Other Ways to Generate Prompts

Under **"Generate Prompts"** in the main menu, you have 4 options:

### Option A: JSON → Prompt Files (explained above)
Use when you already have AI-generated JSON output.

### Option B: PDF → Carousel Prompts
Upload a PDF directly to GarlicAI, and it sends the PDF to OpenAI to generate slide prompts automatically.

1. Select **"PDF → carousel prompts"**
2. Choose your PDF file
3. Type an output folder name
4. GarlicAI sends the PDF to OpenAI and saves the resulting slide prompts as `.txt` files

### Option C: PDF + Text Modifier → Carousel Prompts
Same as above, but you can add a `.txt` file with extra instructions to guide the AI.

1. Select **"PDF + text modifier → carousel prompts"**
2. Choose your PDF file
3. Choose a `.txt` modifier file (write your instructions in a text file)
4. Type an output folder name

### Option D: Type/Paste Text → Prompts
Just type or paste your topic/content directly:

1. Select **"Type / paste text directly → prompts"**
2. Enter your text (e.g. "Create 5 carousel slides about climate change tips")
3. Type an output folder name

---

## 5️⃣ Method B: Generate Images Using Image + Text (Image-to-Image)

This method lets you **edit existing images** using a text prompt. You take a PDF, convert it to images, then apply a prompt to modify them.

### Complete Step-by-Step Workflow

#### Step 1: Download PDF and prepare

1. Download your PDF (e.g. an existing carousel post)
2. Save the PDF in the same folder where you're running `npx garlicai`
3. **Create a `.txt` file** with your editing prompt (e.g. `edit.txt`)
   - Example content: *"Change the background to dark mode, make text white, add gradient overlay"*
   - Save it in the same folder

#### Step 2: Convert PDF to Images

From the main menu, choose **"PDF to Images"**

1. **Select your PDF file** from the list
2. **Type a folder name** for the output images (e.g. `my-pages`)
3. The tool converts each page of the PDF into a PNG image (e.g. `page-01.png`, `page-02.png`...)

#### Step 3: Generate Edited Images

From the main menu, choose **"Generate Images"** → **"Images + Text to Image"**

1. **Select the folder** containing the images you just created (e.g. `my-pages`)
2. **Select which images** to edit (check the boxes)
3. **Select the prompt `.txt` file** you created in Step 1 (e.g. `edit.txt`)
   - This prompt will be applied to **all** selected images
4. **Enter output folder name** for edited images (e.g. `edited-images`)
5. **Choose confirmation mode:**
   - **"Generate ALL"** — edit all images at once
   - **"Confirm each"** — confirm before each edit
   - **"Cancel"** — go back
6. The tool sends each image + your prompt to OpenAI GPT-Image-2 and saves the edited images as `page-01_edited.png`, `page-02_edited.png`, etc.

---

## 6️⃣ Menu Reference

### Main Menu

| Option | What it does |
|---|---|
| **Generate Prompts** | Creates `.txt` prompt files (4 methods: JSON, PDF, PDF+text, typed text) |
| **Generate Images** | Creates `.png` images from prompts (text→image OR image+text→image) |
| **Edit Settings** | Change your OpenAI API key or theme (color/font) |
| **Copy Prompts** | Copy special prompts to your clipboard for use with ChatGPT |
| **PDF to Images** | Convert any PDF pages into PNG images |
| **Exit** | Quit GarlicAI |

### Generate Prompts Submenu

| Option | When to use |
|---|---|
| **Convert AI result (JSON file) → prompt files** | When you already have AI-generated JSON from ChatGPT |
| **PDF → carousel prompts** | When you want AI to analyze a PDF directly |
| **PDF + text modifier → carousel prompts** | When you want AI to analyze PDF with extra instructions |
| **Type / paste text directly → prompts** | When you just have an idea/topic in mind |

### Generate Images Submenu

| Option | When to use |
|---|---|
| **Generate Images Using Prompts** | When you have `.txt` prompt files and want to create images from them |
| **Images + Text to Image** | When you have existing images + a text prompt and want to edit/modify them |

---

## ⚠️ Important Notes

- **Cost**: Each image generated costs ~$0.02–0.08 (paid to OpenAI). Be mindful of how many images you generate.
- **File naming**: Use only letters, numbers, hyphens `-`, and underscores `_` for folder names.
- **Folder names must be unique**: If a folder already exists, you'll be asked to pick a different name.
- **Supported image formats** for image-to-image: PNG, JPG, JPEG, WEBP, GIF
- **Your API key** is stored in `setup.json` in plain text. Keep this file safe and don't share it.

## ❓ FAQ

**Q: What is the "Copy Prompts" option for?**
A: It copies a special system prompt to your clipboard. You can paste this prompt into ChatGPT along with a PDF to get high-quality carousel JSON results.

**Q: Do I need to use ChatGPT? Can I use other AI?**
A: Yes, the "Copy Prompts" option gives you a prompt you can use with any AI chatbot (ChatGPT, Claude, Gemini, etc.). The JSON → Prompt Files method works with any AI that outputs JSON format.

**Q: What size are the generated images?**
A: Images are generated at 1024×1280 pixels (portrait orientation, ideal for Instagram/LinkedIn carousels).
