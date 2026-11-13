// ─────────────────────────────────────────────────────────────────────────────
//  JSON → prompts
// ─────────────────────────────────────────────────────────────────────────────

import { select } from "@inquirer/prompts";
import {
  askOutputFolder,
  ensureDir,
  errorMsg,
  findFiles,
  getErrorMessage,
  loadJson,
  printSection,
  readTextFile,
  writeTextFile,
} from "@/utils";
import path from "path";
import ora from "ora";
import { CWD } from "@/constents/config";
import chalk from "chalk";

export async function promptsFromJson() {
  printSection("JSON → Prompt Files");

  const jsonFiles = await findFiles("json");
  if (jsonFiles.length === 0) {
    errorMsg("No .json files found in this folder (or subfolders).");
    return;
  }

  const chosen = await select({
    message: "Select the JSON file to convert:",
    choices: jsonFiles.map((f) => ({ name: f, value: f })),
  });

  const outputFolder = await askOutputFolder("Folder name to save prompt files in:");
  if (!outputFolder) return;

  const rawContent = await readTextFile(path.join(CWD, chosen));

  const spinner = ora("Reading JSON and creating slide files...").start();

  try {
    const slides = await loadJson<string[]>(path.join(CWD, chosen));

    if (!slides || !Array.isArray(slides)) {
      throw new Error("JSON file must contain an array of strings.");
    }

    await ensureDir(outputFolder);

    for (let i = 0; i < slides.length; i++) {
      await writeTextFile(
        path.join(outputFolder, `slide-${i + 1}.txt`),
        slides[i],
      );
    }

    spinner.succeed(`Created ${slides.length} slide prompt files!`);
  } catch (err) {
    spinner.fail(chalk.red("Error: " + getErrorMessage(err)));
  }
}
