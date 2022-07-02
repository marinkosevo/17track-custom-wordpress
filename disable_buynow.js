jQuery(document).ready(function () {
  jQuery(".single_add_to_cart_button").click(function () {
    setTimeout(function () {
      jQuery(".single_add_to_cart_button").attr("disabled", true);
    }, 10);
  });
});
