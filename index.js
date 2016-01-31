var debug = process.env.NODE_ENV === 'development' ? true : false;

module.exports = function(app, routes, options) {
  if(!app) throw new Error('First argument of the router should be an express app');
  var routes = routes || [];
  var options = options || {};
  var defaults = {
    controllerDirectory: process.cwd() + '/controllers/',
    controllerFileSuffix: '-controller.js',
    resourceRoutesTemplate: [
      {method: 'get', pathSuffix: '', action: 'index'},
      {method: 'get', pathSuffix: '/add', action: 'add'},
      {method: 'post', pathSuffix: '', action: 'create'},
      {method: 'get', pathSuffix: '/:id', action: 'show'},
      {method: 'get', pathSuffix: '/:id/edit', action: 'edit'},
      {method: 'put', pathSuffix: '/:id', action: 'update'},
      {method: 'delete', pathSuffix: '/:id', action: 'delete'}
    ]
  }
  Object.assign({}, defaults, options);
  routes = transformResourcesToRoutes(routes, options.resourceRoutesTemplate);

  if(debug) console.log('app routes list:');
  for(var r = 0; r < routes.length; r++){
    route = routes[r];
    generateRoute(app, route, options);
  }

  if(debug) console.log();
}

function transformResourcesToRoutes(routes, resourceRoutesTemplate){
  var output = [];
  routes.forEach((item, index) => {
    if(!item.resource) return;

    resourceRoutesTemplate.forEach((routeTemplate) => {
        var route = {
          method: routeTemplate.method, 
          path: item.resource + routeTemplate.pathSuffix, 
          controller: item.controller,
          action: routeTemplate.action
        }
        output.push(route);
    });
  });

  return output;
}

function generateRoute(app, route, options){
  app[route.method](route.path, (req, res, next) => {
    var controolerFilePath = options.controllerDirectory + 
      options.route.controller + options.controllerFileSuffix;

    var controller = require(controolerFilePath);
    controller[route.action](req, res, next);
  });

  if(config.env === 'development') {
    console.log(`\t${route.method.toUpperCase()} ${route.path} ` + 
      `-> ${route.controller}.${route.action}`);
  }
}