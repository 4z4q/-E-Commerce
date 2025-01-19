import express from "express";
import {
  deleteUser,
  login,
  register,
  updateUser,
  getAllUsers,
} from "../services/userServices";
const userRouter = express.Router();


userRouter.get("/", async (req, res) => {
  try {
    const { data, statusCode } = await getAllUsers();
    res.status(statusCode).send(data);
  } catch {
    res.status(500).send("Something went wrong!");
  }
});

userRouter.post("/register", async (request, response) => {
  try {
    const { firstName, lastName, email, password } = request.body;
    const { statusCode, data } = await register({
      firstName,
      lastName,
      email,
      password,
    });
    response.status(statusCode).json(data);
  } catch {
    response.status(500).send("Something went wrong!");
  }
});

userRouter.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;
    const { statusCode, data } = await login({ email, password });
    response.status(statusCode).json(data);
  } catch {
    response.status(500).send("Something went wrong!");
  }
});

userRouter.put("/update", async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    const { data, statusCode } = await updateUser({
      firstName,
      lastName,
      email,
    });

    res.status(statusCode).json(data);
  } catch {
    res.status(500).send("Something went wrong!");
  }
});

userRouter.delete("/delete", async (req, res) => {
  try {
    const { email } = req.body;
    const { statusCode, data } = await deleteUser({ email });
    res.status(statusCode).json(data);
  } catch {
    res.status(500).send("Something went wrong!");
  }
});

export default userRouter;
