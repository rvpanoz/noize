const config = require('../config');
const Marionette = require('backbone.marionette');
const template = require('templates/track-item.hbs');
const moment = require('moment');

var TrackTileView = Marionette.View.extend({
  template: template,
  events: {
    'click touchstart': 'onClick'
  },
  onClick: function(e) {
    e.preventDefault();

    var self = $(e.target);
    var match = self.attr('data-tile');
    var allContent = $('li.content__item');
    var content = $('li#' + match);

    self.toggleClass('active');

    content.toggleClass('active');

    contentWrap.css({
      'transition-delay': '.35s'
    });

    return false;
  },
  serializeData() {
    return _.extend(this.model.toJSON());
  }
});

module.exports = TrackTileView;
