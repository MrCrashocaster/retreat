$(document).ready(function () {
  // Load previously opened FAQ from localStorage
  const openId = localStorage.getItem("openFaqId");
  if (openId) {
    const $item = $(`.faq-item[data-id="${openId}"]`);
    $item.addClass("active");
    $item.find(".faq-answer").slideDown();
  }

  $(".faq-question").on("click", function () {
    const $item = $(this).closest(".faq-item");

    // Collapse all others
    $(".faq-item").not($item).removeClass("active").find(".faq-answer").slideUp();

    // Toggle this one
    $item.toggleClass("active");
    $item.find(".faq-answer").slideToggle();

    // Save to localStorage if open
    if ($item.hasClass("active")) {
      localStorage.setItem("openFaqId", $item.data("id"));

      // Scroll smoothly to opened FAQ
      $('html, body').animate({
        scrollTop: $item.offset().top - 20
      }, 500);
    } else {
      localStorage.removeItem("openFaqId");
    }
  });
});
