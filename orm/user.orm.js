import User from "../models/User.js";
import jwt from "jsonwebtoken";
import qrCode from "qrcode";

import {
  codeError401,
  codeError404,
  codeErrorInternal,
  codeSuccess201,
} from "../utils/httpCodes.js";
import bcrypt from "bcrypt";
import { validatorIdMongoDb } from "../utils/validatorIdMongoDb.js";
import Qr from "../models/Qr.js";

const UserModel = User;

export const createUserOrm = async (user) => {
  try {
    let userCreate;

    const { password, email } = user;

    await UserModel.findOne({ email: { $regex: email, $options: "i" } })
      .then((userRes) => {
        if (userRes) {
          throw new Error(`El usuario con correo ${userRes.email} ya existe.`);
        }
      })
      .catch((err) => {
        throw new Error(err);
      });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await UserModel.create({ ...user, password: passwordHash })
      .then((userRes) => {
        userCreate = userRes;
      })
      .catch((err) => {
        throw new Error(err);
      });

    delete userCreate._doc.password;

    let qrCcontent = `https://restaurantqr.netlify.app/${userCreate._doc._id}/menu`;

    qrCode.toDataURL(qrCcontent, function (err, url) {
      if (err) {
        console.log("Ocurrio un error al crear qr");
      }

      Qr.create({
        user_create: userCreate._doc._id,
        content: qrCcontent,
        qrDataUrl: url,
      })
        .then((qrRes) => {
          console.log("qr creado");
        })
        .catch((err) => {
          console.log("error al crear qr", err);
        });
    });

    return {
      status_code: codeSuccess201,
      message: "Usuario creado exitosamente",
      user: userCreate,
    };
  } catch (error) {
    return {
      status_code: codeErrorInternal,
      message: error.message || "Ocurrió un error interno.",
    };
  }
};

export const loginUserOrm = async (user) => {
  try {
    let userLogin;

    const { email, password } = user;

    await UserModel.findOne({ email: new RegExp(`^${email}$`, "i") })
      .then((userRes) => {
        if (!userRes) {
          throw new Error(`El usuario con correo ${email} no esta registrado.`);
        }
        userLogin = userRes;
      })
      .catch((err) => {
        throw new Error(err);
      });

    const isMatch = await bcrypt.compare(password, userLogin.password);

    if (!isMatch) {
      throw new Error("Contraseña incorrecta.");
    }

    let qrFind;

    // obtain qr
    await Qr.findOne({
      user_create: userLogin._doc._id,
    })
      .then((qr) => {
        if (!qr) {
          throw new Error("No se encontro qr");
        }

        qrFind = qr.qrDataUrl;
      })
      .catch((err) => {
        throw new Error(err);
      });

    // Create token for login
    const token = jwt.sign({ id: userLogin._id }, process.env.JWT_SECRET);

    delete userLogin._doc.password;

    return {
      status_code: codeSuccess201,
      message: "Usuario logueado exitosamente",
      user: userLogin,
      token: token,
      qrFind,
    };
  } catch (error) {
    return {
      status_code: codeError401,
      message: error.message || "Ocurrión un error interno.",
    };
  }
};

export const updateUserOrm = async (user, userId) => {
  try {
    let userUpdate;

    const validId = validatorIdMongoDb(userId);

    if (!validId) {
      return {
        status_code: codeError404,
        message: "debe proveer un Id valido",
      };
    }

    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(user.password, salt);
      user.password = passwordHash;
    }

    await UserModel.findByIdAndUpdate(userId, { ...user }, { new: true })
      .then((userRes) => {
        if (!userRes) {
          throw new Error(`El usuario con id ${userId} no existe.`);
        }

        userUpdate = userRes;
      })
      .catch((err) => {
        console.log("error catch", err);
        throw new Error(err);
      });

    delete userUpdate._doc.password;

    return {
      status_code: codeSuccess201,
      message: "Usuario actualizado exitosamente",
      user: userUpdate,
    };
  } catch (error) {
    return {
      status_code: codeErrorInternal,
      message: error.message || "Ocurrió un error interno.",
    };
  }
};
