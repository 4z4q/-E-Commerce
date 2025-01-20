import { Box, Grid2 } from "@mui/material";
import ProductCart from "../components/ProductCart";
import { useEffect, useState } from "react";
import { Product } from "../types/Products";
import { BASE_URL } from "../constants/baseUrl";
import { EmptySearch } from "../components/EmptySearch";
import SearchInput from "../components/SearchInput";
import RegionMenu from "../components/RegionMenu";
export default function HomePage() {
  const [product, setProduct] = useState<Product[]>([]);
  const [fillteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/products`);
        const data = await response.json();
        setProduct(data);
        setFilteredProducts(data);
      } catch {
        setError(true);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        margin={"20px 0"}
        gap={"50px"}
      >
        <SearchInput />
        <RegionMenu setFilteredProducts={setFilteredProducts} product={product}  />
      </Box>
      <Grid2 container spacing={2}>
        {!error ? (
          fillteredProducts.map((product) => (
            <Grid2 key={product._id} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
              <ProductCart key={product._id} {...product} />
            </Grid2>
          ))
        ) : (
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            flexWrap={"wrap"}
            gap={"20px"}
            // width={"100%"}
          >
            {[...Array(8)].map((_, index) => (
              <EmptySearch key={index} />
            ))}
          </Box>
        )}
      </Grid2>
    </>
  );
}
