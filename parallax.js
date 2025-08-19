$(document).ready(function() {

  $(window).scroll(function() {
    var scrollPosWin = $(window).scrollTop();
    var factorBackground = scrollPosWin * .4;
    var factorForeground = scrollPosWin * .2;
    $('.hero-image-background').css({'top': factorBackground, 'bottom': -factorBackground});
    $('.hero-image-foreground').css({'top': factorForeground, 'bottom': -factorForeground});
  });

});
