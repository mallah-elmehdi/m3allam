$(document).ready(function () {
  document.getElementById("name").setCustomValidity("هذا الحقل مطلوب");
  document.getElementById("jiha").setCustomValidity("هذا الحقل مطلوب");
  document.getElementById("whatsOuiNo1").setCustomValidity("هذا الحقل مطلوب");
  document.getElementById("whatsOuiNo2").setCustomValidity("هذا الحقل مطلوب");
  document.getElementById("picture").setCustomValidity("هذا الحقل مطلوب");
  // ======================= ADD REGION AND CITY

  $("#city").hide();
  $("#jiha").change(function () {
    $("#city").fadeIn(500);
    $("#city").empty();
    $.getJSON(`/../json/${$(this).val()}.json`, function (result) {
      $.each(result, function (i) {
        $("#city").append(
          `<option value='{"fr": "${result[i].fr}", "ar": "${result[i].ar}"}'>${result[i].ar}</option>`
        );
      });
    });
  });

  // ======================= VALIDATION

  var checkLetter = /^(?:[a-zA-Z\ \u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]|(?:\uD802[\uDE60-\uDE9F]|\uD83B[\uDE00-\uDEFF]))+$/;

  // === name

  $("#name").keyup(function () {
    if (
      $(this).val().length < 5 &&
      $(this).val().length > 0 &&
      $(this).val().match(checkLetter)
    ) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("هذا الاسم غير صحيح");
      $("#name-feed")[0].innerHTML = "يجب أن يحتوي الاسم على 5 أحرف على الاقل";
    } else if (!$(this).val().match(checkLetter)) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("هذا الاسم غير صحيح");
      $("#name-feed")[0].innerHTML = "يجب أن يحتوي الاسم على أحرف فقط";
    } else if ($(this).val().length === 0) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("هذا الحقل مطلوب");
      $("#name-feed")[0].innerHTML = "هذا الحقل مطلوب";
    } else if ($(this).val().length > 30) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("هذا الاسم غير صحيح");
      $("#name-feed")[0].innerHTML = "يجب أن يحتوي الاسم على 30 حرف على الاكثر";
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
      } else {
        $(this).addClass("is-invalid").removeClass("is-valid");
        $("#custom-feed")[0].innerHTML =
          "png او jpg او jpeg الصور المقبولة هي الصور التي من نوع";
        this.setCustomValidity("الصورة غير مقبولة");
      }
    } else {
      $("#picture-preview").hide();
      $("#preview").attr("src", "");
      $(this).addClass("is-invalid").removeClass("is-valid");
      $("#custom-feed")[0].innerHTML = "هذا الحقل مطلوب";
      this.setCustomValidity("هذا الحقل مطلوب");
    }

    $("#remove").click(function () {
      $("#picture-preview").hide();
      $("#preview").attr("src", "");
      $("#picture").addClass("is-invalid").removeClass("is-valid");
      $("#custom-feed")[0].innerHTML = "هذا الحقل مطلوب";
      document.getElementById("picture").setCustomValidity("هذا الحقل مطلوب");
    });
  });


});
