import { input } from "@inquirer/prompts";
import ora from "ora";
import chalk from "chalk";
import { validateApiKey } from "@/lib/clients";
import { saveJson, printSection, success } from "@/utils";
import { CONFIG_FILE } from "@/constents/config";

export async function runSetup() {
  printSection("First-time Setup — OpenAI API Key");

  console.log(
    chalk.dim(
      "  Your key is saved to setup.json in this folder.\n" +
      "  It is used only to call the OpenAI API.\n"
    )
  );

  let apiKey = null;

  while (!apiKey) {
    const raw = await input({
      message: "Enter your OpenAI API key:",
      validate: (v) => v.trim().length > 10 || "Please enter a valid key",
    });

    const spinner = ora("Validating API key…").start();
    const valid = await validateApiKey(raw.trim());

    if (valid) {
      spinner.succeed(chalk.green("API key is valid!"));
      apiKey = raw.trim();
    } else {
      spinner.fail(chalk.red("Invalid API key — please try again."));
    }
  }

  await saveJson(CONFIG_FILE, { apiKey });
  success("Saved to setup.json\n");
}
