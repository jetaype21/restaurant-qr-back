import express from "express";
import userRouter from "./userRooter.js";
import menuRouter from "./menuRouter.js";

const app = express();
const server = express.Router();

server.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.use("/api", server);
app.use("/users", userRouter);
app.use("/menus", menuRouter);

export default app;
