let debug = process.env.NODE_ENV === 'development' ? true : false

module.exports = function (app, routes, options) {
  if (!app) throw new Error('First argument of the router should be an express app')
  routes = routes || []
  options = options || {}
  let defaults = {
    controllerDirectory: process.cwd() + '/controllers/',
    controllerFileSuffix: '-controller.js',
    resourceRoutesTemplate: [
      { method: 'get', pathSuffix: '', action: 'index' },
      { method: 'get', pathSuffix: '/new', action: 'add' },
      { method: 'post', pathSuffix: '', action: 'create' },
      { method: 'get', pathSuffix: '/:id', action: 'show' },
      { method: 'get', pathSuffix: '/:id/edit', action: 'edit' },
      { method: 'put', pathSuffix: '/:id', action: 'update' },
      { method: 'delete', pathSuffix: '/:id', action: 'destroy' }
    ]
  }
  options = Object.assign({}, defaults, options)
  routes = transformResourcesToRoutes(routes, options.resourceRoutesTemplate)

  if (debug && (options.logRoutesList === false ?  false: true)) console.log('app routes list:')
  routes.forEach(route => generateRoute(app, route, options))
}

function transformResourcesToRoutes(routes, resourceRoutesTemplate) {
  let output = []
  routes.forEach((item, index) => {

    if (!item.resource) {
      output.push(item)
      return
    }

    resourceRoutesTemplate.forEach((routeTemplate) => {
      let route = {
        method: routeTemplate.method,
        path: item.resource + routeTemplate.pathSuffix,
        controller: item.controller,
        action: routeTemplate.action
      }
      output.push(route)
    })
  })

  return output
}

function generateRoute(app, route, options) {
  let middlewares = route.middlewares || []
  let args = [route.path, ...middlewares, callback]
  app[route.method].apply(app, args)

  function callback(req, res, next) {
    let controllerFilePath = options.controllerDirectory +
      route.controller + options.controllerFileSuffix

    let controller = require(controllerFilePath)
    controller[route.action](req, res, next)
  }

  if (debug && (options.logRoutesList === false ? false : true)) {
    console.log(`\t${route.method.toUpperCase()} ${route.path} ` +
      `-> ${route.controller}.${route.action}`)
  }
}