const mongoose = require("mongoose");

// ===== THE SCHEMA

const serviceSchema = new mongoose.Schema({
  explain: {
    type: String,
    require: [true, "هذا الحقل مطلوب"],
    trim: true,
    maxlength: [200, "يجب أن يحتوي الاسم على 200 حرف على الاكثر"],
    minlength: [100, "يجب أن يحتوي الاسم على 100 أحرف على الاقل"],
  },
  service: {
    type: String,
    require: [true, "هذا الحقل مطلوب"],
  },
  experience: {
    type: Number,
    require: [true, "هذا الحقل مطلوب"],
    min: 0,
    max: 50
  },
  diploma: {
    type: String,
    require: [true, "هذا الحقل مطلوب"],
  },
  picture: {
    type: String,
    require: [true, "هذا الحقل مطلوب"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    require: [true, "هذا الحقل مطلوب"],
  },
});

const service = mongoose.model("service", serviceSchema);

module.exports = service;
