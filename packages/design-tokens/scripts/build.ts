// Builds the publishable package: compiled JS + type declarations, then the
// generated CSS files. Run with `pnpm build` (Node >= 24 strips the types).
import { execSync } from "node:child_process"
import { mkdirSync, rmSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { renderTailwindThemeCss, renderTokensCss } from "../src/css.ts"

const root = fileURLToPath(new URL("..", import.meta.url))
const dist = new URL("../dist/", import.meta.url)

rmSync(dist, { recursive: true, force: true })
execSync("tsc -p tsconfig.build.json", { cwd: root, stdio: "inherit" })

mkdirSync(dist, { recursive: true })
writeFileSync(new URL("tokens.css", dist), renderTokensCss())
writeFileSync(new URL("theme.css", dist), renderTailwindThemeCss())
