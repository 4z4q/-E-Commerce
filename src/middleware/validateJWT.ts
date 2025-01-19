import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";
import { ExtendRequest } from "../types/extandRequest";

// This Method => Middleware => Validate JWT Token => Check If Token Is Valid Or Not => Get User Data

const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
  const authorizationHeader = req.get("authorization");

  if (!authorizationHeader) {
    res.status(403).send("Authorization header is not provide");
    return;
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    res.status(401).send("Bearer Token  not Found");
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || "", async (err, payload) => {
    try {
      if (err) {
        res.status(403).send("Token Is Invalid");
        return;
      }

      if (!payload) {
        res.status(403).send("Payload Is Invalid");
        return;
      }

      const data = payload as {
        firstName: string;
        lastName: string;
        email: string;
      };

      const user = await userModel.findOne({ email: data.email });

      req.user = user;

      next();
    } catch (error) {
      throw new Error("Invalid Verify JWT")
    }
  });
};

export default validateJWT;
