$(document).ready(function () {
  document.getElementById("phone").setCustomValidity("Ce champ est obligatoire");
  document
    .getElementById("checking")
    .setCustomValidity('Entrez le code et appuyez sur le bouton "Vérifier"');

  // ======================= VALIDATION

  var checkNumber = /^[0-9]+$/;

  // === phone

  $("#phone").keyup(function () {
    if (!$(this).val().match(checkNumber) && $(this).val().length > 0) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("Ce numéro est incorrect");
      $("#phone-feed")[0].innerHTML = "Le numéro de téléphone ne doit contenir que des chiffres";
    } else if (
      ($(this).val()[0] != "0" ||
        ($(this).val()[1] != "5" &&
          $(this).val()[1] != "6" &&
          $(this).val()[1] != "7")) &&
      $(this).val().length > 0
    ) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("Ce numéro est incorrect");
      $("#phone-feed")[0].innerHTML =
        "Vous devez écrire le numéro comme ceci 06... , 05... , ou 07...";
    } else if ($(this).val().length === 0) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("Ce champ est obligatoire");
      $("#phone-feed")[0].innerHTML = "Ce champ est obligatoire";
    } else if (
      $(this).val().length > 10 ||
      ($(this).val().length < 10 && $(this).val().length > 0)
    ) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("Ce numéro est incorrect");
      $("#phone-feed")[0].innerHTML = "Le numéro de téléphone doit contenir 10 chiffres";
    } else {
      $(this).removeClass("is-invalid").addClass("is-valid");
      this.setCustomValidity("");
    }
  });

  //====================================== check the nuber phone
  var finalnumber = "";

  $("#submit-signin").click(function () {
    if (
      ($("#checking").is(":invalid") &&
        !$("#code").is(":visible") &&
        $("#phone").hasClass("is-valid")) ||
      (finalnumber != "" &&
        finalnumber != `+212${$("#phone").val().substring(1)}`)
    ) {
      $("#confirm-code")
        .removeClass("btn-outline-success")
        .addClass("btn-outline-danger");
      $("#phone").removeClass("is-valid").addClass("is-invalid");
      $("#phone-feed")[0].innerHTML =
        'Cliquez sur le bouton "Envoyer le code" pour vérifier votre numéro de téléphone';
      if (
        finalnumber != "" &&
        finalnumber != `+212${$("#phone").val().substring(1)}`
      ) {
        $("#phone").removeClass("is-valid").addClass("is-invalid");
        document
          .getElementById("phone")
          .setCustomValidity('Cliquez sur le bouton "Envoyer le code" pour vérifier votre numéro de téléphone');
      }
    }
  });

  $("#code").hide();
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("captcha");

  $("#confirm-code").click(function () {
    $("#confirm-code")
      .addClass("btn-outline-success")
      .removeClass("btn-outline-danger");
    $("#phone").removeClass("is-invalid").addClass("is-valid");

    if ($("#phone").is(":valid")) {
      submitPhoneNumberAuth();
    } else {
      $("#phone").removeClass("is-valid").addClass("is-invalid");
      document.getElementById("phone").setCustomValidity("Ce champ est obligatoire");
      $("#phone-feed")[0].innerHTML = "Ce champ est obligatoire";
    }

    function submitPhoneNumberAuth() {
      $("#load").append(
        '<div class="spinner-border text-success" role="status"><span class="sr-only">Loading...</span></div>'
      );
      $("#alt").empty();
      $("#captcha").show();
      $("#code-check")
        .removeClass("btn-outline-danger")
        .addClass("btn-outline-success");
      $("#checking").removeClass("is-invalid");
      $("#checking").val("");
      $("#code").hide();

      $("#captcha").bind("DOMSubtreeModified", function () {
        if ($("#captcha").html() != "") {
          $("#load").remove();
        }
      });

      var appVerifier = window.recaptchaVerifier;
      var phoneNumber = "+212" + $("#phone").val().substring(1);

      firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(function (confirmationResult) {
          if ($("#alt").html() === "") {
            $("#alt").append(
              '<div class="alert alert-warning alert-dismissible text-center fixed-top w-100 fade show" role="alert">Le code de vérification a été envoyé à votre numéro de téléphone<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
            );
          }

          $("#confirm-code")
            .removeClass("btn-outline-danger")
            .addClass("btn-outline-success");
          $("#phone").removeClass("is-invalid").addClass("is-valid");
          document.getElementById("phone").setCustomValidity("");
          $("#phone-feed")[0].innerHTML = "";

          $("#code").fadeIn(500);
          $("#captcha").hide();
          window.confirmationResult = confirmationResult;
        })
        .catch(function (error) {
          $("#captcha").hide();
          var err = error + "";
          if (err.startsWith("Error: The format")) {
            $("#alt").append(
              `<div class="alert alert-danger alert-dismissible text-center fixed-top w-100 fade show" role="alert">Le numéro de téléphone est incorrect<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`
            );
            $("#phone").removeClass("is-valid").addClass("is-invalid");
            document
              .getElementById("phone")
              .setCustomValidity("Ce numéro est incorrect");
            $("#phone-feed")[0].innerHTML = "Il n'y a personne impliqué dans ce numéro";
          } else $("#alt").append(`<div class="alert alert-danger alert-dismissible text-center fixed-top w-100 fade show" role="alert">Ce numéro a été suspendu. Veuillez réessayer plus tard<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`);
        });
    }

    $("#code-check").click(function () {
      finalnumber = "+212" + $("#phone").val().substring(1);
      submitPhoneNumberAuthCode();
    });

    function submitPhoneNumberAuthCode() {
      var code = $("#checking").val();
      if (!code) {
        $("#checking").removeClass("is-valid").addClass("is-invalid");
        document
          .getElementById("checking")
          .setCustomValidity("Ce champ est obligatoire");
        $("#code-feed")[0].innerHTML = "Entrez le code ici";
      } else {
        $("#checking").removeClass("is-invalid");
        document.getElementById("checking").setCustomValidity("");
        $("#code-feed")[0].innerHTML = "";

        confirmationResult
          .confirm(code)
          .then(function (result) {
            finalnumber = result.user.phoneNumber;
            $("form").attr("action", `/fr/se-connecter?phone=${result.user.phoneNumber}`)
            $("#code-check")
              .addClass("btn-outline-success")
              .removeClass("btn-outline-danger");
            $("#checking").removeClass("is-invalid").addClass("is-valid");
            document.getElementById("checking").setCustomValidity("");
            $("#code-feed")[0].innerHTML = "";
            $("#valida")[0].innerHTML = "Le code est correct";
          })
          .catch(function (error) {
            var err = error + "";
            $("#checking").removeClass("is-valid").addClass("is-invalid");
            document
              .getElementById("checking")
              .setCustomValidity("Le code est incorrect");
            if (err.startsWith("Error: The SMS verification code"))
              $("#code-feed")[0].innerHTML = "Le code que vous avez entré n'est pas valide";
            else
              $("#code-feed")[0].innerHTML =
                'Cliquez sur le bouton "Envoyer le code" pour envoyer un autre code';
          });
      }
    }
  });
});
