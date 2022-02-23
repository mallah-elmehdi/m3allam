$(document).ready(function () {
  document.getElementById("experience").setCustomValidity("Ce champ est obligatoire");
  document.getElementById("explain").setCustomValidity("Ce champ est obligatoire");
  document.getElementById("type-service").setCustomValidity("Ce champ est obligatoire");
  document.getElementById("picture").setCustomValidity("Ce champ est obligatoire");
  document.getElementById("diplom1").setCustomValidity("Ce champ est obligatoire");
  document.getElementById("diplom2").setCustomValidity("Ce champ est obligatoire");
  
  // ======================= VALIDATION
  var checkLetter = /^(?:[a-zA-Z0-9\ \u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]|(?:\uD802[\uDE60-\uDE9F]|\uD83B[\uDE00-\uDEFF]))+$/;

  $("#experience").keyup(function () {
    if (
      $(this).val() < 0 ||
      $(this).val() > 50
    ) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      $("#expe-feed")[0].innerHTML = "Les années d'expérience doivent être comprises entre 0 et 50 ans"
      this.setCustomValidity("Ce nombre est incorrect");
    } 
   
    else if($(this).val().length === 0) {
      $(this).removeClass("is-valid").addClass("is-invalid");
      this.setCustomValidity("Ce champ est obligatoire");
      $("#expe-feed")[0].innerHTML = "Ce champ est obligatoire"
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
      $("#my-feed ")[0].innerHTML = "Ce champ est obligatoire";
      $("#strlength").removeClass("text-success").addClass("text-danger");
      this.setCustomValidity("Ce champ est obligatoire");
    } 
    
    else if ($(this).val().length > 200) {
      $(this).removeClass("is-valid").addClass("is-invalid");

      $("#strlength")[0].innerHTML = `${$(this).val().length}/200`;
      $("#my-feed ")[0].innerHTML = "vous n'avez droit qu'à 200 lettres";
      $("#strlength").removeClass("text-success").addClass("text-danger");
      this.setCustomValidity("vous n'avez droit qu'à 200 lettres");
    } 
    
    else if (!$(this).val().match(checkLetter)) {
      $(this).removeClass("is-valid").addClass("is-invalid");

      $("#my-feed ")[0].innerHTML = "Certains élément ne sont pas autorisés";
      $("#strlength").removeClass("text-success").addClass("text-danger");
      this.setCustomValidity("Certains élément ne sont pas autorisés");
    }

    else if ($(this).val().length < 100) {
      $(this).removeClass("is-valid").addClass("is-invalid");

      $("#strlength")[0].innerHTML = `${$(this).val().length}/200`;
      $("#my-feed ")[0].innerHTML ="Tapez au moins 100 caractères";
      $("#strlength").removeClass("text-success").addClass("text-danger");
      this.setCustomValidity("Tapez au moins 100 caractères");
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
          $("#custom-feed")[0].innerHTML =  "Les images PNG, JPG ou JPEG sont acceptées" 
          this.setCustomValidity("L'image n'est pas acceptée");
        }
      }
      else {
        $("#picture-preview").hide()
        $("#picture-preview").attr("src", "");
        $(this).addClass("is-invalid").removeClass("is-valid")
        $("#custom-feed")[0].innerHTML =  "Ce champ est obligatoire" 
        this.setCustomValidity("Ce champ est obligatoire");
      }
  
      $("#remove").click(function() {
        $("#picture-preview").hide()
        $("#preview").attr("src", "");
        $("#picture").addClass("is-invalid").removeClass("is-valid")
        $("#custom-feed")[0].innerHTML =  "Ce champ est obligatoire" 
        document.getElementById("picture").setCustomValidity("Ce champ est obligatoire");
      })
    });

  // === diploma

  $("input[name=diploma]").change(function () {
    $("input[name=diploma]").addClass("is-valid");
    document.getElementsByName("diploma")[0].setCustomValidity("");
    document.getElementsByName("diploma")[1].setCustomValidity("");
  });

});
