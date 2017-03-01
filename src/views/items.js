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

    this.collection.doFetch(opts).then(_.bind(function(response) {
      if(response.next_href) {
        this.collection.next_href = response.next_href;
      }
      this.collection.reset(response.collection);
      this.render();
    }, this))
    return false;
  },
  onDomRefresh() {
    if(this.collection.length) {
      this.collection.sort();
      this.getUI('pagination').show();
    }
  },
  onNext(e) {
    e.preventDefault();
    this.collection.doFetch().then(_.bind(function(response) {
      if(response.next_href) {
        this.collection.next_href = response.next_href;
      }
      this.collection.reset(response.collection);
      this.render();
    }, this));
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
