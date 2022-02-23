$(document).ready(function () {
  $("#city").hide();

  $("#jiha").change(function () {
    $("#city").fadeIn(300);
    $("#city").empty();
    $.getJSON(`/../json/${$(this).val()}.json`, function (result) {
      $.each(result, function (i) {
        $("#city").append(
          `<option value='{"fr": "${result[i].fr}", "ar": "${result[i].ar}"}'>${result[i].ar}</option>`
        );
      });
    });
  });
  $(".sub-mit").click(function () {
    if (!$("#jiha").val()) {
      $("#jiha").addClass("is-invalid");
      document.getElementById("jiha").setCustomValidity("هذا الحقل مطلوب");
    }
  });

  $("#jiha").change(function () {
    $(this).addClass("is-valid").removeClass("is-invalid");
    this.setCustomValidity("");
  });
});
