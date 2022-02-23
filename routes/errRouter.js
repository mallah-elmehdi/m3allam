const errController = require("../controller/errController");
const appError =require("../utils/appErrors")
const express = require("express");
const router = express.Router();

router.route("/").all((req, res, next) => {
  next(new appError("page not found - الصفحة غير موجودة", 404));
}, errController.globalError);

module.exports = router;
