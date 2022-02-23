// const inscrireController = require("../controller/inscrireController");
// const authController = require("../controller/authController");
// const errController = require("../controller/errController");
const indexController = require("../controller/indexController");
const express = require("express");
const router = express.Router();

router.route("/").get(indexController.indexRedirect);

// router
//   .route("/:lang")
//   .get(
//     authController.restricto,
//     authController.inscrireRestriction,
//     inscrireController.inscrirePage,
//     errController.indexError,
//     errController.globalError
//   )
//   .post(
//     authController.restricto,
//     authController.inscrireRestriction,
//     inscrireController.uploadStoreLogo,
//     inscrireController.resizeStoreLogo,
//     inscrireController.inscrireSave,
//     errController.indexError,
//     errController.globalError
//   );
module.exports = router;
