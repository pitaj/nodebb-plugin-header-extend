"use strict";

$(document).ready(function(){
  $(".header-extend-item span[target=_blank]").parent().parent().attr("target", "_blank");
  $(window).on('action:ajaxify.end', function(event, data) {
    $(".header-extend-menu > a:first-child").off("click").click(function () {
      $(this).parent().toggleClass("expand");
    });
  });
});
