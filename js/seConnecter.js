$(document).ready(function () {
  document.getElementById("phone").setCustomValidity("هذا الحقل مطلوب");
  document
    .getElementById("checking")
    .setCustomValidity('ادخل الرمز ثم اضغط على الزر "تحقق"');

  // ======================= VALIDATION

  var checkNumber = /^[0-9]+$/;

  // === phone

  $("#phone").keyup(function () {
    if (!$(this).val().match(checkNumber) && $(this).val().length > 0) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("هذا الرقم غير صحيح");
      $("#phone-feed")[0].innerHTML = "يجب أن يحتوي رقم الهاتف على أرقام فقط";
    } else if (
      ($(this).val()[0] != "0" ||
        ($(this).val()[1] != "5" &&
          $(this).val()[1] != "6" &&
          $(this).val()[1] != "7")) &&
      $(this).val().length > 0
    ) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("هذا الرقم غير صحيح");
      $("#phone-feed")[0].innerHTML =
        "يجب عليك كتابة الرقم هكذا ...06 أو ...05 أو ...07";
    } else if ($(this).val().length === 0) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("هذا الحقل مطلوب");
      $("#phone-feed")[0].innerHTML = "هذا الحقل مطلوب";
    } else if (
      $(this).val().length > 10 ||
      ($(this).val().length < 10 && $(this).val().length > 0)
    ) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("هذا الرقم غير صحيح");
      $("#phone-feed")[0].innerHTML = "يجب أن يحتوي رقم الهاتف على 10 أرقام";
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
        'اضغط على الزر "أرسل الرمز" للتحقق من رقم هاتفك';
      if (
        finalnumber != "" &&
        finalnumber != `+212${$("#phone").val().substring(1)}`
      ) {
        $("#phone").removeClass("is-valid").addClass("is-invalid");
        document
          .getElementById("phone")
          .setCustomValidity('اضغط على الزر "أرسل الرمز" للتحقق من رقم هاتفك');
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
      document.getElementById("phone").setCustomValidity("هذا الحقل مطلوب");
      $("#phone-feed")[0].innerHTML = "هذا الحقل مطلوب";
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
              '<div class="alert alert-warning alert-dismissible text-center fixed-top w-100 fade show" role="alert">لقد تم ارسال رمز التحقق إلى رقم هاتفك<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'
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
              `<div class="alert alert-danger alert-dismissible text-center fixed-top w-100 fade show" role="alert">رقم الهاتف غير صحيح<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`
            );
            $("#phone").removeClass("is-valid").addClass("is-invalid");
            document
              .getElementById("phone")
              .setCustomValidity("هذا الرقم غير صحيح");
            $("#phone-feed")[0].innerHTML = "لا يوجد اي منخرط في هذا الرقم";
          } else $("#alt").append(`<div class="alert alert-danger alert-dismissible text-center fixed-top w-100 fade show" role="alert">لقد تم ايقاف هذا الرقم مؤقتا يرجى المحاولة مرة أخرى في وقت لاحق<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>`);
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
          .setCustomValidity("هذا الحقل مطلوب");
        $("#code-feed")[0].innerHTML = "أدخل الرمز هنا";
      } else {
        $("#checking").removeClass("is-invalid");
        document.getElementById("checking").setCustomValidity("");
        $("#code-feed")[0].innerHTML = "";

        confirmationResult
          .confirm(code)
          .then(function (result) {
            finalnumber = result.user.phoneNumber;
            $("form").attr("action", `/ar/se-connecter?phone=${result.user.phoneNumber}`)
            $("#code-check")
              .addClass("btn-outline-success")
              .removeClass("btn-outline-danger");
            $("#checking").removeClass("is-invalid").addClass("is-valid");
            document.getElementById("checking").setCustomValidity("");
            $("#code-feed")[0].innerHTML = "";
            $("#valida")[0].innerHTML = "الرمز صحيح";
          })
          .catch(function (error) {
            var err = error + "";
            $("#checking").removeClass("is-valid").addClass("is-invalid");
            document
              .getElementById("checking")
              .setCustomValidity("الرمز غير صحيح");
            if (err.startsWith("Error: The SMS verification code"))
              $("#code-feed")[0].innerHTML = "الرمز الذي أدخلته غير صحيح";
            else
              $("#code-feed")[0].innerHTML =
                'اضغط على الزر "أرسل الرمز" لإرسال رمز آخرا';
          });
      }
    }

    // firebase.auth().onAuthStateChanged(function (user) {
    //   if (user) {
    //     console.log(user);
    //   } else {
    //     console.log("USER NOT LOGGED IN");
    //   }
    // });
  });
});
