'use strict';

// imports
const Path = require('path');
const Hapi = require('hapi');
const Wreck = require('wreck');
const Boom = require('boom');
const _ = require('lodash');

// hapi server instance
var server = new Hapi.Server({
  connections: {
    routes: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
  }
});


// server connection
server.connection({
  port: 9090,
});

server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route({
      method: 'GET',
      path: '/demos/webcomponents/soundcloud/',
      config: {
        handler(req, reply) {
          // console.log(req.params);
          // console.log(req.query);

          var access_token = req.query.access_token;
          // console.log(access_token);
          reply.file(Path.join(__dirname, 'callback.html'));
        }
      }
    })

    //*start the server
    server.start(function (err) {
      if (err) {
        throw new Error(err);
      }
      console.log('Server is running at ' + server.info.host + ":" + server.info.port);
    });

});
