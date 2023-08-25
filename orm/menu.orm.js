import {
  codeError401,
  codeError404,
  codeErrorInternal,
  codeSuccess201,
} from "../utils/httpCodes.js";
import bcrypt from "bcrypt";
import Menu from "../models/Menu.js";
import { validatorIdMongoDb } from "../utils/validatorIdMongoDb.js";

const MenuModel = Menu;

export const createMenuOrm = async (menu) => {
  try {
    let menuCreate;

    await MenuModel.create(menu)
      .then((menuRes) => {
        menuCreate = menuRes;
      })
      .catch((err) => {
        throw new Error(err);
      });

    return {
      status_code: codeSuccess201,
      message: "Menu creado exitosamente",
      menu: menuCreate,
    };
  } catch (error) {
    return {
      status_code: codeErrorInternal,
      message: error.message || "Ocurrió un error interno.",
    };
  }
};

export const updateMenuOrm = async (menu, menuId) => {
  try {
    let menuUpdate;

    const validId = validatorIdMongoDb(menuId);

    if (!validId) {
      return {
        status_code: codeError404,
        message: "debe proveer un Id valido",
      };
    }

    await MenuModel.findByIdAndUpdate(menuId, { ...menu }, { new: true })
      .then((menuRes) => {
        if (!menuRes) {
          throw new Error(`El usuario con id ${menuId} no existe.`);
        }

        menuUpdate = menuRes;
      })
      .catch((err) => {
        throw new Error(err);
      });

    delete menuUpdate._doc.password;

    return {
      status_code: codeSuccess201,
      message: "menu actualizado exitosamente",
      menu: menuUpdate,
    };
  } catch (error) {
    return {
      status_code: codeErrorInternal,
      message: error.message || "Ocurrió un error interno.",
    };
  }
};
