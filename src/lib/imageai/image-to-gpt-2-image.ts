// ─────────────────────────────────────────────────────────────────────────────
// Image-to-Image Generation using GPT Image API
// ─────────────────────────────────────────────────────────────────────────────

import { CWD } from "@/constents/config";
import { readTextFile } from "@/utils";

import chalk from "chalk";
import ora from "ora";

import path from "path";
import fs from "fs/promises";
import { toFile } from "openai";

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    default:
      throw new Error(
        `Unsupported image type: ${ext}. Only PNG, JPG, JPEG and WEBP are supported.`,
      );
  }
}

interface GenerateSingleImageParams {
  client: any; // Replace with OpenAI type if desired
  promptFile: string;
  outputPath: string;
  outputName: string;
  outputFolder: string;
  referenceImage: string;
}

export async function generateImageToSingleGPT2Image({
  client,
  promptFile,
  outputPath,
  outputName,
  outputFolder,
  referenceImage,
}: GenerateSingleImageParams): Promise<void> {
  const spinner = ora(chalk.cyan(`  Generating ${outputName}...`)).start();

  try {
    // Load prompt
    const prompt = await readTextFile(path.join(CWD, promptFile));

    // Load reference image
    const imageBuffer = await fs.readFile(path.resolve(CWD, referenceImage));

    // Convert to OpenAI UploadFile
    const imageFile = await toFile(imageBuffer, path.basename(referenceImage), {
      type: getMimeType(referenceImage),
    });

    // Generate edited image
    const response = await client.images.edit({
      model: "gpt-image-2-2026-04-21",
      image: imageFile,
      prompt,
      n: 1,
      size: "1024x1280",
      quality: "low",
      moderation: "auto",
    });

    if (
      !response.data ||
      response.data.length === 0 ||
      !response.data[0].b64_json
    ) {
      throw new Error("No image was returned by the API.");
    }

    // Save output
    const outputBuffer = Buffer.from(response.data[0].b64_json, "base64");

    await fs.writeFile(outputPath, outputBuffer);

    spinner.succeed(chalk.green(`  Saved → ${outputFolder}/${outputName}`));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred.";

    spinner.fail(chalk.red(`  Failed: ${message}`));

    throw error;
  }
}
