// const monCompteController = require("../controller/monCompteController");
// const authController = require("../controller/authController");
// const errController = require("../controller/errController");
// const inscrireController = require("../controller/inscrireController");
const indexController = require("../controller/indexController");
const express = require("express");
const router = express.Router();

router.route("/").get(indexController.indexRedirect);

// router
//   .route("/:id")
//   .get(
//     authController.userLoggedIn,
//     authController.accountAccess,
//     monCompteController.monComptePage,
//     errController.indexError,
//     errController.globalError
//   )
//   .delete(
//     authController.userLoggedIn,
//     authController.accountAccess,
//     monCompteController.deleteService,
//     errController.indexError,
//     errController.globalError
//   );

// router
//   .route("/:id/supprimer")
//   .delete(
//     authController.userLoggedIn,
//     authController.accountAccess,
//     monCompteController.deleteAccount,
//     errController.indexError,
//     errController.globalError
//   );
// router
//   .route("/:id/ajouter")
//   .get(
//     authController.userLoggedIn,
//     authController.accountAccess,
//     monCompteController.ajouterService,
//     errController.indexError,
//     errController.globalError
//   )
//   .post(
//     authController.userLoggedIn,
//     authController.accountAccess,
//     monCompteController.uploadStoreLogo,
//     monCompteController.resizeStoreLogo,
//     monCompteController.saveService,
//     errController.indexError,
//     errController.globalError
//   );
// router
//   .route("/:id/mes-informations")
//   .get(
//     authController.userLoggedIn,
//     authController.accountAccess,
//     monCompteController.mesInfos,
//     errController.indexError,
//     errController.globalError
//   )
//   .post(
//     authController.userLoggedIn,
//     authController.accountAccess,
//     inscrireController.uploadStoreLogo,
//     inscrireController.resizeStoreLogo,
//     monCompteController.changeInfos,
//     errController.indexError,
//     errController.globalError
//   );

module.exports = router;
