const config = require('../config');
const Marionette = require('backbone.marionette');
const template = require('templates/items.hbs');
const ItemView = require('./item');
const Schema = require('schemas/item');

const moment = require('moment');

var ItemsView = Marionette.CompositeView.extend({
  template: template,
  childView: ItemView,
  childViewContainer: 'div.items',
  collectionEvents: {
    'sync': 'render'
  },
  ui: {
    pagination: 'ul.pagination'
  },
  events: {
    'click .btn-next': 'onNext'
  },
  initialize() {
    _.bindAll(this, 'onFetch');
    this.collection = new Schema.Items();
    this.listenTo(app, 'fetch:items', this.onFetch, arguments);
  },
  onFetch(opts) {
    var opts = _.extend(opts);

    this.collection.fetch({
      data: {
        q: opts.query,
        filter: 'public',
        format: 'json',
        client_id: config.client_id,
        limit: config.pageSize,
        linked_partitioning: 1
      },
      success: _.bind(function(tracks) {
        this.render();
      }, this),
      error(e) {
        throw new Error(e);
      },
      failure(e) {
        throw new Error(e);
      }
    });
  },
  onDomRefresh() {
    if(this.collection.length) {
      this.collection.sort();
      // this.sets(30);
      // this.getUI('pagination').show();
    }
  },
  onNext(e) {
    e.preventDefault();
    this.collection.fetch();
  },
  sets(mins) {
    var st = this.collection.get_sets(mins);
    this.collection.reset(st);
  },
  downloadable() {
    var ds = this.collection.get_downloadable();
    this.collection.reset(ds);
  }
});

module.exports = ItemsView;
