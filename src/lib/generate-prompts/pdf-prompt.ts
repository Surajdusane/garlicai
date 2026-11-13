// ─────────────────────────────────────────────────────────────────────────────
//  PDF → prompts
// ─────────────────────────────────────────────────────────────────────────────

import { select } from "@inquirer/prompts";
import { askOutputFolder, errorMsg, findFiles, getErrorMessage, printSection } from "@/utils";
import { generateSlidePromptsFromPdf, saveSlidePrompts } from "@/lib/ai";
import ora from "ora";
import chalk from "chalk";

export async function promptsFromPdf() {
  printSection("PDF → Prompt Files");

  const pdfFiles = await findFiles("pdf");
  if (pdfFiles.length === 0) {
    errorMsg("No .pdf files found in this folder (or subfolders).");
    return;
  }

  const chosen = await select({
    message: "Select the PDF file:",
    choices: pdfFiles.map((f) => ({ name: f, value: f })),
  });

  const outputFolder = await askOutputFolder("Folder name to save prompt files in:");
  if (!outputFolder) return;

  const spinner = ora("Sending PDF to AI — generating slide prompts…").start();
  try {
    const slides = await generateSlidePromptsFromPdf(chosen);
    spinner.succeed("Prompts generated!");
    await saveSlidePrompts(slides, outputFolder);
  } catch (err) {
    spinner.fail(chalk.red("AI error: " + getErrorMessage(err)));
  }
}