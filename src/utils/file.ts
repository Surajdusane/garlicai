import fg from "fast-glob";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "node:url";
import { CWD } from "@/constents/config";
import { warn } from "./terminal";
import { input } from "@inquirer/prompts";

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function loadJson<T = unknown>(
  filePath: string
): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function saveJson(
  filePath: string,
  data: unknown
): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function writeTextFile(
  filePath: string,
  content: string
): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf8");
}

export async function readTextFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf8");
}

export async function readBinaryFile(filePath: string): Promise<Buffer> {
  return fs.readFile(filePath);
}

// ── Directory checks ─────────────────────────────────────────────────────────

/** Returns true if the folder exists and contains at least one file */
export async function folderExists(folderPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(folderPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

// ── File discovery (root + nested, skip config files) ────────────────────────

const EXCLUDED: string[] = [
  "setup.json",
  "theme.json",
  "node_modules/**",
  ".git/**",
];

export async function findFiles(ext: string): Promise<string[]> {
  const pattern = `**/*.${ext}`;

  const files = await fg(pattern, {
    cwd: CWD,
    ignore: EXCLUDED,
    dot: false,
    absolute: false,
  });

  return files.sort();
}

export async function findFolders(): Promise<string[]> {
  const entries = await fs.readdir(CWD, { withFileTypes: true });

  return entries
    .filter(
      (e) =>
        e.isDirectory() &&
        !e.name.startsWith(".") &&
        e.name !== "node_modules"
    )
    .map((e) => e.name)
    .sort();
}

export async function findFilesInFolder(
  folder: string,
  ext: string
): Promise<string[]> {
  const pattern = `${folder}/*.${ext}`;

  const files = await fg(pattern, {
    cwd: CWD,
    dot: false,
    absolute: false,
  });

  return files.sort();
}


// ─────────────────────────────────────────────────────────────────────────────
//  Shared: ask for (and validate) an output folder name
// ─────────────────────────────────────────────────────────────────────────────

// "Folder name to save prompt files in:"
// "Folder name to save generated images in:"

export async function askOutputFolder(message: string) : Promise<string> {
  while (true) {
    const name = await input({
      message: message,
      validate: (v) =>
        /^[a-zA-Z0-9_\-]+$/.test(v.trim()) ||
        "Use letters, numbers, hyphens, underscores only",
    });

    const folderPath = path.join(CWD, name.trim());
    const exists : boolean = await folderExists(folderPath);

    if (exists) {
      warn(`Folder "${name}" already exists. Please choose a different name.`);
      continue;
    }

    return name.trim();
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.ASSET_MODE === "local";

/**
 * IMPORTANT:
 * In npm package, assets live inside dist/assets
 */
export const ASSET_ROOT = isDev
  ? path.resolve(process.cwd(), "src/assets")
  : path.resolve(__dirname, "assets");

export function getAssetPath(...segments: string[]): string {
  return path.join(ASSET_ROOT, ...segments);
}