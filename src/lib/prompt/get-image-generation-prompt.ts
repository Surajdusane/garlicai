import { readTextFile } from "@/utils";
import { Theme } from "@/lib/theme";
import { getAssetPath } from "@/utils/file";

export async function getImageGenerationPrompt(theme: Theme): Promise<string> {
  const prompt = await readTextFile(getAssetPath("prompts", "image-prompt.md"));

  const themeContext = [
    "THEME CONTEXT:",
    `- Primary text color white or black as per bakcgroun of text and highlighting: ${theme.themeColor}`,
    `- Font family: ${theme.font} for all overlay text`,
    theme.instructions?.trim()
      ? `- Extra instructions: ${theme.instructions.trim()}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  return `${prompt.trim()}\n\n${themeContext}\n\nDont`;
}