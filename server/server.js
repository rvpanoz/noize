'use strict';

// imports
const path = require('path');
const fs = require('fs');
const Hapi = require('hapi');
const request = require('request');
const Boom = require('boom');
const _ = require('lodash');
const config = require('./config');

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

server.route({
  method: 'GET',
  path: '/tracks/download/{tid}',
  config: {
    handler(req, reply) {
      var track_id = req.params.tid;
      // var url = config.api.tracks + '/track_id/download/';

      var url = "http://cf-media.sndcdn.com/gX1SDVSfAA0s?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGlhLnNuZGNkbi5jb20vZ1gxU0RWU2ZBQTBzIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNDg4MjAyNzM0fX19XX0_&Signature=XV6Tiay2DXsgVFk697Lp0L9W0Guu-xR9LCA0Y4pFMZMKxmZZZPKUD~EsgczRSlY6R3g3-JqY-568TnAObOh0cWzsTF-EA8BlRRF8EMhaaqnhRgtX2HzmzHIbPPlG2YUCThb0~4L5ZQqZ46OXhExPgztSQIvx5x8wOhyv00TU~hjuG26l1dyhr1Kiav1jAyk4S7LhnEDWd~l57fE5mLIrByNFwCiGSyjIWfIiCf0FUi2i3h84uzkwDS9ich0AvLl48WfGBcKG4YzLjW7zwgCYlt9pf-HjZtFLA8P2gZs041jIGSraDKZWmtugsRFUPbJSAhgQb8giWljfiUd8t2Modg__&Key-Pair-Id=APKAJAGZ7VMH2PFPW6UQ";

      // reply({
      //   success: true
      // });

      request
        .get(url)
        .on('response', function(response) {

          // var responseType = (response.headers['content-type'] || '').split(';')[0].trim();
          // var ext = mime.extension(responseType);

          // var path = path.join(__dirname, 'tracks');
          // filename += '.mp3';

          var fileStream = fs.createWriteStream('m.mp3')
            .on('finish', function() {
              console.log('download completed');
            })

          this.pipe(fileStream);
        })
    }
  }
})

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
  server.start(function(err) {
    if (err) {
      throw new Error(err);
    }
    console.log('Server is running at ' + server.info.host + ":" + server.info.port);
  });

});
