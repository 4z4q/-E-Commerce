import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Typography,
} from "@mui/material";
import gojoImage from "../assets/satoru-gojo-3840x2160-16721.jpg";
import { useCart } from "../context/Cart/CartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const {
    cartItems,
    loading,
    totalAmount,
    updateItemInCart,
    removeItemInCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("checkout");
  };

  const handleQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return;

    updateItemInCart(productId, quantity);
  };

  const handleRemove = (productId: string) => {
    removeItemInCart(productId);
    console.log(productId);
  };
  const renderCartItems = () => (
    <>
      {cartItems?.map((item) => (
        <Box
          key={item.productId}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          mt={"20px"}
          sx={{
            border: "1px solid #ccc",
            padding: "20px 12px",
            borderRadius: "6px",
          }}
        >
          <Box display={"flex"} justifyContent={"space-between"} gap={2}>
            <img
              src={item.image ? item.image : gojoImage}
              width={"150px"}
              style={{
                maxHeight: "100px",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            <Box>
              <Typography fontFamily={"inherit"} variant="h5">
                {item.title}
              </Typography>
              <Typography fontFamily={"inherit"}>
                {item.quantity} x {item.unitPrice} YE
              </Typography>
              <Button
                variant="outlined"
                onClick={() => handleRemove(item.productId)}
              >
                Remove
              </Button>
            </Box>
          </Box>

          <ButtonGroup variant="contained">
            <Button
              onClick={() => handleQuantity(item.productId, item.quantity + 1)}
            >
              +
            </Button>
            <Button
              onClick={() => handleQuantity(item.productId, item.quantity - 1)}
            >
              -
            </Button>
          </ButtonGroup>
        </Box>
      ))}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography fontFamily={"inherit"} variant="h5" sx={{ mt: "20px" }}>
          Total Price: {totalAmount.toFixed(2)} YE
        </Typography>
        <Button variant="outlined" onClick={handleCheckout}>
          Check Cart
        </Button>
      </Box>
    </>
  );

  return (
    <div>
      {loading === true ? (
        <CircularProgress
          sx={{ margin: "50px auto", display: "block", width: "50px " }}
        />
      ) : (
        <>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <h1>My Cart</h1>
            <Button
              variant="outlined"
              onClick={() => clearCart()}
              disabled={cartItems.length === 0 ? true : false}
            >
              Clear Cart
            </Button>
          </Box>

          {cartItems.length === 0 ? (
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              height={"100%"}
            >
              <Typography fontFamily={"inherit"} variant="h5">
                Cart is empty
              </Typography>
            </Box>
          ) : (
            renderCartItems()
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
