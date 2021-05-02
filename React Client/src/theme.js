import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    common: {
      black: "#000",
      white: "#fff",
    },
    background: {
      paaper: "#fff",
      default: "#fafafa",
    },
    primary: {
      light: "rgba(211, 213, 237, 1)",
      main: "rgba(43, 106, 169, 1)",
      dark: "rgba(15, 31, 128, 1)",
      contrastText: "#fff",
    },
    secondary: {
      light: "rgba(238, 219, 189, 1)",
      main: "rgba(236, 156, 19, 0.78)",
      dark: "rgba(179, 121, 23, 1)",
      contrastText: "#000",
    },
    error: {
      light: "#e57373",
      main: "rgba(217, 26, 12, 1)",
      dark: "rgba(116, 8, 8, 1)",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
});
