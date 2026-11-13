import path from "path";

import { getOpenAIClient } from "@/lib/clients";
import {
  info,
  loadJson,
  readBinaryFile,
  success,
  writeTextFile
} from "@/utils";

import { CHAT_MODEL, CWD, THEME_FILE } from "@/constents/config";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Theme {
  themeColor: string;
  font: string;
  instructions?: string;
}

export interface SlidePrompt {
  number: number;
  prompt: string;
}

interface SlidesResponse {
  slides: SlidePrompt[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM PROMPTS
// ─────────────────────────────────────────────────────────────────────────────

function buildPromptSystemPrompt(theme: Theme): string {
  return `You are a professional carousel content strategist and visual designer.
Your job is to convert source content into a series of carousel slide image-generation prompts.

THEME CONTEXT:
- Primary colour for Text Heightliting: ${theme.themeColor}
- Font style: ${theme.font}
- Extra instructions: ${theme.instructions || "none"}

OUTPUT RULES (CRITICAL):
1. Return ONLY a JSON object — no markdown fences, no preamble, no extra text.
2. Format: { "slides": [ { "number": 1, "prompt": "..." }, ... ] }
3. Each "prompt" must be a self-contained, detailed image generation prompt (100–200 words).
4. Each slide prompt must include:
   - The exact content for that slide (title / key point / data / quote)
   - Visual style: clean, modern, infographic-style carousel slide
   - Colour palette: use ${theme.themeColor} as accent/highlight on a dark or black background
   - Typography feel: ${theme.font} font family, bold headline, minimal body text
   - Layout: clearly described (e.g., "centered text, left-aligned stats, full-bleed image")
   - No real people, no logos, no copyrighted elements
5. Generate between 5 and 10 slides depending on the depth of the content.
6. Slide 1 should always be a visually striking COVER slide with a title.
7. The last slide should be a CALL-TO-ACTION or summary slide.`;
}

function buildImageSystemPrompt(theme: Theme): string {
  return `You are refining a carousel slide image prompt for GPT-Image generation.
Theme: accent colour ${theme.themeColor}, font family ${theme.font}.
${theme.instructions ? "Extra: " + theme.instructions : ""}
Return only the refined, single-paragraph image prompt — no JSON, no commentary.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEXT / JSON → SLIDES
// ─────────────────────────────────────────────────────────────────────────────

export async function generateSlidePromptsFromText(
  sourceText: string
): Promise<SlidePrompt[]> {
  const theme = await loadJson(THEME_FILE) as Theme;
  const client = await getOpenAIClient();

  const response = await client.chat.completions.create({
    model: CHAT_MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: buildPromptSystemPrompt(theme),
      },
      {
        role: "user",
        content: `Source content:\n\n${sourceText}`,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content;

  if (!raw) {
    throw new Error("No content returned from model.");
  }

  const parsed = JSON.parse(raw) as SlidesResponse;

  return parsed.slides;
}

// ─────────────────────────────────────────────────────────────────────────────
// PDF → SLIDES
// ─────────────────────────────────────────────────────────────────────────────

export async function generateSlidePromptsFromPdf(
  pdfPath: string,
  extraText = ""
): Promise<SlidePrompt[]> {
  const theme = await loadJson(THEME_FILE) as Theme;
  const client = await getOpenAIClient();

  const pdfBuffer = await readBinaryFile(path.join(CWD, pdfPath));
  const base64Pdf = pdfBuffer.toString("base64");

  const userContent: Array<
    | {
        type: "file";
        file: {
          filename: string;
          file_data: string;
        };
      }
    | {
        type: "text";
        text: string;
      }
  > = [
    {
      type: "file",
      file: {
        filename: path.basename(pdfPath),
        file_data: `data:application/pdf;base64,${base64Pdf}`,
      },
    },
  ];

  if (extraText) {
    userContent.push({
      type: "text",
      text: `\nAdditional guidance / modifier:\n${extraText}`,
    });
  }

  userContent.push({
    type: "text",
    text: "Convert the above content into carousel slide image prompts as instructed.",
  });

  const response = await client.chat.completions.create({
    model: CHAT_MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: buildPromptSystemPrompt(theme),
      },
      {
        role: "user",
        content: userContent,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content;

  if (!raw) {
    throw new Error("No content returned from model.");
  }

  const parsed = JSON.parse(raw) as SlidesResponse;

  return parsed.slides;
}

// ─────────────────────────────────────────────────────────────────────────────
// SAVE SLIDE PROMPTS TO FOLDER
// ─────────────────────────────────────────────────────────────────────────────

export async function saveSlidePrompts(
  slides: SlidePrompt[],
  outputFolder: string
): Promise<void> {
  for (const slide of slides) {
    const fileName = `slide-${slide.number}.txt`;
    const filePath = path.join(CWD, outputFolder, fileName);

    await writeTextFile(filePath, slide.prompt);

    info(`Saved ${outputFolder}/${fileName}`);
  }

  success(`${slides.length} prompt files written to ${outputFolder}/`);
}