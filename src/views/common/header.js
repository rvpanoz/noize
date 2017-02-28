const _ = require('lodash')
const Marionette = require('backbone.marionette')
const template = require('templates/common/header.hbs')

var HeaderView = Marionette.View.extend({
  template: template,
  className: 'navbar navbar-static-top',
  events: {
    'click a.navigation-link': 'onNavigate'
  },
  onNavigate(e) {
    e.preventDefault();
    var cls = this.$(e.currentTarget).data('cls');
    if (cls) {
      app.navigate(cls);
    }
    return false;
  }
});

module.exports = HeaderView
