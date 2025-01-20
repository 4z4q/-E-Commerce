import { Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { EmptySearch } from "../components/EmptySearch";
import ShowMessage from "../components/ShowMessage";
import { useCart } from "../context/Cart/CartContext";
import { useEffect, useState } from "react";
import styles from "./cart.module.css";
import CartItem from "../types/Cart";
import { BASE_URL } from "../constants/baseUrl";
function CartInfo() {
  const { loading, errorS } = useCart();
  const [product, setProduct] = useState<CartItem | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = fetch(`${BASE_URL}/products/${id}`);
    fetchData.then((res) => res.json()).then((data) => setProduct(data));
  }, [id]);

  const { image, quantity, title, unitPrice, category } = product ?? {};

  if (loading) {
    return <EmptySearch />;
  }

  return (
    <>
      {errorS.length ? (
        <ShowMessage message={errorS} />
      ) : (
        <>
          <Link
            className={styles["link-style"]}
            to="/"
            style={{
              boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
              // margin: "50px  auto 20px",
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="call-made">
                <path
                  id="Shape"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.8922 3.53553L7.07071 4.71405L3.18162 8.60313L18.0309 8.60313L18.0309 10.253L3.18162 10.253L7.07071 14.1421L5.8922 15.3206L-0.000355655 9.42809L5.8922 3.53553Z"
                  fill="#111827"
                />
              </g>
            </svg>
          </Link>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 3,
              padding: 2,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              height: "510px",
            }}
            className="mt-8 mb-8 shadow width-full"
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                borderRadius: "12px",
                padding: "12px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
              }}
            >
              <img
                src={image}
                alt="Not Found"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "center",
                  borderRadius: "12px",
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 2,
                padding: 3,
              }}
            >
              <h1 className="text-2xl whitespace-nowrap">{title}</h1>
              <p>
                <span className={styles["font-semibold"]}>Category: </span>
                <span className={styles["font-light"]}>{category}</span>
              </p>
              <p>
                <span className={styles["font-semibold"]}>Price: </span>
                <span className={styles["font-light"]}>{unitPrice}</span>
              </p>
              <p>
                <span className={styles["font-semibold"]}>Quaintity: </span>
                <span className={styles["font-light"]}>{quantity}</span>
              </p>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}

export default CartInfo;
