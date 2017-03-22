const _ = require('lodash');
const Backbone = require('backbone');
const Marionette = require('backbone.marionette');
const Handlebars = require('handlebars');
const config = require('./config');
const app = require('app');

window.app = app;

//trick to copy index.html into dist/index.html
require('file-loader?name=[name].[ext]!./index.html');

Backbone.emulateHTTP = false;

// load templates using Handlebars engine
Marionette.TemplateCache.prototype.lazyLoadTemplate = function (rawTemplate, options) {
  return Handlebars.compile(rawTemplate);
};

$.ajaxPrefilter(function(options) {
  options.url = options.url + "?client_id=" + config.client_id;
});

//start application
app.start();
