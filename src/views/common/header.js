const _ = require('lodash')
const Marionette = require('backbone.marionette')
const template = require('templates/common/header.hbs')

var HeaderView = Marionette.View.extend({
  template: template,
  tagName: 'nav',
  className: 'navbar navbar-default navbar-custom navbar-fixed-top',
  id: 'mainNav',
  events: {
    'click a.navigate': 'onNavigate',
    'click a.page-scroll': 'onPageScroll'
  },
  onPageScroll(evt) {
    evt.preventDefault();
    var section = this.$(evt.target).data('section');
    this.triggerMethod('scroll:page', section);
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
  onAttach() {

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
      $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
      offset: {
        top: 100
      }
    });
  }
});

module.exports = HeaderView
