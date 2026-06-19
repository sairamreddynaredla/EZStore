# Dead Code Report

- Tool: `madge` reported no orphan modules (no obvious unused JS/JSX modules found).

Notes:

- `madge` detects static orphan modules; dynamic imports and assets may not be reported.
- Review large files listed in `reports/code-quality-report.md` for potential component extraction and dead sections.

Recommendations:

- Run `madge --orphans src` locally to double-check before deletion.
- Consider using runtime tools or manual review for rarely-used routes/components.
