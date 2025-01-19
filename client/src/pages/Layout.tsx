import {
  Container,
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useMemo, useState } from "react";

const Layout = () => {
  
  const [mode, setMode] = useState<PaletteMode>(() => {
    return (localStorage.getItem("mode") as PaletteMode) || "dark";
  });

  const [iconMode, setIconMode] = useState(() => {
    return localStorage.getItem("iconMode") === "true";
  });

  const handeClick = () => {
    setIconMode((prev) => {
      const newIconMode = !prev;
      localStorage.setItem("iconMode", String(newIconMode)); 
      return newIconMode;
    });

    setMode((prev) => {
      const newMode = prev === "dark" ? "light" : "dark";
      localStorage.setItem("mode", newMode); 
      return newMode;
    });
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: mode,
        primary: {
          main: mode === "light" ? "#1976d2" : "#90caf9", 
        },
      },
    });
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Navbar iconMode={iconMode} handeClick={handeClick} />
      <Container maxWidth="lg">
        <Outlet />
      </Container>
    </ThemeProvider>
  );
};

export default Layout;
