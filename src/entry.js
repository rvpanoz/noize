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

// ajax setup
$.ajaxSetup({
  cache: false,
  beforeSend: function(xhr) {
    var token = localStorage.getItem('token');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
  },
  statusCode: {
    400: function(data) {
      if (data && data.responseText) {
        var response = JSON.parse(data.responseText);
        app.showMessage(response.message, 'danger');
      }
    },
    401: function(data) {
      if (data && data.responseText) {
        var response = JSON.parse(data.responseText);
        app.showMessage(response.message, 'danger');
        app.triggerMethod('app:signout');
      }
    },
    403: function(data) {
      if (data && data.responseText) {
        var response = JSON.parse(data.responseText);
        app.showMessage(response.message, 'danger');
        app.triggerMethod('app:signout');
      }
    },
    404: function(data) {
      if (data && data.responseText) {
        var response = JSON.parse(data.responseText);
        app.showMessage(response.message, 'danger')
        app.triggerMethod('app:signout');
      }
    }
  }
});

/**
 * ajax events
 */
$(document).ajaxError(function(e, xhr, options, type) {
  app.wait(false);
});

$(document).ajaxStart(function() {
  app.wait(true);
});

$(document).ajaxComplete(function() {
  app.wait(false);
});

//start application
app.start();
