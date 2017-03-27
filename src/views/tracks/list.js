const config = require('config');
const Marionette = require('backbone.marionette');
const template = require('templates/tracks/list.hbs');
const Schema = require('schemas/track');
const TrackItemView = require('views/tracks/list-item');

require('assets/css/tiles.css');

var TracksListView = Marionette.CompositeView.extend({
  idx: 0,
  template: template,
  childView: TrackItemView,
  tagName: 'section',
  className: 'tracks-container',
  childViewContainer: 'div.tracks',
  childViewTriggers: {
    'item:rendered': 'child:item:rendered'
  },
  collectionEvents: {
    'sync': 'render'
  },
  ui: {
    wrapper: '.tracks-wrapper'
  },
  events: {
    'click a.show-list': 'onShowList',
    'click a.show-player': 'onShowPlayer'
  },
  initialize(opts) {
    this.collection = new Schema.Tracks();
    this.collection.fetch({
      data: {
        q: 'mark slee atish',
        // genres: 'Deep House',
        // tags: 'deep, house'
        filter: 'public',
        format: 'json',
        client_id: config.client_id,
        limit: config.pageSize,
        linked_partitioning: 1
      }
    });

    this.listenTo(this.collection, 'add', _.bind(this.onCollectionAdd, this), arguments);
  },
  onShowList(e) {
    e.preventDefault();
    this.wrapper.addClass('list-mode');
  },
  onShowPlayer(e) {
    e.preventDefault();
    this.wrapper.removeClass('list-mode');
  },
  onChildItemRendered(item) {
    
  },
  onCollectionAdd(model) {

  },
  onRender() {
    this.wrapper = this.getUI('wrapper');
    this.collection.sort();
  },
  serializeData() {
    return _.extend(this.collection.toJSON(), {
      models: this.collection.models
    });
  }
});

module.exports = TracksListView;
