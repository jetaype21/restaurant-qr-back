import { userSchema } from "../models/schemas/schemas.js";
import { createUserOrm, loginUserOrm, updateUserOrm } from "../orm/user.orm.js";
import { codeError404 } from "../utils/httpCodes.js";
import {
  validatorSchema,
  validatorSchemaPartial,
} from "../utils/validatorSchema.js";

const userController = () => {
  const createUser = async (user) => {
    const validate = await validatorSchema(userSchema, user);
    if (validate.error) {
      return {
        status_code: codeError404,
        message: "Hay campos que no cumplen requisitos",
        errors: JSON.parse(validate.error.message),
      };
    }

    const { status_code, ...rest } = await createUserOrm(user);
    return {
      status_code,
      ...rest,
    };
  };

  const loginUser = async (user) => {
    const validate = await validatorSchemaPartial(userSchema, user);

    if (!user.email || !user.password || validate.error)
      return {
        status_code: codeError404,
        message: "Hay campos que no cumplen requisitos",
        errors: JSON.parse(validate.error.message),
      };

    const { status_code, ...rest } = await loginUserOrm(user);
    return {
      status_code,
      ...rest,
    };
  };

  const updateUser = async (user, userId) => {
    const validate = await validatorSchemaPartial(userSchema, user);

    if (validate.error || !userId)
      return {
        status_code: codeError404,
        message: "no se cumplen parámetros",
        errors: JSON.parse(validate.error.message),
      };

    const { status_code, ...rest } = await updateUserOrm(user, userId);

    return {
      status_code,
      ...rest,
    };
  };

  return { createUser, loginUser, updateUser };
};

export default userController;
