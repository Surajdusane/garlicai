import path from "path";

// Always operate in the folder where the user ran the CLI
export const CWD = process.cwd();

export type Config = {
    apiKey?: string;
}

export const CONFIG_FILE = path.join(CWD, "setup.json");
export const THEME_FILE  = path.join(CWD, "theme.json");

export const FONTS = [
  "Inter",
  "Montserrat",
  "Poppins",
  "Playfair Display",
  "Roboto",
  "Oswald",
  "Lato",
  "Bebas Neue",
  "Nunito",
  "Raleway",
];

// gpt-image-1 is the current GA image model; update to gpt-image-2 when available on your key
export const IMAGE_MODEL = "gpt-image-1";
export const CHAT_MODEL  = "gpt-4o";

export const IMAGE_SIZE  = "1024x1024";
