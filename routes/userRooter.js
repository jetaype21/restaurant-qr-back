import express from "express";
import User from "../models/User.js";
import { codeError404, codeSuccess201 } from "../utils/httpCodes.js";
import userController from "../controllers/user.controller.js";
import { jwtvalidator } from "../utils/jwtvalidator.js";
import Menu from "../models/Menu.js";
const userRouter = express.Router();

const { createUser, loginUser, updateUser } = userController();

// Get all users and create a new one
userRouter
  .route("/")
  .get(async (req, res) => {
    try {
      const users = await User.find();

      return res.status(codeSuccess201).json({
        users: users,
      });
    } catch (error) {
      return res.status(codeError404).json({
        error: error.message || "Ocurrió un error al obtener",
      });
    }
  })
  .post(async (req, res) => {
    const body = req.body;

    const { status_code, ...rest } = await createUser(body);

    res.status(status_code).json(rest);
  });

// user Login
userRouter.route("/login").post(async (req, res) => {
  const body = req.body;

  const { status_code, ...rest } = await loginUser(body);

  res.status(status_code).json(rest);
});

userRouter
  .route("/:id")
  .patch(jwtvalidator, async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const { status_code, ...rest } = await updateUser(body, id);
    res.status(status_code).json(rest);
  })
  .get(jwtvalidator, async (req, res) => {
    const { id } = req.params;
    const menus = await Menu.find({
      user_create: id,
    });

    res.status(codeSuccess201).json({
      menus,
    });
  });

export default userRouter;
