import mongoose from "mongoose";

export const validatorIdMongoDb = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
