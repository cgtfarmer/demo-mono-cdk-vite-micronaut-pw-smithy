import { createTheme, ThemeOptions } from "@mui/material";
import { lightBlue, yellow } from '@mui/material/colors';

export const ProjectTheme: ThemeOptions = createTheme({
  palette: {
    mode: 'dark',
    primary: lightBlue,
    secondary: yellow
    // mode: "light",
    // primary: {
    //   main: "#0A455C"
    // },
    // secondary: {
    //   main: "#EAC96C"
    // }
  }
});
