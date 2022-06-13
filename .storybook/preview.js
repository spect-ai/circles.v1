import "../styles/globals.css";
import "degen/styles";
import { Box, ThemeProvider } from "degen";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <ThemeProvider defaultMode="dark" defaultAccent="purple">
      <Box
        backgroundColor="background"
        style={{
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "row",
          padding: "4rem",
        }}
      >
        <Story />
      </Box>
    </ThemeProvider>
  ),
];
