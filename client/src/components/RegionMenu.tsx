import Select from "react-select";

const options = [
  { value: "all electronics", label: "All Electronics" },
  { value: "smartphones", label: "Smartphones" },
  { value: "laptops", label: "Laptops" },
  { value: "tablets", label: "Tablets" },
  { value: "accessories", label: "Accessories" },
];

import { useTheme } from "@mui/material/styles";
import { BASE_URL } from "../constants/baseUrl";
import {  useEffect, useState } from "react";

interface RegionMenuProps {
  setFilteredProducts: (products: string) => void;
  product: [] | "";
}

const RegionMenu = ({ setFilteredProducts, product }: RegionMenuProps) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";
  const [region, setRegion] = useState("all electronics");

  const handleRegionChange = (e) => {
    const selectedRegion = e.label.toString().toLowerCase();
    setRegion(selectedRegion);

    // إذا كان الاختيار "all electronics"، استخدم البيانات المحلية
    if (selectedRegion === "all electronics") {
      setFilteredProducts(product);
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
          // border: "none",
          boxShadow: "none",
        }),
      }}
      defaultValue={options[0]}
      onChange={handleRegionChange}
      options={options}
      classNames={{
        input: () => (darkMode ? "text-gray-100" : "text-gray-900"),
        singleValue: () => (darkMode ? "text-gray-100" : "text-gray-900"),
        placeholder: () => (darkMode ? "text-gray-400" : "text-gray-500"),
        indicatorSeparator: () => "hidden",
        option: () =>
          darkMode
            ? "hover:!text-gray-800 dark:hover:text-gray-200"
            : "hover:!text-gray-700 hover:text-gray-900",
        menu: () =>
          darkMode
            ? " bg-gray-800 dark:text-gray-100"
            : "bg-white text-gray-900",
        menuList: () => (darkMode ? "dark:bg-gray-800" : "bg-white"),
      }}
    />
  );
};

export default RegionMenu;
