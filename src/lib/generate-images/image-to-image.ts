import { checkbox, confirm, select } from "@inquirer/prompts";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";

import { CWD, THEME_FILE } from "@/constents/config";
import { getOpenAIClient } from "@/lib/clients";
import { generateImageToSingleGPT2Image } from "@/lib/imageai/image-to-gpt-2-image";
import {
    askOutputFolder,
    errorMsg,
    findFiles,
    findFilesInFolder,
    findFolders,
    info,
    loadJson,
    printSection,
    warn
} from "@/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Theme {
  themeColor: string;
  font: string;
  instructions?: string;
}

// Supported image extensions
const SUPPORTED_IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif"];

// ─────────────────────────────────────────────────────────────────────────────

export async function generateImageToCarouselImages(): Promise<void> {
  printSection("Generate Image to Carousel Images (Edit with Prompt)");

  // ── Step 1: Pick source folder containing images ─────────────────────────
  const folders: string[] = await findFolders();

  if (folders.length === 0) {
    errorMsg(
      "No folders found. Please create a folder with images first.",
    );
    return;
  }

  const sourceFolder: string = await select({
    message: "Select folder containing images to edit:",
    choices: folders.map((f) => ({
      name: f,
      value: f,
    })),
  });

  // ── Step 2: Check if folder contains any images ──────────────────────────
  let allImageFiles: string[] = [];
  
  for (const ext of SUPPORTED_IMAGE_EXTENSIONS) {
    const files = await findFilesInFolder(sourceFolder, ext);
    allImageFiles.push(...files);
  }

  if (allImageFiles.length === 0) {
    errorMsg(
      `Folder "${sourceFolder}" does not contain any supported images.\n` +
      `Supported formats: ${SUPPORTED_IMAGE_EXTENSIONS.join(", ")}`
    );
    return;
  }

  info(`Found ${allImageFiles.length} image(s) in folder.`);

  // ── Step 3: Pick which images to edit ────────────────────────────────────
  const chosenImages: string[] = await checkbox({
    message: `Select images to edit (${allImageFiles.length} available):`,
    choices: allImageFiles.map((f) => ({
      name: path.basename(f),
      value: f,
    })),
    validate: (choices) => choices.length > 0 || "Select at least one image",
  });

  if (chosenImages.length === 0) {
    warn("No images selected. Returning to menu.");
    return;
  }

  // ── Step 4: Pick prompt .txt file ────────────────────────────────────────
  const promptFiles: string[] = await findFiles("txt");

  if (promptFiles.length === 0) {
    errorMsg(
      "No .txt prompt files found. Create a prompt file first.",
    );
    return;
  }

  const chosenPromptFile: string = await select({
    message: "Select prompt .txt file (will be used for ALL selected images):",
    choices: promptFiles.map((f) => ({
      name: path.basename(f),
      value: f,
    })),
  });

  // ── Step 5: Output folder ─────────────────────────────────────────────────
  const outputFolder = await askOutputFolder(
    "Folder name to save edited images in:",
  );

  if (!outputFolder) {
    return;
  }

  // ── Step 6: Confirm strategy ──────────────────────────────────────────────
  console.log(
    "\n" +
      chalk.yellow(
        `⚠  You are about to generate up to ${chosenImages.length} edited image(s).\n` +
        `   Prompt file: ${path.basename(chosenPromptFile)}\n` +
        "   Each image uses the OpenAI Images API and incurs a cost (~$0.02–0.08 per image).",
      ),
  );

  const strategy = await select<"all" | "each" | "cancel">({
    message: "How do you want to confirm each generation?",
    choices: [
      {
        name: "✅  Generate ALL selected images (one confirmation only)",
        value: "all",
      },
      {
        name: "🔍  Confirm each image individually",
        value: "each",
      },
      {
        name: "✖   Cancel — go back",
        value: "cancel",
      },
    ],
  });

  if (strategy === "cancel") {
    return;
  }

  if (strategy === "all") {
    const go: boolean = await confirm({
      message: `Generate all ${chosenImages.length} edited image(s) now?`,
      default: false,
    });

    if (!go) {
      return;
    }
  }

  // ── Step 7: Generate edited images ────────────────────────────────────────
  let generated = 0;
  let skipped = 0;

  const outPath = path.join(CWD, outputFolder);

  await fs.mkdir(outPath, { recursive: true });

  const theme = (await loadJson(THEME_FILE)) as Theme;
  const client = await getOpenAIClient();

  for (const imageFile of chosenImages) {
    const imageBaseName = path.basename(imageFile, path.extname(imageFile));
    const outputName = `${imageBaseName}_edited.png`;

    if (strategy === "each") {
      const go: boolean = await confirm({
        message: `Generate "${outputName}" from "${path.basename(imageFile)}"? (costs tokens)`,
        default: false,
      });

      if (!go) {
        info(`Skipped ${outputName}`);
        skipped++;
        continue;
      }
    }

    await generateImageToSingleGPT2Image({
      client,
      promptFile: chosenPromptFile,
      outputPath: path.join(outPath, outputName),
      outputName,
      outputFolder,
      referenceImage: imageFile,
    });

    generated++;
  }

  console.log(
    "\n" +
      chalk.bold(`  Done: ${generated} generated, ${skipped} skipped.`) +
      "\n",
  );
}