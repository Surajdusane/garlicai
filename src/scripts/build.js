import fs from "fs";

const dist = "dist";

// ❌ NEVER delete dist AFTER bundling
// Only delete BEFORE build

fs.cpSync("src/assets", `${dist}/assets`, { recursive: true });
fs.copyFileSync("README.md", `${dist}/README.md`);