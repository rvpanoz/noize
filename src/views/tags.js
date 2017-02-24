const config = require('../config');
const Marionette = require('backbone.marionette');
const template = require('templates/tags.hbs');
const TagView = require('./tag');
const Schema = require('schemas/tag');

var ItemsView = Marionette.CompositeView.extend({
  template: template,
  className: 'tags',
  childViewContainer: '.row',
  childView: TagView,
  collectionEvents: {
    'reset': 'render'
  },
  childViewTriggers: {
    'add:genre': 'child:add:genre'
  },
  onChildAddGenre(genre) {
    this.triggerMethod('add:genre', genre);
  },
  initialize() {
    this.collection = new Schema.Tags();
    this.collection.fetch();
  }
});

module.exports = ItemsView;
