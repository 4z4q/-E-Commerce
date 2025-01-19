import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase } from "@mui/material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "10px",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    // marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function SearchInput() {
  // { countriesList, filterCountriesList, setIsEmpty }
  // const handleSearch = (e) => {
  //   e.preventDefault();

  //   const searchValue = e.target[0].value;

  //   const updateCountriesList =
  //     !searchValue || searchValue === ""
  //       ? countriesList
  //       : countriesList.filter((country) =>
  //           country.name.official
  //             .toLowerCase()
  //             .includes(searchValue.toLowerCase())
  //         );

  //   filterCountriesList(updateCountriesList);
  //   // setIsEmpty(isEmpty(countriesList));
  //   setIsEmpty(updateCountriesList.length === 0);
  // };

  return (
    <div>
      <form>
        <Search sx={{ display: { sm: "block" } }} className="shadow">
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            // style={{ width: "200px" }}
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
      </form>
    </div>
  );
}

export default SearchInput;
