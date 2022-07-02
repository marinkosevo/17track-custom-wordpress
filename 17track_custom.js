jQuery(document).ready(function () {
  jQuery(".single_add_to_cart_button").click(function () {
    setTimeout(function () {
      jQuery(".single_add_to_cart_button").attr("disabled", true);
    }, 10);
  });

  function fill_postal() {
    var billing_address_1 = jQuery("#billing_address_1").val();
    var billing_address_2 = jQuery("#billing_address_2").val();
    var billing_state_select = jQuery("#billing_state option:selected").text();
    var billing_state_text = jQuery("#billing_state").val();
    if (billing_state_select == "") billing_state = billing_state_text;
    else billing_state = billing_state_select;
    var billing_city = jQuery("#billing_city").val();
    var billing_country =
      jQuery("#billing_country")[0].selectedOptions[0].innerHTML;
    var address =
      billing_address_1 +
      ", " +
      billing_state +
      ", " +
      billing_city +
      ", " +
      billing_country;
    address = address.replace(/[^a-zA-Z0-9 /',.-_áéíóúüñçãâàõôê]/g, " ");
    var api_key = "jHp51y6binH55FV-LI2sGyVUFAYKmdHhTemFPCD11TA";
    if (
      billing_address_1 != "" &&
      billing_state != "" &&
      billing_city != "" &&
      billing_country != ""
    ) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          if (xhr.responseText) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            if (typeof response.items["0"] == "undefined") var postal = "10000";
            else var postal = response.items["0"].address.postalCode;
            console.log(postal);
            jQuery("#billing_postcode").val(postal);
          }
        }
      };
      //geocode.search.hereapi.com/v1/geocode?q=Carrera 16c, , Distrito Capital de Bogotá, Bogotá, Colombia&apiKey=jHp51y6binH55FV-LI2sGyVUFAYKmdHhTemFPCD11TA
      https: var ajax_url =
        "https://geocode.search.hereapi.com/v1/geocode?apiKey=" +
        api_key +
        "&q=" +
        address;
      xhr.open("GET", ajax_url, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send();
    }
  }

  jQuery(document).on(
    "change",
    "#billing_country, #billing_city, #billing_state, #billing_address_1, #billing_address_2, input",
    function () {
      fill_postal();
    }
  );
  jQuery(document).on("click", ".wfacp_next_page_button", function () {
    fill_postal();
  });
});

(function () {
  JaroWrinker = function (s1, s2) {
    var m = 0;
    // Exit early if either are empty.
    if (s1.length === 0 || s2.length === 0) {
      return 0;
    }

    // Exit early if they're an exact match.
    if (s1 === s2) {
      return 1;
    }
    var range = Math.floor(Math.max(s1.length, s2.length) / 2) - 1,
      s1Matches = new Array(s1.length),
      s2Matches = new Array(s2.length);
    for (i = 0; i < s1.length; i++) {
      var low = i >= range ? i - range : 0,
        high = i + range <= s2.length ? i + range : s2.length - 1;
      for (j = low; j <= high; j++) {
        if (s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j]) {
          ++m;
          s1Matches[i] = s2Matches[j] = true;
          break;
        }
      }
    }

    // Exit early if no matches were found.
    if (m === 0) {
      return 0;
    }

    // Count the transpositions.
    var k = (n_trans = 0);

    for (i = 0; i < s1.length; i++) {
      if (s1Matches[i] === true) {
        for (j = k; j < s2.length; j++) {
          if (s2Matches[j] === true) {
            k = j + 1;
            break;
          }
        }

        if (s1[i] !== s2[j]) {
          ++n_trans;
        }
      }
    }

    var weight = (m / s1.length + m / s2.length + (m - n_trans / 2) / m) / 3,
      l = 0,
      p = 0.1;

    if (weight > 0.7) {
      while (s1[l] === s2[l] && l < 4) {
        ++l;
      }
      weight = weight + l * p * (1 - weight);
    }
    return weight;
  };
})();

//Save hidden RUT
jQuery(document).on("change", "#ebanx_billing_chile_document", function () {
  var rut = jQuery("#ebanx_billing_chile_document").val();

  jQuery("#rut_number").val(rut);
});
