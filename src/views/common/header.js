const _ = require('lodash');
const Marionette = require('backbone.marionette');
const template = require('templates/common/header.hbs');

var HeaderView = Marionette.View.extend({
  template: template,
  tagName: 'nav',
  className: 'navbar navbar-default',
  id: 'mainNav',
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
  }
});

module.exports = HeaderView;
