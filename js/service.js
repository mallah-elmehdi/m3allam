$(document).ready(function () {
  $(".service").mouseover(function () {
    $(this).addClass("shadow");
    $(".service").mouseout(function () {
      $(this).removeClass("shadow");
    });
  });
});
