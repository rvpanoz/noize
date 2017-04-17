const config = require('../config');
const Marionette = require('backbone.marionette');
const template = require('templates/home.hbs');

var AboutView = Marionette.View.extend({
  template: template,
  className: 'about',
  serializeData() {
    return {
      title: 'About',
    }
  }
});

module.exports = AboutView;
