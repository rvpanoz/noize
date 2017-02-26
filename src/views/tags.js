const config = require('../config');
const Marionette = require('backbone.marionette');
const template = require('templates/tags.hbs');
const TagView = require('./tag');
const Schema = require('schemas/tag');

var ItemsView = Marionette.CompositeView.extend({
  template: template,
  className: 'list-group tags',
  tagName: 'ul',
  childView: TagView,
  collectionEvents: {
    'reset': 'render'
  },
  childViewTriggers: {
    'add:tag': 'child:add:tag'
  },
  onChildAddTag(tag) {
    this.triggerMethod('add:tag', tag);
  },
  initialize() {
    this.collection = new Schema.Tags();
    this.collection.fetch();
  }
});

module.exports = ItemsView;
