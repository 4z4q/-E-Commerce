import Select from "react-select";
import { useTheme } from "@mui/material/styles";
import { BASE_URL } from "../constants/baseUrl";
import { useEffect, useState } from "react";
import { Product } from "../types/Products";

interface RegionMenuProps {
  setFilteredProducts: (products: Product[]) => void;
  product: Product[];
}



const options = [
  { value: "all electronics", label: "All Electronics" },
  { value: "smartphones", label: "Smartphones" },
  { value: "laptops", label: "Laptops" },
  { value: "tablets", label: "Tablets" },
  { value: "accessories", label: "Accessories" },
];

const RegionMenu = ({ setFilteredProducts, product }: RegionMenuProps) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";
  const [region, setRegion] = useState("all electronics");

  const handleRegionChange = (e: { label: string; value: string } | null) => {
    if (!e) return;
    const selectedRegion = e.value.toLowerCase();
    setRegion(selectedRegion);

    if (selectedRegion === "all electronics") {
      setFilteredProducts(product );
    }

    console.log(selectedRegion);
  };

  useEffect(() => {
    if (region === "all electronics") {
      return;
    }

    fetch(`${BASE_URL}/products/category/${region}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setFilteredProducts(data);
      })
      .catch((error) => console.error(error));
  }, [region, setFilteredProducts]);

  return (
    <Select
      styles={{
        control: (base) => ({
          ...base,
          width: "200px",
          boxShadow: "none",
        }),
      }}
      defaultValue={options[0]}
      onChange={handleRegionChange}
      options={options}
      className={darkMode ? "text-gray-100" : "text-gray-900"}
    />
  );
};

export default RegionMenu;
