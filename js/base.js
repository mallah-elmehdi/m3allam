var i = 1;
while (i <= 90) {
  setTimeout(function () {
    $(".progress-bar").attr("style", `width : ${i}%`);
  }, 100);
  i++;
}

$(document).ready(function () {
  setTimeout(function () {
    $(".progress-bar").attr("style", "width : 100%");
  }, 100);

  setTimeout(function () {
    $(".progress").fadeOut(500);
  }, 500);

  $(function () {
    $('[data-toggle="popover"]').popover();
  });
  $(".dbiha").click(function () {
    if ($("#Whats").hasClass("floating-wpp")) {
      $("#Whats").empty();
    }

    $("#Whats").floatingWhatsApp({
      phone: `${$(this).data("phone")}`,
      headerTitle: "واتس اب",
      popupMessage: "مرحبا كيف يمكننا مساعدتك؟",
      showPopup: true,
      autoOpenTimeout: 10,
      position: "right",
    });
  });

  var scrollbar = document.getElementsByTagName("body")[0].scrollHeight;

  if (scrollbar < window.innerHeight) $("#footer").addClass("fixed-bottom");
  if (scrollbar >= window.innerHeight) $("#footer").removeClass("fixed-bottom");

  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
  
});