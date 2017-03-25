const config = require('../config');
const Marionette = require('backbone.marionette');
const template = require('templates/tracks.hbs');
const Schema = require('schemas/track');
const TrackView = require('views/track-item');

require('assets/css/tiles.css');

var TracksView = Marionette.CompositeView.extend({
  template: template,
  childView: TrackView,
  className: 'tracks-container',
  childViewContainer: 'div.tracks',
  collectionEvents: {
    'sync': 'render'
  },
  events: {
    'click a.show-list': 'onShowList',
    'click a.show-player': 'onShowPlayer'
  },
  initialize(opts) {
    var user = opts.user || false;
    this.collection = new Schema.Tracks();
    this.collection.fetch({
      data: {
        q: 'pattern drama',
        // genres: 'Deep House',
        filter: 'public',
        format: 'json',
        client_id: config.client_id,
        limit: config.pageSize,
        linked_partitioning: 1
      }
    });
  },
  onShowList(e) {
    e.preventDefault();
    this.$('.tracks-wrapper').addClass('list-mode');
  },
  onShowPlayer(e) {
    e.preventDefault();
    this.$('.tracks-wrapper').removeClass('list-mode');
  },
  onDomRefresh() {},
  onRender() {
    this.collection.sort();
  },
  serializeData() {
    return _.extend(this.collection.toJSON(), {
      models: this.collection.models
    });
  }
});

module.exports = TracksView;
