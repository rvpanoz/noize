const Marionette = require('backbone.marionette');
const Schema = require('schemas/tag');
const template = require('templates/tags.hbs');
const TagView = require('./tag');

var ItemsView = Marionette.CompositeView.extend({
  template: template,
  childView: TagView,
  className: 'tags',
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
