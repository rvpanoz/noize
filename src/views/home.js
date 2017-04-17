const config = require('../config');
const Marionette = require('backbone.marionette');
const template = require('templates/home.hbs');
const moment = require('moment');

var HomeView = Marionette.View.extend({
  template: template,
  className: 'app-page',
  serializeData() {
    return {
      title: 'Home'
    }
  }
});

module.exports = HomeView;
