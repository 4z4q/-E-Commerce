import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AppProvider, type Navigation } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import Filter from "./Filter";
import InputFileUpload from "./Test";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  // {
  //   kind: "divider",
  // },
  {
    segment: "orders",
    title: "Orders",
    icon: <ShoppingCartIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  typography: {
    fontFamily: ["monospace", "Cairo"].join(","),
    // h1: {
    //   fontSize: "2.5rem",
    // },
    // h2: {
    //   fontSize: "2rem",
    // },
    // h3: {
    //   fontSize: "1.5rem",
    // },
    // h4: {
    //   fontSize: "1.25rem",
    // },
    // h5: {
    //   fontSize: "1rem",
    // },
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }: { pathname: string }) {
  switch (pathname) {
    case "/":
      return <InputFileUpload />;

    case "/orders":
      return <Filter />;

    default:
      return (
        <Box
          sx={{
            py: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography>This is the default content for {pathname}</Typography>
        </Box>
      );
  }
}

interface DemoProps {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
}

export default function MultiMediaDashboard(props: DemoProps) {
  const { window } = props;

  const router = useDemoRouter("/orders");

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start

    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      branding={{
        title: "Image Enhancements",
      }}
    >
      <DashboardLayout
        // sidebarExpandedWidth={"320px"}
        // defaultSidebarCollapsed
        // defaultSidebarCollapsed={false}
        // disableCollapsibleSidebar={false}
        sidebarExpandedWidth="0px"
        defaultSidebarCollapsed={true}
        disableCollapsibleSidebar={true}
        sx={{ padding: "12px" }}
      >
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}
