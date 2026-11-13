import { input, select } from "@inquirer/prompts";
import chalk from "chalk";
import {
  normalizeHex,
  contrastOnBlack,
  saveJson,
  printSection,
  success,
  warn,
} from "@/utils";
import { THEME_FILE, FONTS } from "@/constents/config"

export type Theme = {
  themeColor: string;
  font: string;
  instructions: string;
};

export async function runTheme() {
  printSection("Theme Setup");

  console.log(
    chalk.dim(
      "  These settings control how your carousel slide images look.\n" +
      "  Choose a light colour — it will appear on a dark/black background.\n"
    )
  );

  // ── Theme color ────────────────────────────────────────────────────────────
  let themeColor = null;

  while (!themeColor) {
    const raw = await input({
      message: "Enter theme color (hex, e.g. #548125):",
      validate: (v) => v.trim().length > 0 || "Please enter a colour",
    });

    const normalized = normalizeHex(raw);
    if (!normalized) {
      warn("Invalid hex colour. Use 3 or 6 hex digits, e.g. #A3F or #548125.");
      continue;
    }

    const contrast = contrastOnBlack(normalized);
    if (contrast < 3) {
      warn(
        `Colour ${normalized} has a contrast ratio of ${contrast.toFixed(1)}:1 on black — it may be hard to read.`
      );
      const confirm = await input({
        message: "Use it anyway? (y to confirm, any other key to pick again):",
      });
      if (confirm.trim().toLowerCase() !== "y") continue;
    }

    themeColor = normalized;
    console.log(
      chalk.hex(themeColor)(`  ● Preview: ${themeColor}`) +
        chalk.dim(`  (contrast ratio ${contrastOnBlack(themeColor).toFixed(1)}:1 on black)`)
    );
  }

  // ── Font ───────────────────────────────────────────────────────────────────
  const font = await select({
    message: "Choose a font for your carousel:",
    choices: FONTS.map((f) => ({ name: f, value: f })),
  });

  // ── Optional instructions ──────────────────────────────────────────────────
  const instructions = await input({
    message: "Add specific image generation instructions (optional, press Enter to skip):",
  });

  await saveJson(THEME_FILE, {
    themeColor,
    font,
    instructions: instructions.trim() || "",
  });

  success(`Theme saved — ${font} · ${themeColor}\n`);
}
