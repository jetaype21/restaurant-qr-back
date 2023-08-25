import mongoose from "mongoose";

const qrSchema = mongoose.Schema({
  user_create: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  content: String,
  qrDataUrl: String,
});

const Qr = mongoose.models.qrs || mongoose.model("qrs", qrSchema);

export default Qr;
