const config = require('../config');
const Marionette = require('backbone.marionette');
const template = require('templates/items.hbs');
const ItemView = require('./item');
const Schema = require('schemas/item');

var ItemsView = Marionette.CompositeView.extend({
  template: template,
  className: 'items',
  childView: ItemView,
  childViewContainer: '.row',
  collectionEvents: {
    'reset': 'render'
  },
  initialize() {
    _.bindAll(this, 'onFetch');
    this.collection = new Schema.Items();
    this.listenTo(app, 'fetch:items', this.onFetch, arguments);
  },
  onFetch(query, tags) {
    var opts = _.extend();
    this.collection.fetch({
      data: {
        q: query,
        tag_list: tags,
        format: 'json',
        client_id: config.client_id,
        limit: config.pageSize
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
  downloadable() {
    var ds = this.collection.get_downloadable();
    this.collection.reset(ds);
  }
});

module.exports = ItemsView;
