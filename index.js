// dependencias
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

// local
import rootRouter from "./routes/rootRouter.js";
import morgan from "morgan";

const app = express();

//CONFIGURACIONES
app.disable("x-powered-by");
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("common"));

const PORT = process.env.PORT || 8000;

// Mongoose connection and server init
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `El servidor está corriendo en el puerto => localhost:${PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

// app.listen(PORT, () => {
//   console.log(`El servidor está corriendo en el puerto => localhost:${PORT}`);
// });

// directory main
app.use("/api", rootRouter);
