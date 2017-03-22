const config = require('../config');
const Marionette = require('backbone.marionette');
const template = require('templates/track-item.hbs');
const moment = require('moment');

var TrackItemView = Marionette.View.extend({
  template: template,
  className: 'box',
  events: {
    'click img': 'onLoadTrack'
  },
  onLoadTrack(e) {
    app.navigate('track', {
      id: this.model.get('id')
    });
  },
  serializeData() {
    return _.extend(this.model.toJSON());
  }
});

module.exports = TrackItemView;
