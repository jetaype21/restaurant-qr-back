import express from "express";
import menuController from "../controllers/menu.controller.js";
import Menu from "../models/Menu.js";
import { jwtvalidator } from "../utils/jwtvalidator.js";
import { validatorIdMongoDb } from "../utils/validatorIdMongoDb.js";
import { codeError404 } from "../utils/httpCodes.js";

const menuRouter = express.Router();

const { createMenu, updateMenu } = menuController();

//  get info aactive
menuRouter.route("/active/:userId").get(jwtvalidator, async (req, res) => {
  try {
    const { userId } = req.params;

    const validId = validatorIdMongoDb(userId);

    if (!validId) {
      return {
        status_code: codeError404,
        message: "debe proveer un Id valido",
      };
    }

    let menuActive;

    await Menu.findOne({
      user_create: userId,
      status: true,
    })
      .then((menu) => {
        if (!menu) {
          throw new Error("menu activo no encontrado");
        }
        menuActive = menu;
      })
      .catch((err) => {
        throw new Error(err);
      });

    return res.status(201).json({
      message: "menu recuperado",
      menu: menuActive,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "error interno no se pudo resolver",
    });
  }
});

menuRouter
  .route("/:userId/:menuId/active")
  .get(jwtvalidator, async (req, res) => {
    const { userId, menuId } = req.params;

    const validId = validatorIdMongoDb(menuId);
    const validIdII = validatorIdMongoDb(userId);

    if (!validId || !validIdII) {
      return res.status(codeError404).json({
        message: "debe proveer un Id valido",
      });
    }

    try {
      let detailInfo;

      await Menu.findOne({
        _id: menuId,
        user_create: userId,
      }).then((menu) => {
        if (!menu) {
          throw new Error("menu no encontrado");
        }
        detailInfo = menu;
      });

      return res.status(201).json({
        message: "menu recuperado",
        menu: detailInfo,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "error interno no se pudo resolver",
      });
    }
  })
  .patch(jwtvalidator, async (req, res) => {
    //  get info
    try {
      const { userId, menuId } = req.params;

      console.log(userId, menuId);

      const validId = validatorIdMongoDb(menuId);
      const validIdII = validatorIdMongoDb(userId);

      if (!validId || !validIdII) {
        return res.status(codeError404).json({
          status_code: codeError404,
          message: "debe proveer un Id valido",
        });
      }

      let menuActiveBefore;

      await Menu.findOne({
        user_create: userId,
        status: true,
      }).then((menu) => {
        menuActiveBefore = menu;
      });

      if (menuActiveBefore) {
        await Menu.findOneAndUpdate(
          {
            _id: menuActiveBefore._doc._id,
          },
          {
            status: false,
          },
          {
            new: true,
          }
        )
          .then((men) => {
            console.log("antes", men);
          })
          .catch((err) => {
            console.log(err);
          });
      }

      let menuActiveAfter;

      await Menu.findOneAndUpdate(
        {
          _id: menuId,
          user_create: userId,
        },
        {
          status: true,
        },
        {
          new: true,
        }
      )
        .then((men) => {
          menuActiveAfter = men;
        })
        .catch((err) => {
          throw new Error(err);
        });

      return res.status(201).json({
        message: "menu actualizado exitosamente",
        menu: menuActiveAfter,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "error interno no se pudo resolver",
      });
    }
  });

menuRouter.route("/:id").patch(jwtvalidator, async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  const { status_code, ...rest } = await updateMenu(body, id);

  return res.status(status_code).json(rest);
});

menuRouter
  .route("/")
  .get(async (req, res) => {
    try {
      const menus = await Menu.find();

      return res.status(201).json(menus);
    } catch (error) {
      res.status(500).json({
        error: error.message || "Ocurrió un error en el servidor",
      });
    }
  })
  .post(async (req, res) => {
    const body = req.body;

    const { status_code, ...rest } = await createMenu(body);

    res.status(status_code).json(rest);
  });
export default menuRouter;
