// const inscrireController = require("../controller/inscrireController");
// const authController = require("../controller/authController");
// const errController = require("../controller/errController");
const indexController = require("../controller/indexController");
const express = require("express");
const router = express.Router();

router.route("/").get(indexController.indexRedirect);

// router
//   .route("/")
//   .get(
//     authController.restricto,
//     inscrireController.seConnecterPage,
//     errController.indexError,
//     errController.globalError
//   )
//   .post(
//     authController.restricto,
//     inscrireController.seConnecterPost,
//     errController.indexError,
//     errController.globalError
//   );

module.exports = router;
