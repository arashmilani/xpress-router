# xpress-router
An opinionated router for express. 

This router assumes that you are willing to route the request into `controller.action()` style. and by defult it assumes the controller files are located in `./controllers` directory and end in `-controller.js` file names. you can always change these options.

Also note that you can specify a `resource` name and the router will generate the CRUD routes for you.

install it via npm:

    npm install xpress-router --save

simply use it this way:

    var express = require('express');
    var router = require('xpress-router');

    var app = express();
    var routes = [
      {method: 'get', path: '/', controller: 'home', action: 'index'},
      {resource: '/books', controller: 'books'}
    ]
    router(app, routes);

This code will register these routes:

    GET / -> home.index
    GET /books -> books.index
    GET /books/new -> books.add
    POST /books -> books.create
    GET /books/:id -> books.show
    GET /books/:id/edit -> books.edit
    PUT /books/:id -> books.update
    DELETE /books/:id -> books.destroy

a sample content for `./controllers/home-controller.js` file would be:

    function index(req, res, next){
      res.end('This is our homepage.');
    }
    
    module.exports.index = index;

the third parameter for the router is `options` and here is its default values. change them if you need to:

    {
      controllerDirectory: process.cwd() + '/controllers/',
      controllerFileSuffix: '-controller.js',
      resourceRoutesTemplate: [
        {method: 'get', pathSuffix: '', action: 'index'},
        {method: 'get', pathSuffix: '/new', action: 'add'},
        {method: 'post', pathSuffix: '', action: 'create'},
        {method: 'get', pathSuffix: '/:id', action: 'show'},
        {method: 'get', pathSuffix: '/:id/edit', action: 'edit'},
        {method: 'put', pathSuffix: '/:id', action: 'update'},
        {method: 'delete', pathSuffix: '/:id', action: 'delete'}
      ]
      logRoutesList: true // in development mode
    }

You can also specify any number of middlewares for each routes:
````
var routes = [
  {method: 'get', path: '/dashboard', controller: 'dashboard', action: 'index'
    middlewares: [(req, res, next) => {
        //check for user authentication before letting her in
        next()
    }]}
]
 ````
