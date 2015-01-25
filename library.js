(function(exports, module, undefined) {

  "use strict";

  var db = module.parent.require('./database');

  function getData(callback){
    db.get('plugins:header-extend', function(err, data) {
      if(err){
        return callback(err);
      }
      data = JSON.parse(data) || {};
      data.menuItems = data.menuItems || [];
      callback(null, data);
    });
  }

  function setData(data, callback){
    db.set('plugins:header-extend', JSON.stringify(data), callback);
  }

  function setDataField(field, data, callback){
    /*
    if(isNaN(field*1)){
      return callback(new Error("field not valid value"));
    }
    */
    getData(function(err, odata){
      odata[field] = data;
      setData(odata, callback);
    });
  }

  function renderAdmin(req, res, next){
    getData(function(err, data) {
      if (err) {
        console.error(err);
        return next(err);
      }
      res.render("admin/plugins/header-extend", data);
    });
  }

  function save(req, res, next){
    var data = JSON.parse(req.body.data); //JSON.parse(req.body);

    //console.log("the data", data);

    setDataField("menuItems", data, function(err){
      if(err){
        console.error(err);
        return res.json('Saving failed. Try again later.');
      }
      res.json('Successfully saved configuration');
    });
  }

  exports.init = function (app, middleware, controllers, callback) {

    var router;

    if(app.router){
      callback = middleware;
      controllers = app.controllers;
      middleware = app.middleware;
      router = app.router;
    } else {
      router = app;
    }

    router.get('/admin/plugins/header-extend', middleware.admin.buildHeader, renderAdmin);
    router.get('/api/admin/plugins/header-extend', renderAdmin);

    router.post('/api/admin/plugins/header-extend/save', save);

    callback();
  };

  exports.addAdminNavigation = function(header, callback) {
    header.plugins.push({
      route: '/plugins/header-extend',
      icon: 'fa-list',
      name: 'Header configuration'
    });
    callback(null, header);
  };

  /* item object spec
  {
    icon: the font awesome icon class (aka fa-list, fa-plus, etc),
    name: the title of the menu or menu item,
    route: the url of the page the link points to (relative or absolute),
    iconOnly: boolean whether or not to show only the icon in the desktop menu,
    newtab: link opens in a new tab / window,
    subItems: the items in this menu
  }
  */

  exports.addNavigation = function(header, callback) {

    function arr2HTML(arr){
      var text = "", a, it;
      for(a=0; a < arr.length; a++){
        it = arr[a];
        text += '<a href="'+it.route+'" class="header-extend-'+(it.subItems && it.subItems.length ? "menu" : "menu-item")+'">'+
        (it.icon ? '<i class="fa fa-fw '+it.icon+'"></i>' : '') + '<span '+
        (it.iconOnly && it.icon ? 'class="visible-xs-inline"' : "")+'> '+it.name+'</span></a>'+
        (it.subItems && it.subItems.length ? "" : arr2HTML(it.subItems))+'';
      }

      return text;
    }

    getData(function(err, data){
      if(err){
        return callback(err);
      }
      var text, i, a, it;

      data = data.menuItems;

      for(i=0; i<data.length; i++){
        text = "";
        text += (data[i].icon ? '<i class="fa fa-fw '+data[i].icon+'"></i>' : '') + '<span '+(data[i].newtab ? 'target="_blank"' : '')+
        (data[i].iconOnly ? 'class="visible-xs-inline"' : "")+'> '+data[i].name+'</span>';


        if(data[i].subItems && data[i].subItems.length){
          for(a=0; a<data[i].subItems.length; a++){
            it = data[i].subItems[a];
            text += '<a href="'+it.route+'" class="header-extend-menu-item" '+
            (it.newtab ? 'target="_blank"' : '')+'>'+(it.icon ? '<i class="fa fa-fw '+it.icon+'"></i>' : '') +
            '<span '+(it.iconOnly ? 'class="visible-xs-inline"' : "")+'> '+it.name+'</span></a>';
          }
        }

        header.navigation.push({
          "class": "header-extend-"+(data[i].subItems && data[i].subItems.length ? "menu" : "item"), // type === "item" || "menu"
          "route": data[i].subItems && data[i].subItems.length ? "javascript:void(0)" : data[i].route,
          "name": data[i].name,
          "title": data[i].name,
          "text": text
        });
      }

      //console.log(JSON.stringify(header.navigation));

      callback(null, header);
    });
  };



})(module.exports, module);
