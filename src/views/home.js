const config = require('../config');
const Marionette = require('backbone.marionette');
const template = require('templates/home.hbs');
const moment = require('moment');

var HomeView = Marionette.View.extend({
  template: template,
  className: 'app-page',
  events: {
    'click a.navigate': 'onNavigate'
  },
  onNavigate(e) {
    e.preventDefault();
    var target = this.$(e.currentTarget);
    var cls = this.$(e.currentTarget).data('cls');
    if (cls) {
      return app.navigate(cls);
    }
    return false;
  },
  serializeData() {
    return {
      title: 'Home'
    }
  }
});

module.exports = HomeView;
