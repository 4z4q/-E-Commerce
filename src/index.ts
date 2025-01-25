import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter";
import { seedInitialProducts } from "./services/productService";
import cartRouter from "./routers/cartRouter";
import productRouter from "./routers/productRouter";
import cors from "cors";
import path from "path";
import fs from "fs";

const app = express();
const port = process.env.PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the new path
const staticPath = path.resolve(__dirname, "..", "client", "dist");
app.use(express.static(staticPath));

const indexPath = path.join(staticPath, "index.html");

if (fs.existsSync(indexPath)) {
  console.log("index.html exists at:", indexPath);
} else {
  console.error("index.html does NOT exist at:", indexPath);
}

// Connect to MongoDB database
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DATABASE_URL || "")
  .then(() => console.log("Connected Successfully"))
  .catch((err) => {
    console.error(`Error Connecting: ${err}`);
    process.exit(1);
  });

// Start the server after connecting to the database
mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB");
  try {
    await seedInitialProducts();
  } catch (err) {
    console.error("Error seeding initial products:", err);
  }

  // Define routes
  app.use("/user", userRouter);
  app.use("/products", productRouter);
  app.use("/cart", cartRouter);

  // Route for single-page applications (SPA)
  app.get("*", (req, res) => {
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Frontend build not found.");
    }
  });

  console.log("Static files path:", staticPath);
  console.log("Index.html path:", indexPath);

  // Error handling
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
