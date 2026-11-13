#!/usr/bin/env node

import chalk from "chalk";
import { runSetup } from "@/lib/setup";
import { runTheme } from "@/lib/theme";
import { mainMenu } from "@/lib/menu";
import { Config, CONFIG_FILE, THEME_FILE } from "@/constents/config";
import { fileExists, loadJson } from "@/utils";

async function main() {
  console.clear();
  printBanner();

  // ── Step 0: First-run API key setup ──────────────────────────────────────
  const hasConfig = await fileExists(CONFIG_FILE);
  if (!hasConfig) {
    await runSetup();
  } else {
    const cfg = await loadJson(CONFIG_FILE) as Config;
    if (!cfg?.apiKey) {
      await runSetup();
    }
  }

  // ── Step 1: Theme setup ───────────────────────────────────────────────────
  const hasTheme = await fileExists(THEME_FILE);
  if (!hasTheme) {
    await runTheme();
  }

  // ── Step 2+: Main menu loop ───────────────────────────────────────────────
  await mainMenu();
}

function printBanner() {
  const line = chalk.hex("#FFF200")("─".repeat(52));
  console.log("\n" + line);
  console.log(
    chalk.bold.white("  🎠  Carousel Generator") +
      chalk.hex("#FFF200").bold("  ·  GPT-Image-2 powered")
  );
  console.log(line + "\n");
}

main().catch((err) => {
  console.error(chalk.red("\n✖  Unexpected error:"), err.message);
  process.exit(1);
});
