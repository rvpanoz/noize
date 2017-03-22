const config = require('../config');
const Marionette = require('backbone.marionette');
const template = require('templates/home.hbs');

var AboutView = Marionette.View.extend({
  template: template,
  tagName: 'section',
  id: 'about',
  className: 'about',
  serializeData() {
    return {
      title: 'About',
    }
  }
});

module.exports = HomeView;
