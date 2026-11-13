import { select } from "@inquirer/prompts";
import chalk from "chalk";
import { printSection } from "@/utils";
import { generatePrompts } from "./generate-prompts";
import { generateImages } from "./generate-images";
import { editSettings } from "./edit-settings";
import { copyPrompts } from "./copy-prompts";
import { pdfToPngForAI } from "./pdf-to-images";

export async function mainMenu() {
  while (true) {
    printSection("Main Menu");

    const action = await select({
      message: "What do you want to do?",
      choices: [
        { name: "Generate Prompts", value: "prompts" },
        { name: "Generate Images", value: "images" },
        { name: "Edit Settings", value: "settings" },
        { name: "Copy Prompts", value: "copy" },
        { name: "PDF to Images", value: "pdftoimages" },
        { name: "Exit", value: "exit" },
      ],
    });

    if (action === "exit") {
      console.log(chalk.dim("\n  Bye! 👋\n"));
      process.exit(0);
    }

    if (action === "prompts")  await generatePrompts();
    if (action === "images")   await generateImages();
    if (action === "settings") await editSettings();
    if (action === "copy")     await copyPrompts();
    if (action === "pdftoimages") await pdfToPngForAI();
  }
}
