// Builds the publishable package: compiled JS + type declarations for every
// file under src/, then the stylesheet. Run with `pnpm build`.
import { execSync } from "node:child_process"
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const dist = new URL("../dist/", import.meta.url)
const styles = new URL("styles/", dist)

rmSync(dist, { recursive: true, force: true })
execSync("tsc -p tsconfig.build.json", { cwd: root, stdio: "inherit" })

// `shadcn/tailwind.css` (custom variants and keyframes used by shadcn
// components) comes from the shadcn CLI package, which is a development tool.
// Vendor that single stylesheet so consumers never install the CLI.
const shadcnImport = '@import "shadcn/tailwind.css";'
const source = readFileSync(
  new URL("../src/styles/globals.css", import.meta.url),
  "utf8"
)
if (!source.includes(shadcnImport)) {
  throw new Error(`Expected ${shadcnImport} in src/styles/globals.css`)
}

mkdirSync(styles, { recursive: true })
writeFileSync(
  new URL("globals.css", styles),
  source.replace(shadcnImport, '@import "./shadcn.css";')
)
copyFileSync(
  fileURLToPath(import.meta.resolve("shadcn/tailwind.css")),
  new URL("shadcn.css", styles)
)
