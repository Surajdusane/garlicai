// ─────────────────────────────────────────────────────────────────────────────
//  PDF + text modifier → prompts
// ─────────────────────────────────────────────────────────────────────────────

import { select } from "@inquirer/prompts";
import { askOutputFolder, errorMsg, findFiles, getErrorMessage, printSection, readTextFile } from "../../utils";
import path from "node:path";
import { CWD } from "../../constents/config";
import ora from "ora";
import { generateSlidePromptsFromPdf, saveSlidePrompts } from "@/lib/ai";
import chalk from "chalk";

export async function promptsFromPdfAndText() {
  printSection("PDF + Text Modifier → Prompt Files");

  const pdfFiles = await findFiles("pdf");
  if (pdfFiles.length === 0) {
    errorMsg("No .pdf files found.");
    return;
  }

  const chosenPdf = await select({
    message: "Select the PDF file:",
    choices: pdfFiles.map((f) => ({ name: f, value: f })),
  });

  const txtFiles = await findFiles("txt");
  if (txtFiles.length === 0) {
    errorMsg("No .txt files found to use as modifier.");
    return;
  }

  const chosenTxt = await select({
    message: "Select the .txt modifier / instructions file:",
    choices: txtFiles.map((f) => ({ name: f, value: f })),
  });

  const outputFolder = await askOutputFolder("Folder name to save prompt files in:");
  if (!outputFolder) return;

  const modifierText = await readTextFile(path.join(CWD, chosenTxt));

  const spinner = ora("Sending PDF + modifier to AI…").start();
  try {
    const slides = await generateSlidePromptsFromPdf(chosenPdf, modifierText);
    spinner.succeed("Prompts generated!");
    await saveSlidePrompts(slides, outputFolder);
  } catch (err) {
    spinner.fail(chalk.red("AI error: " + getErrorMessage(err)));
  }
}