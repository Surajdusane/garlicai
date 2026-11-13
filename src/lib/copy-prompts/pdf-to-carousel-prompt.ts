import { THEME_FILE } from "@/constents/config";
import { getPDFToCarouselPrompt } from "@/lib/prompt";
import { copyToClipboard, loadJson, printSection, success } from "@/utils";
import chalk from "chalk";
import ora, { spinners } from "ora";
import { Theme } from "@/lib/theme";

export async function pdfToCarouselPrompt() {
    printSection("Copy PDF → Carousel Prompt");

    const theme = await loadJson(THEME_FILE) as Theme;
    
    const prompt = await getPDFToCarouselPrompt(theme);

    await copyToClipboard(prompt);

    success("PDF-to-carousel prompt copied to clipboard!");
}