import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useCart } from "../context/Cart/CartContext";
import { useNavigate } from "react-router-dom";
import { CardActionArea } from "@mui/material";
import { useAuth } from "../context/Auth/AuthContext";

interface Props {
  _id: string;
  image: string;
  price: number;
  stock: number;
  title: string;
}

export default function ProductCart({
  _id,
  image,
  stock,
  price,
  title,
}: Props) {
  const { addItemToCart } = useCart();

  const { token } = useAuth();

  const navigator = useNavigate();

  const handleGet = (_id: string) => {
    navigator(`/product/${_id}`);
  };

  return (
    <Card sx={{ maxWidth: "100%", maxHeight: "300px" }}>
      <CardActionArea onClick={() => handleGet(_id)}>
        <CardMedia sx={{ height: 140 }} image={image} title="green iguana" />

        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              fontFamily: "inherit",
              fontSize: "18px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Price: {price}$
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Quantity: {stock}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions>
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            if (!token) {
              navigator("/login");
            }
            addItemToCart(_id);
          }}
        >
          Buy
        </Button>
      </CardActions>
    </Card>
  );
}
