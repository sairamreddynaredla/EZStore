const fs = require("fs").promises;
const path = require("path");
(async () => {
  const dist = path.join(__dirname, "..", "dist");
  try {
    const entries = await fs.readdir(dist);
    const files = [];
    let total = 0;
    for (const e of entries) {
      const full = path.join(dist, e);
      const st = await fs.stat(full);
      if (st.isFile()) {
        files.push({ file: e, size: st.size });
        total += st.size;
      } else if (st.isDirectory()) {
        const sub = await fs.readdir(full);
        for (const s of sub) {
          const f = path.join(full, s);
          const st2 = await fs.stat(f);
          if (st2.isFile()) {
            files.push({ file: path.join(e, s), size: st2.size });
            total += st2.size;
          }
        }
      }
    }
    files.sort((a, b) => b.size - a.size);
    const lines = [];
    lines.push("# Build Report");
    lines.push("");
    lines.push(`Total files: ${files.length}`);
    lines.push(`Total size (bytes): ${total}`);
    lines.push("");
    lines.push("## Top 20 largest files");
    files.slice(0, 20).forEach((f) => lines.push(`- ${f.file} — ${f.size} bytes`));
    await fs.mkdir(path.join(__dirname, "..", "reports"), { recursive: true });
    await fs.writeFile(
      path.join(__dirname, "..", "reports", "build-report.md"),
      lines.join("\n"),
      "utf8"
    );
    console.log("Wrote reports/build-report.md");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
