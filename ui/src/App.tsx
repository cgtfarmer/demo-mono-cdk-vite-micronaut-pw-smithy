import "./App.css";
import { Outlet } from "react-router";
import { Container, CssBaseline, Stack, ThemeProvider } from "@mui/material";
// import Footer from './components/layout/footer';
import NavbarTop from "./components/layout/navbar-top";
import { ProjectTheme } from "./ProjectTheme";

export default function App() {
  return (
    <ThemeProvider theme={ProjectTheme}>
      <CssBaseline />

      <Stack sx={{ height: "100vh" }}>
        <NavbarTop />

        <Container component="main" sx={{ pt: 3 }}>
          <Outlet />
        </Container>

        {/* <Footer /> */}
      </Stack>
    </ThemeProvider>
  );
}
