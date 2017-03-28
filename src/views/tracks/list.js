const config = require('config');
const Marionette = require('backbone.marionette');
const template = require('templates/tracks/list.hbs');
const Schema = require('schemas/track');
const TrackItemView = require('views/tracks/list-item');

require('assets/css/list.css');

var TracksListView = Marionette.CollectionView.extend({
  template: template,
  childView: TrackItemView,
  tagName: 'ol',
  collectionEvents: {
    'sync': 'render'
  },
  initialize(opts) {
    this.collection = new Schema.Tracks();
    this.collection.fetch({
      data: {
        q: 'mark slee atish',
        filter: 'public',
        format: 'json',
        client_id: config.client_id,
        limit: config.pageSize,
        linked_partitioning: 1
      }
    });

    this.listenTo(this.collection, 'add', _.bind(this.onCollectionAdd, this), arguments);
  },
  onCollectionAdd(model) {

  },
  onRender() {
    this.collection.sort();
  },
  serializeData() {
    return _.extend(this.collection.toJSON(), {
      models: this.collection.models
    });
  }
});

module.exports = TracksListView;
