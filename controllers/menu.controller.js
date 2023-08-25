import { menuSchema } from "../models/schemas/schemas.js";
import { createMenuOrm, updateMenuOrm } from "../orm/menu.orm.js";
import { codeError404 } from "../utils/httpCodes.js";
import {
  validatorSchema,
  validatorSchemaPartial,
} from "../utils/validatorSchema.js";

const menuController = () => {
  const createMenu = async (menu) => {
    const validate = await validatorSchema(menuSchema, menu);
    if (validate.error) {
      return {
        status_code: codeError404,
        message: "Hay campos que no cumplen requisitos",
        errors: JSON.parse(validate.error.message),
      };
    }

    const { status_code, ...rest } = await createMenuOrm(menu);
    return {
      status_code,
      ...rest,
    };
  };

  const updateMenu = async (menu, menuId) => {
    const validate = validatorSchemaPartial(menuSchema, menu);

    if (validate.error)
      return {
        status_code: codeError404,
        message: "no se cumplen parámetros",
        errors: JSON.parse(validate.error.message),
      };

    const { status_code, ...rest } = await updateMenuOrm(menu, menuId);
    return {
      status_code,
      ...rest,
    };
  };

  return { createMenu, updateMenu };
};

export default menuController;
