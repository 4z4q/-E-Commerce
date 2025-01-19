import { IconButton } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import BedtimeIcon from "@mui/icons-material/Bedtime";

interface NavbarProps {
  iconMode: boolean;
  handeClick: () => void;
}
function ThemeSwithcer(props: NavbarProps) {
  const { iconMode, handeClick } = props;

  return (
    <IconButton onClick={handeClick} color="inherit">
      {iconMode ? <BedtimeIcon /> : <WbSunnyIcon />}
    </IconButton>
  );
}

export default ThemeSwithcer;
