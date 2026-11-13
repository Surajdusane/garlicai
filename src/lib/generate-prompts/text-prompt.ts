// ─────────────────────────────────────────────────────────────────────────────
//  typed text → prompts
// ─────────────────────────────────────────────────────────────────────────────

import chalk from "chalk";
import { askOutputFolder, getErrorMessage, printSection } from "@/utils";
import { input } from "@inquirer/prompts";
import { generateSlidePromptsFromText, saveSlidePrompts } from "@/lib/ai";
import ora from "ora";

export async function promptsFromText() {
  printSection("Text → Prompt Files");

  console.log(chalk.dim("  Type or paste your topic / content below.\n  Press Enter twice when done.\n"));

  const userText = await input({
    message: "Your content / topic:",
    validate: (v) => v.trim().length > 5 || "Please enter at least a sentence",
  });

  const outputFolder = await askOutputFolder("Folder name to save prompt files in:");
  if (!outputFolder) return;

  const spinner = ora("Generating slide prompts from text…").start();
  try {
    const slides = await generateSlidePromptsFromText(userText);
    spinner.succeed("Prompts generated!");
    await saveSlidePrompts(slides, outputFolder);
  } catch (err) {
    spinner.fail(chalk.red("AI error: " + getErrorMessage(err)));
  }
}
