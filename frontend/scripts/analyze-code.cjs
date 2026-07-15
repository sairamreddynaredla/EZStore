const fs = require("fs").promises;
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "reports", "code-quality-report.md");

async function walk(dir, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (["node_modules", ".git", "reports"].includes(ent.name)) continue;
      await walk(full, files);
    } else {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  const files = await walk(path.join(ROOT, "src"));
  const reportLines = [];
  reportLines.push("# Code Quality Report");
  reportLines.push("");
  const largeFiles = [];
  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if ([".js", ".jsx", ".ts", ".tsx", ".css", ".md"].includes(ext)) {
      const content = await fs.readFile(f, "utf8");
      const lines = content.split(/\r?\n/).length;
      if (lines > 500) largeFiles.push({ file: path.relative(ROOT, f), lines });
    }
  }
  reportLines.push("## Files over 500 lines");
  if (largeFiles.length === 0) reportLines.push("None");
  else {
    for (const lf of largeFiles) reportLines.push(`- ${lf.file} — ${lf.lines} lines`);
  }
  await fs.mkdir(path.join(ROOT, "reports"), { recursive: true });
  await fs.writeFile(OUT, reportLines.join("\n"), "utf8");
  console.log("Wrote", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
