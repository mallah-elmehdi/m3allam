$(document).ready(function () {
  document.getElementById("experience").setCustomValidity("هذا الحقل مطلوب");
  document.getElementById("explain").setCustomValidity("هذا الحقل مطلوب");
  document.getElementById("type-service").setCustomValidity("هذا الحقل مطلوب");
  document.getElementById("picture").setCustomValidity("هذا الحقل مطلوب");
  document.getElementById("diplom1").setCustomValidity("هذا الحقل مطلوب");
  document.getElementById("diplom2").setCustomValidity("هذا الحقل مطلوب");
  
  // ======================= VALIDATION
  var checkLetter = /^(?:[a-zA-Z0-9\ \u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]|(?:\uD802[\uDE60-\uDE9F]|\uD83B[\uDE00-\uDEFF]))+$/;

  $("#experience").keyup(function () {
    if (
      $(this).val() < 0 ||
      $(this).val() > 50
    ) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      $("#expe-feed")[0].innerHTML = "يجب أن تكون سنوات الخبرة بين 0 و 50 سنة"
      this.setCustomValidity("هذا الرقم غير صحيح");
    } 
   
    else if($(this).val().length === 0) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("هذا الحقل مطلوب");
      $("#expe-feed")[0].innerHTML = "هذا الحقل مطلوب"
    }

    else {
      $(this).removeClass("is-invalid").addClass("is-valid");
      this.setCustomValidity("");
      $("#expe-feed")[0].innerHTML = ""
    }
  });

    // === service

    $("#type-service").change(function () {
      $(this).addClass("is-valid");
      this.setCustomValidity("");
    });
  
    // === explain

  $("#explain").keyup(function () {
    if ($(this).val().length === 0) {
      $(this).removeClass("is-valid").addClass("is-invalid");

      $("#strlength")[0].innerHTML = `${$(this).val().length}/200`;
      $("#my-feed ")[0].innerHTML = "هذا الحقل مطلوب";
      $("#strlength").removeClass("text-success").addClass("text-danger");
      this.setCustomValidity("هذا الحقل مطلوب");
    } 
    
    else if ($(this).val().length > 200) {
      $(this).removeClass("is-valid").addClass("is-invalid");

      $("#strlength")[0].innerHTML = `${$(this).val().length}/200`;
      $("#my-feed ")[0].innerHTML = "لديك حق في 200 حرف فقط";
      $("#strlength").removeClass("text-success").addClass("text-danger");
      this.setCustomValidity("لديك حق في 200 حرف فقط");
    } 
    
    else if (!$(this).val().match(checkLetter)) {
      $(this).removeClass("is-valid").addClass("is-invalid");

      $("#my-feed ")[0].innerHTML = "بعض العناصر غير مسموح بها";
      $("#strlength").removeClass("text-success").addClass("text-danger");
      this.setCustomValidity("بعض العناصر غير مسموح بها");
    }

    else if ($(this).val().length < 100) {
      $(this).removeClass("is-valid").addClass("is-invalid");

      $("#strlength")[0].innerHTML = `${$(this).val().length}/200`;
      $("#my-feed ")[0].innerHTML ="اكتب 100 حرف على الأقل";
      $("#strlength").removeClass("text-success").addClass("text-danger");
      this.setCustomValidity("اكتب 100 حرف على الأقل");
    } 
    
    else {
      $(this).removeClass("is-invalid").addClass("is-valid");

      $("#strlength")[0].innerHTML = `${$(this).val().length}/200`;
      $("#strlength").addClass("text-success").removeClass("text-danger");
      $("#my-feed ")[0].innerHTML = "";
      this.setCustomValidity("");
    }
  });

    // === picture

    $("#picture-preview").hide()
    $("#picture").change(function () {
      const picture = $(this)[0].files[0];
  
      if (picture) {
        const type = $(this)[0].files[0].type.split("/");
        
        if (type[0] === "image" && (type[1] === "png" || type[1] === "jpg" || type[1] === "jpeg")) {
          
          const reader = new FileReader();
          reader.addEventListener("load", function () {
            $("#preview").attr("src", this.result);
          });
          $("#picture-preview").fadeIn(500)
          reader.readAsDataURL(picture);
          $(this).addClass("is-valid").removeClass("is-invalid")
          $("#custom-feed")[0].innerHTML =  "" 
          this.setCustomValidity("");
        }
  
        else {
          $(this).addClass("is-invalid").removeClass("is-valid")
          $("#custom-feed")[0].innerHTML =  "png او jpg او jpeg الصور المقبولة هي الصور التي من نوع" 
          this.setCustomValidity("الصورة غير مقبولة");
        }
      }
      else {
        $("#picture-preview").hide()
        $("#picture-preview").attr("src", "");
        $(this).addClass("is-invalid").removeClass("is-valid")
        $("#custom-feed")[0].innerHTML =  "هذا الحقل مطلوب" 
        this.setCustomValidity("هذا الحقل مطلوب");
      }
  
      $("#remove").click(function() {
        $("#picture-preview").hide()
        $("#preview").attr("src", "");
        $("#picture").addClass("is-invalid").removeClass("is-valid")
        $("#custom-feed")[0].innerHTML =  "هذا الحقل مطلوب" 
        document.getElementById("picture").setCustomValidity("هذا الحقل مطلوب");
      })
    });

  // === diploma

  $("input[name=diploma]").change(function () {
    $("input[name=diploma]").addClass("is-valid");
    document.getElementsByName("diploma")[0].setCustomValidity("");
    document.getElementsByName("diploma")[1].setCustomValidity("");
  });

});
