$(document).ready(function () {

  // ==================== BUTTON SHADOW

  $(".service").mouseover(function () {
    $(this).addClass("shadow");
    $(".service").mouseout(function () {
      $(this).removeClass("shadow");
    });
  });

  // ==================== CITY

  $.getJSON(`/../json/${$("#jiha").val()}.json`, function (result) {
    $.each(result, function (i) {
      if (result[i].fr === $("#city").data("city"))
        $("#city").append(
          `<option value='{"fr": "${result[i].fr}", "ar": "${result[i].ar}"}' selected >${result[i].ar}</option>`
        );
      else
        $("#city").append(
          `<option value='{"fr": "${result[i].fr}", "ar": "${result[i].ar}"}'>${result[i].ar}</option>`
        );
    });
  });

  $("#jiha").change(function () {
    $("#city").empty();
    $.getJSON(`/../json/${$(this).val()}.json`, function (result) {
      $.each(result, function (i) {
        $("#city").append(
          `<option value='{"fr": "${result[i].fr}", "ar": "${result[i].ar}"}'>${result[i].ar}</option>`
        );
      });
    });
  });

});
