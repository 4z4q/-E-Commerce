import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter";
import { seedInitialProducts } from "./services/productService";
import cartRouter from "./routers/cartRouter";
import productRouter from "./routers/productRouter";
import cors from "cors";
import path from "path";

const app = express();
const port = process.env.PORT || 4001;

// Middleware
app.use(
  cors({
    origin: [
      "https://client-hzfv.onrender.com",
      "https://e-commerce-p2d3.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "build")));

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URL || "")
  .then(() => console.log("Connected Successfully"))
  .catch((err) => console.log(`Error Connecting ${err}`));

// Seed initial products and start server
mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB");
  try {
    await seedInitialProducts();
  } catch (err) {
    console.error("Error seeding initial products:", err);
  }

  // Routes
  app.use("/user", userRouter);
  app.use("/products", productRouter);
  app.use("/cart", cartRouter);

  // Catch-all route for SPA
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });

  // Error handling
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  });

  // Start server
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
