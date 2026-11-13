import chalk from "chalk";

// ── Terminal helpers ──────────────────────────────────────────────────────────

export function printSection(title: string): void {
  console.log("\n" + chalk.bold.cyan("▸ " + title));
  console.log(chalk.dim("─".repeat(50)));
}

export function success(msg: string): void {
  console.log(chalk.green("  ✔  " + msg));
}

export function warn(msg: string): void {
  console.log(chalk.yellow("  ⚠  " + msg));
}

export function info(msg: string): void {
  console.log(chalk.dim("  ·  " + msg));
}

export function errorMsg(msg: string): void {
  console.log(chalk.red("  ✖  " + msg));
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}