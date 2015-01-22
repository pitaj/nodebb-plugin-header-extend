"use strict";

$(document).ready(function(){

  var as = $(".header-extend-menu > a:first-child");

  function reset(){
    as.off().click(function () {
      $(this).parent().toggleClass("expand");
    });
  }

  reset();
  setTimeout(reset, 200);
  setTimeout(reset, 400);
  setTimeout(reset, 600);
  setTimeout(reset, 800);
  setTimeout(reset, 1000);

});
