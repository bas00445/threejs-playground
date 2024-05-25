import type { Preview } from "@storybook/react";

import "../src/app/globals.css";
import "./storybook.css";

const preview: Preview = {
  parameters: {
    previewTabs: {
      docs: { hidden: true },
    },
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
