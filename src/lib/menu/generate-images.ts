import {
  promptsFromJson,
  promptsFromPdf
} from "@/lib/generate-prompts";
import { printSection } from "@/utils";
import { select } from "@inquirer/prompts"; 
import { generateTextToCarouselImages, generateImageToCarouselImages } from "@/lib/generate-images";


export async function generateImages() {
  printSection("Generate Images");

  const method = await select({
    message: "How do you want to generate Images?",
    choices: [
      { name: "Generate Images Using Prompts", value: "promptstoimages" },
      { name: "Images + Text to Image", value: "imagestoimages" },
      { name: "← Back", value: "back" },
    ],
  });

  if (method === "back") return;

  if (method === "promptstoimages") await generateTextToCarouselImages();
  if (method === "imagestoimages") await generateImageToCarouselImages();
}