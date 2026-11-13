
// ─────────────────────────────────────────────────────────────────────────────
// Single image generation
// ─────────────────────────────────────────────────────────────────────────────

import { CWD } from "@/constents/config";
import { readTextFile } from "@/utils";
import chalk from "chalk";
import ora from "ora";
import path from "path";
import fs from "fs/promises";

interface GenerateSingleImageParams {
  client: any; // Replace with actual OpenAI client type
  promptFile: string;
  outputPath: string;
  outputName: string;
  outputFolder: string;
}

export async function generateTextToSingleGPT2Image({
  client,
  promptFile,
  outputPath,
  outputName,
  outputFolder,
}: GenerateSingleImageParams): Promise<void> {
  const rawPrompt: string = await readTextFile(path.join(CWD, promptFile));

  const spinner = ora(chalk.cyan(`  Generating ${outputName}…`)).start();

  try {
    const response = await client.images.generate({
      model: "gpt-image-2-2026-04-21",
      prompt: rawPrompt,
      n: 1,
      size: "1024x1280",
      moderation: "auto",
      quality: "low",
    })

    const b64: string = response.data[0].b64_json;

    const buffer = Buffer.from(b64, "base64");

    await fs.writeFile(outputPath, buffer);

    spinner.succeed(chalk.green(`  Saved → ${outputFolder}/${outputName}`));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";

    spinner.fail(chalk.red(`  Failed: ${message}`));
  }
}