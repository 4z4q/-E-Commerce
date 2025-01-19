import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useState } from "react";
import { useAuth } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeSwithcer from "../components/ThemeSwithcer";
import { Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "../context/Cart/CartContext";

// const settings = ["My Order", "Logout"];

interface NavbarProps {
  iconMode: boolean;
  handeClick: () => void;
}
function Navbar({ iconMode, handeClick }: NavbarProps) {
  const [anchorElUser, setAnchorEluser] = useState<null | HTMLElement>(null);
  const navigator = useNavigate();
  const auth = useAuth();
  const { username, isAuthenticated, logout } = auth;

  const { cartItems } = useCart();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEluser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEluser(null);
  };

  const handleLogoutUser = () => {
    logout();
    setAnchorEluser(null);
    navigator("/");
  };

  const handleCart = () => {
    navigator("/cart");
  };

  return (
    <AppBar position="static" sx={{ mb: { xs: 2, md: 2 } }}>
      <Container>
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* whith media query Large screen */}
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              // mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>

          {/* whith media query small screen */}
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              // mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>

          {isAuthenticated ? (
            <Box
              display={"flex"}
              gap={2}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <IconButton aria-label="cart" onClick={handleCart}>
                <Badge badgeContent={cartItems.length} color="info">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={username || ""}
                    src="/static/images/avatar/2.jpg"
                  />
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: "center" }}>My Order</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogoutUser}>
                  <Typography sx={{ textAlign: "center" }}> Logout </Typography>
                </MenuItem>
                <MenuItem sx={{ width: "100px", height: "30px" }}>
                  <ThemeSwithcer iconMode={iconMode} handeClick={handeClick} />
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box>
              <IconButton
                size="large"
                aria-haspopup="true"
                onClick={() => navigator("/login")} // navigate to login
                color="inherit"
              >
                <Typography> Login </Typography>
              </IconButton>
              <ThemeSwithcer iconMode={iconMode} handeClick={handeClick} />
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
