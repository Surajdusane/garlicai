// ─────────────────────────────────────────────────────────────────────────────
//  PDF → PNG (Simple, No Dimension Changes)
// ─────────────────────────────────────────────────────────────────────────────

import { select } from "@inquirer/prompts";
import path from "path";
import fs from "fs/promises";
import { existsSync, statSync } from "fs";
import ora from "ora";
import chalk from "chalk";
import sharp from "sharp";
import { PDFiumLibrary } from "@hyzyla/pdfium";

import {
  askOutputFolder,
  ensureDir,
  errorMsg,
  findFiles,
  getErrorMessage,
  printSection,
} from "@/utils";
import { CWD } from "@/constents/config";
import { getAssetPath, readBinaryFile } from "@/utils/file";

// ─────────────────────────────────────────────────────────────────────────────

export async function pdfToPngForAI(): Promise<void> {
  printSection("PDF → PNG");

  // ── 1. Pick the PDF ─────────────────────────────────────────────────────────
  const pdfFiles = await findFiles("pdf");
  if (pdfFiles.length === 0) {
    errorMsg("No .pdf files found in this folder (or subfolders).");
    return;
  }

  const chosenPdf = await select({
    message: "Select the PDF to convert:",
    choices: pdfFiles.map((f) => ({ name: f, value: f })),
  });

  // ── 2. Ask for output folder ────────────────────────────────────────────────
  const outputFolder = await askOutputFolder("Folder for PNG images:");
  if (!outputFolder) return;

  const spinner = ora("Converting PDF to PNG…").start();
  let library: Awaited<ReturnType<typeof PDFiumLibrary.init>> | null = null;

  try {
    const pdfPath   = path.join(CWD, chosenPdf);
    const outputDir = path.join(CWD, outputFolder);
    await ensureDir(outputDir);

    if (!existsSync(pdfPath)) {
      spinner.fail(chalk.red(`File not found: ${pdfPath}`));
      return;
    }

    const wasmPath = getAssetPath("pdf", "pdfium.wasm");
    const wasmBuffer = await readBinaryFile(wasmPath);

  // Convert Buffer to ArrayBuffer
  const wasmBinary = new Uint8Array(wasmBuffer).buffer;

    // ── 3. Load and process PDF ───────────────────────────────────────────────
    library = await PDFiumLibrary.init({ wasmBinary: wasmBinary });
    const pdfBuffer = await fs.readFile(pdfPath);
    const document  = await library.loadDocument(pdfBuffer);
    const totalPages = [...document.pages()].length;
    
    spinner.text = `Converting ${totalPages} page(s) to PNG…`;

    let successCount = 0;
    let totalBytes = 0;
    const padWidth = String(totalPages).length;

    for (const page of document.pages()) {
      spinner.text = `Page ${page.number}/${totalPages}…`;

      try {
        // Render at original PDF resolution
        const renderResult = await page.render({
          scale: 1.0, // Original size
          render: async (options) => {
            // Convert to PNG with optimal compression (no quality loss)
            const buffer = await sharp(options.data, {
              raw: {
                width: options.width,
                height: options.height,
                channels: 4,
              },
            })
            .png({
              compressionLevel: 9,      // Max compression, lossless
              adaptiveFiltering: true,   // Better compression for text
            })
            .toBuffer();

            return new Uint8Array(buffer);
          },
        });

        const padded = String(page.number + 1).padStart(padWidth, "0");
        const filePath = path.join(outputDir, `page-${padded}.png`);
        
        await fs.writeFile(filePath, Buffer.from(renderResult.data));
        
        const fileSize = statSync(filePath).size;
        totalBytes += fileSize;
        
        successCount++;
      } catch (pageErr) {
        console.warn(
          chalk.yellow(`\n  ⚠  Page ${page.number} skipped: ${getErrorMessage(pageErr)}`)
        );
      }
    }

    document.destroy();

    // ── 4. Display results ────────────────────────────────────────────────────
    const mb = (totalBytes / (1024 * 1024)).toFixed(2);
    
    spinner.succeed(chalk.green(`Converted ${successCount}/${totalPages} pages\n`));
    
    console.log(chalk.white(`   Total size: ${mb} MB`));
    console.log(chalk.green(`   Output: ${outputFolder}/page-*.png\n`));
    
  } catch (err) {
    spinner.fail(chalk.red("Fatal error: " + getErrorMessage(err)));
  } finally {
    library?.destroy();
  }
}