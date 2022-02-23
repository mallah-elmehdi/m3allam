const inscrireController = require("../controller/inscrireController");
const indexController = require("../controller/indexController");
const monCompteController = require("../controller/monCompteController");
const authController = require("../controller/authController");
const errController = require("../controller/errController");

const express = require("express");
const router = express.Router();

router.route("/").get(indexController.indexRedirect);

router
  .route("/:lang")
  .get(
    authController.userLoggedIn,
    indexController.indexPage,
    errController.indexError,
    errController.globalError
  )
  .post(
    authController.userLoggedIn,
    indexController.indexSearch,
    errController.indexError,
    errController.globalError
  );

// =============================== RESULTAT

router
  .route("/:lang/resultat/:city/:service/:search")
  .get(
    authController.userLoggedIn,
    indexController.resultatPage,
    errController.indexError,
    errController.globalError
  );

router
  .route("/:lang/resultat/:city/:searchANDservice")
  .get(
    authController.userLoggedIn,
    indexController.resultatPage,
    errController.indexError,
    errController.globalError
  );

router
  .route("/:lang/resultat/:city")
  .get(
    authController.userLoggedIn,
    indexController.resultatPage,
    errController.indexError,
    errController.globalError
  );

// =============================== Ouvrier

router
  .route("/:lang/ouvrier")
  .get(
    authController.userLoggedIn,
    indexController.ouvrierPage,
    errController.indexError,
    errController.globalError
  );

router
  .route("/:lang/service")
  .get(
    authController.userLoggedIn,
    indexController.servicePage,
    errController.indexError,
    errController.globalError
  );

router
  .route("/:lang/deconnecter")
  .get(
    authController.userLoggedIn,
    indexController.logOut,
    errController.indexError,
    errController.globalError
  );

router.get("/politique-de-confidentialite", indexController.privacyPage);

// ================================ inscrire

router
  .route("/:lang/inscrire")
  .get(
    authController.restricto,
    authController.inscrireRestriction,
    inscrireController.inscrirePage,
    errController.indexError,
    errController.globalError
  )
  .post(
    authController.restricto,
    authController.inscrireRestriction,
    inscrireController.uploadStoreLogo,
    inscrireController.resizeStoreLogo,
    inscrireController.inscrireSave,
    errController.indexError,
    errController.globalError
  );

// ================================ se-connecter

router
  .route("/:lang/se-connecter")
  .get(
    authController.restricto,
    inscrireController.seConnecterPage,
    errController.indexError,
    errController.globalError
  )
  .post(
    authController.restricto,
    inscrireController.seConnecterPost,
    errController.indexError,
    errController.globalError
  );

// ================================ mon-compte

router
  .route("/:lang/mon-compte/:id")
  .get(
    authController.userLoggedIn,
    authController.accountAccess,
    monCompteController.monComptePage,
    errController.indexError,
    errController.globalError
  )
  .delete(
    authController.userLoggedIn,
    authController.accountAccess,
    monCompteController.deleteService,
    errController.indexError,
    errController.globalError
  );

router
  .route("/:lang/mon-compte/:id/supprimer")
  .delete(
    authController.userLoggedIn,
    authController.accountAccess,
    monCompteController.deleteAccount,
    errController.indexError,
    errController.globalError
  );
router
  .route("/:lang/mon-compte/:id/ajouter")
  .get(
    authController.userLoggedIn,
    authController.accountAccess,
    monCompteController.ajouterService,
    errController.indexError,
    errController.globalError
  )
  .post(
    authController.userLoggedIn,
    authController.accountAccess,
    monCompteController.uploadStoreLogo,
    monCompteController.resizeStoreLogo,
    monCompteController.saveService,
    errController.indexError,
    errController.globalError
  );
router
  .route("/:lang/mon-compte/:id/mes-informations")
  .get(
    authController.userLoggedIn,
    authController.accountAccess,
    monCompteController.mesInfos,
    errController.indexError,
    errController.globalError
  )
  .post(
    authController.userLoggedIn,
    authController.accountAccess,
    inscrireController.uploadStoreLogo,
    inscrireController.resizeStoreLogo,
    monCompteController.changeInfos,
    errController.indexError,
    errController.globalError
  );

module.exports = router;
