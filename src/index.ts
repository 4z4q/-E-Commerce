import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter";
import { seedInitialProducts } from "./services/productService";
import cartRouter from "./routers/cartRouter";
import productRouter from "./routers/productRouter";
import cors from "cors";

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());

app.use(express.json());
mongoose
  .connect(process.env.DATABASE_URL || "")
  .then(() => console.log("Connected Successfully"))
  .catch((err) => console.log(`Error Connecting ${err}`));

seedInitialProducts();

app.use("/user", userRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
