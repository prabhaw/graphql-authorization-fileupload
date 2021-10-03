const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["director", "admin"],
    required: true,
    default: "director",
  },
  permission: { type: [String], required: true, default: ["read:own_user"] },
});

const UserModal = mongoose.model("user", UserSchema);
module.exports = UserModal;
