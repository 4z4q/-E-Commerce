import express from "express";
import { getAllProducts } from "../services/productService";
import productModel from "../models/productModel";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).send(products);
  } catch {
    res.status(500).send("Something went wrong!");
  }
});

productRouter.get("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await productModel.findById(productId);
    res.status(200).send(product);
  } catch {
    res.status(500).send("Something went wrong!");
  }
});

productRouter.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await productModel.find({ category });
    res.status(200).send(products);
  } catch {
    res.status(500).send("Something went wrong!");
    console.log(productModel.find({}));
  }
});

export default productRouter;
