/*
 * Regenerates translations.csv from src/locales/en.json + hi.json.
 * For each key, greps src/ for t("key"/t('key' usages to list which files reference it.
 * Run: node scripts/generate-translations-csv.js
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.join(__dirname, "..");
const en = require(path.join(root, "src/locales/en.json"));
const hi = require(path.join(root, "src/locales/hi.json"));

function escapeCsv(value) {
    const str = String(value ?? "");
    if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function findFilesUsingKey(key) {
    const pattern = `t\\((['"])${key}\\1`;
    try {
        const output = execFileSync(
            "grep",
            ["-rlE", pattern, "--include=*.js", "--include=*.jsx", "src"],
            { cwd: root, encoding: "utf8" }
        );
        return output
            .split("\n")
            .filter(Boolean)
            .sort()
            .join("; ");
    } catch (e) {
        // grep exits 1 when no matches found
        return "";
    }
}

const rows = [["key", "english", "hindi", "files"]];

for (const key of Object.keys(en)) {
    rows.push([key, en[key], hi[key] ?? "", findFilesUsingKey(key)]);
}

const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
fs.writeFileSync(path.join(root, "translations.csv"), csv + "\n");

console.log(`Wrote translations.csv with ${rows.length - 1} keys.`);
