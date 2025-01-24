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

// تحسين اتصال mongoose
mongoose
  .connect(process.env.DATABASE_URL || "")
  .then(() => console.log("Connected Successfully"))
  .catch((err) => console.log(`Error Connecting ${err}`));

// تأكد من أن الاتصال قد تم قبل بدء الخادم
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  seedInitialProducts(); // تأكد من أن هذه الدالة لا تسبب أخطاء

  // جميع المسارات ومعالجات الطلبات هنا
  app.use("/user", userRouter);
  app.use("/products", productRouter);
  app.use("/cart", cartRouter);

  // خدمة الملفات الثابتة (مثل js, css, images)
  app.use(express.static(path.join(__dirname, "build")));

  // توجيه جميع المسارات غير المعروفة إلى index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });

  app.use(express.static(path.join(process.cwd(), "client", "dist")));

  // توجيه جميع المسارات غير المعروفة إلى index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "client", "dist", "index.html"));
  });

  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
