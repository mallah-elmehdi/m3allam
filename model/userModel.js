const mongoose = require("mongoose");
const validator = require("validator");

// ===== THE SCHEMA

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "هذا الحقل مطلوب"],
    trim: true,
    maxlength: [30, "يجب أن يحتوي الاسم على 30 حرف على الاكثر"],
    minlength: [5, "يجب أن يحتوي الاسم على 5 أحرف على الاقل"],
  },
  phone: {
    type: String,
    require: [true, "هذا الحقل مطلوب"],
    unique: true,
  },
  jiha: {
    type: String,
    require: [true, "هذا الحقل مطلوب"],
  },
  city: {
    type: Object,
    require: [true, "هذا الحقل مطلوب"],
  },
  whatsapp: {
    type: String,
    require: [true, "هذا الحقل مطلوب"],
  },
  photo: {
    type: String,
    require: [true, "هذا الحقل مطلوب"],
    default: "user.png"
  },
  valid: {
    type: String,
    require: [true, "هذا الحقل مطلوب"],
    default: "non"
  }
});

const user = mongoose.model("user", userSchema);

module.exports = user;
