const config = require('../config');
const Marionette = require('backbone.marionette');
const template = require('templates/tags.hbs');
const TagView = require('./tag');
const Schema = require('schemas/tag');

var ItemsView = Marionette.CompositeView.extend({
  template: template,
  className: 'tags',
  childView: TagView,
  childViewContainer: '.row',
  collectionEvents: {
    'reset': 'render'
  },
  initialize() {
    this.collection = new Schema.Tags();
    this.collection.fetch();
  }
});

module.exports = ItemsView;
