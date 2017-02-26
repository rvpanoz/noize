const config = require('../config');
const Marionette = require('backbone.marionette');
const template = require('templates/items.hbs');
const ItemView = require('./item');
const Schema = require('schemas/item');

var ItemsView = Marionette.CompositeView.extend({
  template: template,
  childViewContainer: '.items',
  childView: ItemView,
  collectionEvents: {
    'sync': 'render',
    'reset': 'render'
  },
  events: {
    'click .btn-next': 'onNext'
  },
  initialize() {
    _.bindAll(this, 'onFetch');
    this.collection = new Schema.Items();
    this.listenTo(app, 'fetch:items', this.onFetch, arguments);

    // SC.get('users/panos-rv').then(function(user){
    //   console.log('Panos', user);
    // });
  },
  onFetch(opts) {
    var opts = _.extend(opts);

    this.collection.fetch({
      data: {
        q: opts.query,
        tags: opts.tags,
        filter: 'public',
        format: 'json',
        client_id: config.client_id,
        limit: config.pageSize,
        linked_partitioning: 1
      },
      success: _.bind(function(r) {
        this.collection.sort();
      }, this),
      error(e) {
        throw new Error(e);
      },
      failure(e) {
        throw new Error(e);
      }
    });
  },
  onNext(e) {
    e.preventDefault();
    this.collection.fetch();
  },
  downloadable() {
    var ds = this.collection.get_downloadable();
    this.collection.reset(ds);
  }
});

module.exports = ItemsView;
