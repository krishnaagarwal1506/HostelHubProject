import { createTheme } from "@mui/material/styles";
import colors from "./colors";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    ...colors,
  },
  typography: {
    fontFamily: "Lato",
    fontSize: 14,
  },
});
