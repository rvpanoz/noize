const config = require('config');
const Marionette = require('backbone.marionette');
const template = require('templates/tracks/list-item.hbs');
const moment = require('moment');

var TrackItemView = Marionette.View.extend({
  template: template,
  tagName: 'li',
  events: {
    'click img': 'onLoadTrack'
  },
  onLoadTrack(e) {
    app.navigate('tracks/track', {
      trackId: this.model.get('id')
    });
  },
  onDomRefresh() {
    if(this.isRendered())
      this.triggerMethod('item:rendered', this);
  },
  serializeData() {
    return _.extend(this.model.toJSON());
  }
});

module.exports = TrackItemView;
