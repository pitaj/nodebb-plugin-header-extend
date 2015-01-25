/* global app */

(function(){

  "use strict";

  var template =
    '<div class="panel panel-default">'+
      '<div class="panel-heading">'+
        '<i class="fa fa-arrows"></i>'+
                            // fa-whatever
        '<i class="item-icon fa {icon}"></i>'+
                            // item title
        '<h3 class="panel-title">{name}</h3>'+
        '<code class="item-route">{route}</code>'+
        '<button type="button" class="btn btn-danger" data-target="#delete-item" data-toggle="modal">'+
          '<i class="fa fa-times"></i>'+
        '</button>'+
        '<button type="button" class="btn btn-primary" data-target="#edit-item" data-toggle="modal">'+
          '<i class="fa fa-edit"></i>'+
        '</button>'+                                  // if false, "hidden." if true, ""
        '<button type="button" class="btn btn-default iconOnly {iconOnly}" disabled>Icon only</button>'+
        '<span class="item-newtab" >{newtab}</span>'+
      '</div>'+
      '<div class="panel-body"></div>'+
    '</div>';

  function initItems(arr, parent){
    var item, i;
    for(i=0; i<arr.length; i++){
      item = template
      .replace("{icon}", arr[i].icon)
      .replace("{name}", arr[i].name)
      .replace("{route}", arr[i].route)
      .replace("{newtab}", arr[i].newtab)
      .replace("{iconOnly}", arr[i].iconOnly ? "" : "hidden");

      item = $(item).appendTo(parent);

      if(arr[i].subItems && arr[i].subItems.length){
        initItems(arr[i].subItems, item.find(".panel-body").first());
      }
    }
  }

  function initSortable(){
    try {
      $(".header-extend-config, .header-extend-config > .panel > .panel-body").sortable("destroy");
    } catch(e){

    } finally {
      $(".header-extend-config, .header-extend-config > .panel > .panel-body").sortable({
        connectWith: ".header-extend-config, .header-extend-config > .panel > .panel-body"
      }).disableSelection();
    }
  }

  $('#delete-item').on('show.bs.modal', function(e) {
    $(this).find('.btn-danger').off().click(function(){
      $(e.relatedTarget).parent().parent().remove();
    });
  });

  $("#select-icon").on("show.bs.modal", function(e){
    $("#edit-item").modal("hide");
    $(this).find(".fa-icons").children().off().click(function(){
      $("#select-icon").modal("hide");
      var icon = $(this).attr("class");
      $("#item-icon").attr("class", "item-icon "+icon);
    });
    $(this).on("hide.bs.modal", function(){
      $("#edit-item").modal("show");
    });
  });

  $("#edit-item").on("show.bs.modal", function(e){
    var target = $(e.relatedTarget),
    tis = $(this),
    data,
    item;
    if(target.hasClass("add")){
      data = {
        name: "New Menu Link",
        icon: "fa-doesnt-exist",
        iconOnly: false,
        route: "/your/page/here",
        newtab: false
      };

      tis.find(".btn-primary").off().click(function(){
        data = {
          name: $("#item-name").val(),
          route: $("#item-route").val(),
          iconOnly: $("#item-iconOnly").prop("checked"),
          icon: $("#item-icon").attr("class"),
          newtab: $("#item-newtab").prop("checked")
        };

        initItems([data], $(".header-extend-config"));

        initSortable();
      });

    } else if(target.attr("data-target") === "#edit-item") { //
      item = target.parent().parent();
      data = {
        name: item.find(".panel-title").html(),
        icon: item.find(".item-icon").attr("class"), // .replace("item-icon", "").replace("fa", "").trim()
        iconOnly: !item.find(".iconOnly").hasClass("hidden"),
        route: item.find(".item-route").html(),
        newtab: Boolean(item.find(".item-newtab").html())
      };

      tis.find(".btn-primary").off().click(function(){
        data = {
          name: $("#item-name").val(),
          route: $("#item-route").val(),
          iconOnly: $("#item-iconOnly").prop("checked"),
          icon: $("#item-icon").attr("class"),
          newtab: $("#item-newtab").prop("checked")
        };

        item.find(".item-icon").first().attr("class", data.icon);
        item.find(".panel-title").first().html(data.name);
        item.find(".item-route").first().html(data.route);
        item.find(".item-newtab").first().html(data.newtab);
        if(data.iconOnly){
          item.find(".iconOnly").first().removeClass("hidden");
        } else {
          item.find(".iconOnly").first().addClass("hidden");
        }
      });
    } else {
      return;
    }

    $("#item-name").val(data.name);
    $("#item-route").val(data.route);
    $("#item-iconOnly").prop("checked", data.iconOnly);
    $("#item-icon").attr("class", data.icon);
    $("#item-newtab").prop("checked", data.newtab);

  });

  function save(){

    function subData(inJQobj, outArray){
      inJQobj.each(function(){
        var item = $(this);
        var thisobj = {
          name: item.find(".panel-title").html(),
          icon: item.find(".item-icon").attr("class").replace("item-icon", "").replace("fa", "").trim(),
          iconOnly: !item.find(".iconOnly").hasClass("hidden"),
          route: item.find(".item-route").html(),
          newtab: item.find(".item-newtab").html()
        };
        var x = $(this).find(".panel-body").children();
        if(x.length){
          thisobj.subItems = [];
          subData(x, thisobj.subItems);
        }
        outArray.push(thisobj);
      });
    }

    // first, collect data:
    var data = [];
    subData($(".header-extend-config").children(), data);

    //console.log("the data", data, JSON.stringify(data));

    // then, send data
    $.post("/api/admin/plugins/header-extend/save", { data : JSON.stringify(data) }, function(data){
      if(data === 'Successfully saved configuration'){
        app.alertSuccess(data);
      } else {
        app.alertError(data);
      }
    });

  }

  $("#save").click(save);

  $.getJSON("/api/admin/plugins/header-extend", function(data){

    //console.log("loaded data", data, data.menuItems);

    initItems(data.menuItems, $(".header-extend-config"));
    initSortable();
  });

})();
