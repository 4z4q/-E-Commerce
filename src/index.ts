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

  // معالج الأخطاء العام (يجب أن يكون الأخير)
  app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
