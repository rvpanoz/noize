const config = require('config');
const Marionette = require('backbone.marionette');
const template = require('templates/tracks/list.hbs');
const Schema = require('schemas/track');
const TrackItemView = require('views/tracks/list-item');

require('assets/css/list.css');

var TracksListView = Marionette.CompositeView.extend({
  template: template,
  childView: TrackItemView,
  tagName: 'ul',
  className: 'rolldown-list list-group',
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
  },
  onRender() {
    this.collection.sort();
  },
  onDomRefresh() {
    this.$el.children().each(function() {
      var delay = ($(this).index() / 4) + 's';
      $(this).css({
        webkitAnimationDelay: delay,
        mozAnimationDelay: delay,
        animationDelay: delay
      });
    });
  },
  serializeData() {
    return _.extend(this.collection.toJSON(), {
      models: this.collection.models
    });
  }
});

module.exports = TracksListView;
