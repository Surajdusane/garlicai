import { select } from "@inquirer/prompts";
import fs from "fs/promises";
import chalk from "chalk";
import { printSection, success } from "@/utils";
import { runSetup } from "@/lib/setup";
import { runTheme } from "@/lib/theme"; 
import { CONFIG_FILE, THEME_FILE } from "@/constents/config";

export async function editSettings() {
  printSection("Edit Settings");

  const action = await select({
    message: "What would you like to change?",
    choices: [
      { name: "🔑  Update OpenAI API key",  value: "key" },
      { name: "🎨  Edit theme",              value: "theme" },
      { name: "← Back",                      value: "back" },
    ],
  });

  if (action === "back") return;

  if (action === "key") {
    try { await fs.unlink(CONFIG_FILE); } catch {}
    await runSetup();
  }

  if (action === "theme") {
    try { await fs.unlink(THEME_FILE); } catch {}
    await runTheme();
  }
}
