"use strict";

//console.log("loaded");

$(document).ready(function(){

  var noTouch = !("ontouchstart" in document.documentElement),
  as = $(".header-extend-menu > a:first-child");

  if (noTouch) {
    document.documentElement.className += " no-touch";
  } else {
    as.click(function (e) {
      e.stopPropagation();
      e.preventDefault();
      $(this).parent().toggleClass("expand");
      //console.log("event fired");
      return false;
    });
  }
  

});
