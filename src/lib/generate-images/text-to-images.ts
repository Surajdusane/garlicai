import { checkbox, confirm, select } from "@inquirer/prompts";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";

import { CWD, THEME_FILE } from "@/constents/config";
import { getOpenAIClient } from "@/lib/clients";
import { generateTextToSingleGPT2Image } from "@/lib/imageai/gpt-2-image";
import {
    askOutputFolder,
    errorMsg,
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

// ─────────────────────────────────────────────────────────────────────────────

export async function generateTextToCarouselImages(): Promise<void> {
  printSection("Generate text to Carousel Images");

  // ── Pick source folder ────────────────────────────────────────────────────
  const folders: string[] = await findFolders();

  if (folders.length === 0) {
    errorMsg(
      "No folders found. Generate prompts first (option 1 from main menu).",
    );
    return;
  }

  const sourceFolder: string = await select({
    message: "Select folder containing prompt .txt files:",
    choices: folders.map((f) => ({
      name: f,
      value: f,
    })),
  });

  // ── Pick .txt files ───────────────────────────────────────────────────────
  const txtFiles: string[] = await findFilesInFolder(sourceFolder, "txt");

  if (txtFiles.length === 0) {
    errorMsg(`No .txt files found in "${sourceFolder}".`);
    return;
  }

  const chosen: string[] = await checkbox({
    message: `Select prompt files to render (${txtFiles.length} available):`,
    choices: txtFiles.map((f) => ({
      name: path.basename(f),
      value: f,
    })),
    validate: (choices) => choices.length > 0 || "Select at least one file",
  });

  if (chosen.length === 0) {
    warn("No files selected. Returning to menu.");
    return;
  }

  // ── Output folder ─────────────────────────────────────────────────────────
  const outputFolder = await askOutputFolder(
    "Folder name to save generated images in:",
  );

  if (!outputFolder) {
    return;
  }

  // ── Confirm strategy ──────────────────────────────────────────────────────
  console.log(
    "\n" +
      chalk.yellow(
        `⚠  You are about to generate up to ${chosen.length} image(s).\n` +
          "Each image uses the OpenAI Images API and incurs a cost (~$0.02–0.08 per image).",
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
      message: `Generate all ${chosen.length} image(s) now?`,
      default: false,
    });

    if (!go) {
      return;
    }
  }

  // ── Generate ──────────────────────────────────────────────────────────────
  let generated = 0;
  let skipped = 0;

  const outPath = path.join(CWD, outputFolder);

  await fs.mkdir(outPath, { recursive: true });

  const theme = (await loadJson(THEME_FILE)) as Theme;
  const client = await getOpenAIClient();

  for (const promptFile of chosen) {
    const baseName = path.basename(promptFile, ".txt");
    const outputName = `${baseName}.png`;

    if (strategy === "each") {
      const go: boolean = await confirm({
        message: `Generate "${outputName}"? (costs tokens)`,
        default: false,
      });

      if (!go) {
        info(`Skipped ${outputName}`);
        skipped++;
        continue;
      }
    }

    await generateTextToSingleGPT2Image({
      client,
      promptFile,
      outputPath: path.join(outPath, outputName),
      outputName,
      outputFolder,
    });

    generated++;
  }

  console.log(
    "\n" +
      chalk.bold(`  Done: ${generated} generated, ${skipped} skipped.`) +
      "\n",
  );
}
