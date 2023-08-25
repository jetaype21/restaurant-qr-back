import mongoose from "mongoose";

const platoDetail = {
  name: { type: String, required: true },
  prices: [{ type: Number, required: true }],
};

const menuSchema = mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  image: {
    type: String,
    required: true,
    default:
      "https://media.istockphoto.com/id/1311705006/es/foto/borde-de-la-esquina-de-la-barra-de-tacos-con-una-variedad-de-ingredientes-sobre-un-fondo-de.webp?b=1&s=170667a&w=0&k=20&c=9GMmVxqS5lERH02jq7DQBDFVMG0vnK3B0E8QuUSX1Ko=",
  },
  user_create: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  status: {
    type: Boolean,
    default: false,
  },
  entradas: [platoDetail],
  principal: [platoDetail],
  postres: [platoDetail],
  especiales: [platoDetail],
});

const Menu = mongoose.models.Menus || mongoose.model("Menus", menuSchema);

export default Menu;
