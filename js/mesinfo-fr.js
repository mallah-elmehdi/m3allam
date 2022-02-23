$(document).ready(function () {
  // ======================= ADD REGION AND CITY
  $.getJSON(`/../json/${$("#jiha").val()}.json`, function (result) {
    $.each(result, function (i) {
      if ($("#city").data("city") === result[i].type)
        $("#city").append(
          `<option value='{"fr": "${result[i].fr}", "ar": "${result[i].ar}"}' selected>${result[i].fr}</option>`
        );
      else
        $("#city").append(
          `<option value='{"fr": "${result[i].fr}", "ar": "${result[i].ar}"}'>${result[i].fr}</option>`
        );
    });
  });
  $("#jiha").change(function () {
    $("#city").empty();
    $("#city").addClass("is-valid");
    $.getJSON(`/../json/${$(this).val()}.json`, function (result) {
      $.each(result, function (i) {
        $("#city").append(
          `<option value='{"fr": "${result[i].fr}", "ar": "${result[i].ar}"}'>${result[i].fr}</option>`
        );
      });
    });
  });

  // ======================= VALIDATION

  var checkLetter = /^(?:[a-zA-Z\ \u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]|(?:\uD802[\uDE60-\uDE9F]|\uD83B[\uDE00-\uDEFF]))+$/;
  var checkNumber = /^[0-9]+$/;

  // === phone

  $("#phone").keyup(function () {
    document.getElementById("phone").setCustomValidity("Ce champ est obligatoire");
    document
      .getElementById("checking")
      .setCustomValidity('Entrez le code et appuyez sur le bouton "Vérifier"');
    if (!$(this).val().match(checkNumber) && $(this).val().length > 0) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("Ce nombre est incorrect");
      $("#whatsapp-text")[0].innerHTML = `Utilisez-vous ce numéro sur WhatsApp?`;
      $("#phone-feed")[0].innerHTML = "Le numéro de téléphone ne doit contenir que des chiffres";
    } else if (
      ($(this).val()[0] != "0" ||
        ($(this).val()[1] != "5" &&
          $(this).val()[1] != "6" &&
          $(this).val()[1] != "7")) &&
      $(this).val().length > 0
    ) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("Ce nombre est incorrect");
      $("#whatsapp-text")[0].innerHTML = `Utilisez-vous ce numéro sur WhatsApp?`;
      $("#phone-feed")[0].innerHTML =
        "Vous devez écrire le numéro comme ceci ... 06, ... 05, ou ... 07";
    } else if ($(this).val().length === 0) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("Ce champ est obligatoire");
      $("#whatsapp-text")[0].innerHTML = `Utilisez-vous ce numéro sur WhatsApp?`;
      $("#phone-feed")[0].innerHTML = "Ce champ est obligatoire";
    } else if (
      $(this).val().length > 10 ||
      ($(this).val().length < 10 && $(this).val().length > 0)
    ) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("Ce nombre est incorrect");
      $("#whatsapp-text")[0].innerHTML = `Utilisez-vous ce numéro sur WhatsApp?`;
      $("#phone-feed")[0].innerHTML = "Le numéro de téléphone doit contenir 10 chiffres";
    } else {
      $(this).removeClass("is-invalid").addClass("is-valid");
      $("#whatsapp-text")[0].innerHTML = `Utilisez-vous ce numéro ${$(
        "#phone"
      ).val()} sur WhatsApp`;
      this.setCustomValidity("");
    }
  });

  // === name

  $("#name").keyup(function () {
    if (
      $(this).val().length < 5 &&
      $(this).val().length > 0 &&
      $(this).val().match(checkLetter)
    ) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("Ce nom est incorrect");
      $("#name-feed")[0].innerHTML = "Le nom doit contenir au moins 5 caractères";
    } else if (!$(this).val().match(checkLetter)) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("Ce nom est incorrect");
      $("#name-feed")[0].innerHTML = "Le nom ne doit contenir que des lettres";
    } else if ($(this).val().length === 0) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("Ce champ est obligatoire");
      $("#name-feed")[0].innerHTML = "Ce champ est obligatoire";
    } else if ($(this).val().length > 30) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("Ce nom est incorrect");
      $("#name-feed")[0].innerHTML = "Le nom doit contenir au maximum 30 caractères";
    } else {
      $(this).removeClass("is-invalid").addClass("is-valid");
      this.setCustomValidity("");
    }
  });

  // === jiha

  $("#jiha").change(function () {
    $(this).addClass("is-valid");
    this.setCustomValidity("");
  });

  // === whatsapp

  $("input[name=whatsapp]").change(function () {
    $("input[name=whatsapp]").addClass("is-valid");
    document.getElementsByName("whatsapp")[0].setCustomValidity("");
    document.getElementsByName("whatsapp")[1].setCustomValidity("");
  });

  // === picture
  $("#picture-preview").hide();
  $("#picture").change(function () {
    const picture = $(this)[0].files[0];

    if (picture) {
      const type = $(this)[0].files[0].type.split("/");

      if (
        type[0] === "image" &&
        (type[1] === "png" || type[1] === "jpg" || type[1] === "jpeg")
      ) {
        const reader = new FileReader();
        reader.addEventListener("load", function () {
          $("#preview").attr("src", this.result);
        });
        $("#picture-preview").fadeIn(500);
        reader.readAsDataURL(picture);
        $(this).addClass("is-valid").removeClass("is-invalid");
        $("#custom-feed")[0].innerHTML = "";
        this.setCustomValidity("");
        $("#pic-profile").hide();
      } else {
        $(this).addClass("is-invalid").removeClass("is-valid");
        $("#custom-feed")[0].innerHTML =
          "Les images PNG, JPG ou JPEG sont acceptées";
        this.setCustomValidity("L'image n'est pas acceptée");
        $("#pic-profile").show();
        $("#picture").val("")
    }
    } else {
      $("#picture-preview").hide();
      $("#preview").attr("src", "");
      $("#pic-profile").show();
      $("#picture").val("")
    }

    $("#remove").click(function () {
      $("#picture-preview").hide();
      $("#preview").attr("src", "");
      $("#pic-profile").show();
      $("#picture").val("")
    });
  });

  $(".edittt").hide();
  $("#edit").click(function () {
    $("fieldset").attr("disabled", null);
    $("#hoha").removeClass("btn-secondary").addClass("btn-warning");
    $("#picture-check").removeClass("my-bg");
    $("#edit").hide();
    $(".edittt").show();
  });

  //====================================== check the nuber phone
  var finalnumber = "";

  $("#submit-compte").click(function () {
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
              .setCustomValidity("Ce nombre est incorrect");
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
              .setCustomValidity("Le code est correct");
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
