"use strict";

//console.log("loaded");

$(document).ready(function(){

  var noTouch = !("ontouchstart" in document.documentElement),
  as = $(".header-extend-menu > a:first-child");

  if (noTouch) {
    document.documentElement.className += " no-touch";
    setTimeout(function(){
      as.off();
    }, 100);
  } else {
    setTimeout(function(){
      as.off().click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).parent().toggleClass("expand");
        //console.log("event fired");
        return false;
      });
    }, 100);
  }

});
