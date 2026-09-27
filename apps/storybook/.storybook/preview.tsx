import type { Decorator, Preview } from "@storybook/react-vite"

import "../src/styles.css"

type ColorScheme = "light" | "dark"

const withColorScheme: Decorator = (Story, context) => {
  document.documentElement.dataset.theme = context.globals
    .colorScheme as ColorScheme
  return <Story />
}

const preview: Preview = {
  tags: ["autodocs"],
  decorators: [withColorScheme],
  globalTypes: {
    colorScheme: {
      description: "Colour scheme",
      toolbar: {
        title: "Colour scheme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    colorScheme: "light",
  },
  parameters: {
    layout: "centered",
    controls: {
      expanded: true,
      matchers: { color: /(background|color)$/i },
    },
    docs: {
      toc: true,
    },
    a11y: {
      // Accessibility violations fail the story tests (`pnpm test`).
      test: "error",
    },
    options: {
      storySort: {
        order: ["Introduction", "Foundations", "Components"],
      },
    },
  },
}

export default preview
