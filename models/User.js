import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  lastName: {
    type: String,
    minLength: 3,
    required: true,
  },
  email: {
    type: String,
    minLength: 7,
    required: true,
    unique: true,
    validate: {
      validator: (value) => /\S+@\S+\.\S+/.test(value),
      message: "El correo electrónico debe ser válido.",
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
  },
  url: {
    type: String,
  },
});

UserSchema.pre("save", function (next) {
  this.name = this.name.toLowerCase();
  this.lastName = this.lastName.toLowerCase();
  this.email = this.email.toLowerCase();
  next();
});

const User = mongoose.models.Users || mongoose.model("Users", UserSchema);
export default User;
