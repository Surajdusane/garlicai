import { readTextFile } from "@/utils";
import { Theme } from "@/lib/theme";
import { getImageGenerationPrompt } from "./get-image-generation-prompt";
import { getAssetPath } from "@/utils/file";

export async function getPDFToCarouselPrompt(theme: Theme): Promise<string> {
  const imagePrompt = await getImageGenerationPrompt(theme);
  const pdfPrompt = await readTextFile(
    getAssetPath("prompts", "pdf-analyser-prompt.md")
  );

  const mainPrompt = `
    You are a professional carousel content strategist and visual designer.
    Your job is to convert source content into a series of carousel slide image-generation prompts.

    analyse this pdf using ths insturction
    ${pdfPrompt}

    for gerating image use this prompt
    ${imagePrompt}

    exclude last slide include swipe text with right arrow icon → on image right bottom corner
    `;

  return mainPrompt;
}
