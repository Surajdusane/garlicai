import { select } from "@inquirer/prompts";
import { printSection } from "@/utils";
import {
  promptsFromJson,
  promptsFromPdf,
  promptsFromPdfAndText,
  promptsFromText,
} from "@/lib/generate-prompts";

export async function generatePrompts() {
  printSection("Generate Prompts");

  const method = await select({
    message: "How do you want to generate prompts?",
    choices: [
      { name: "Convert AI result (JSON file) → prompt files", value: "json" },
      { name: "PDF → carousel prompts", value: "pdf" },
      { name: "PDF + text modifier → carousel prompts", value: "pdf+txt" },
      { name: "Type / paste text directly → prompts", value: "text" },
      { name: "← Back", value: "back" },
    ],
  });

  if (method === "back") return;

  if (method === "json") await promptsFromJson();
  if (method === "pdf") await promptsFromPdf();
  if (method === "pdf+txt") await promptsFromPdfAndText();
  if (method === "text") await promptsFromText();
}