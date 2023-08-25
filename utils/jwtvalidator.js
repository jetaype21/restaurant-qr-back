import jwt from "jsonwebtoken";
import { codeError401 } from "./httpCodes.js";
import dotenv from "dotenv";

dotenv.config();
export const jwtvalidator = (req, res, next) => {
  let token = req.headers["Authorization"] || req.headers["authorization"];

  if (!token) {
    return res.status(codeError401).json({
      message: "Acceso denegado",
    });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trimLeft();
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET);

  req.user = verified;

  next();
};
