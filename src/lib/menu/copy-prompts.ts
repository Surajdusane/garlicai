import { select } from "@inquirer/prompts";
import { printSection } from "@/utils";
import { pdfToCarouselPrompt } from "@/lib/copy-prompts/pdf-to-carousel-prompt";

export async function copyPrompts() {
  printSection("Copy Prompts");

  const method = await select({
    message: "Which type of prompts do you want to copy?",
    choices: [
      { name: "Copy PDF → Carousel Prompt", value: "pdftocarousel" },

      { name: "← Back", value: "back" },
    ],
  });

  if (method === "back") return;

  if (method === "pdftocarousel") await pdfToCarouselPrompt();

}