"use strict";

$(document).ready(function(){

  var thefunc = function () {
    $(this).parent().toggleClass("expand");
  }, as = $(".header-extend-menu > a:first-child").off().click(thefunc);

  function reset(){
    as.off().click(thefunc);
  }

  setTimeout(reset, 200);
  setTimeout(reset, 400);
  setTimeout(reset, 600);
  setTimeout(reset, 800);
  setTimeout(reset, 1000);

  $(".header-extend-item span[target=_blank]").parent().parent().attr("target", "_blank");

});
