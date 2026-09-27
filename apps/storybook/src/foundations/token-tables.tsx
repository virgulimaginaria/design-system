import {
  colors,
  cssVariables,
  type TokenVariable,
} from "@virgulimaginaria/design-tokens"

/** Colour swatches rendered from the live CSS variables (follow the scheme). */
export function ColorSwatches() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3">
      {Object.keys(colors).map((name) => (
        <figure key={name} className="m-0 grid gap-1.5">
          <div
            className="h-12 rounded-md border"
            style={{ background: `var(--color-${name})` }}
          />
          <figcaption className="grid text-xs">
            <code>--color-{name}</code>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

/** Table of every token variable whose name starts with `prefix`. */
export function TokenTable({ prefix }: { prefix: string }) {
  const rows = (
    Object.entries(cssVariables) as [TokenVariable, string][]
  ).filter(([name]) => name.startsWith(prefix))
  return (
    <table>
      <thead>
        <tr>
          <th>Variable</th>
          <th>Default value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, value]) => (
          <tr key={name}>
            <td>
              <code>{name}</code>
            </td>
            <td>
              <code>{value}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
