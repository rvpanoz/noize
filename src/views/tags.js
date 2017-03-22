const config = require('../config');
const Marionette = require('backbone.marionette');
const template = require('templates/tags.hbs');
const Schema = require('schemas/tag');
const TagView = require('views/tag-item');

var TagsView = Marionette.CompositeView.extend({
  template: template,
  childView: TagView,
  className: 'tags-container',
  childViewContainer: 'div.tags-list',
  collectionEvents: {
    'sync': 'render'
  },
  events: {
    'keypress #tag-typer': 'onTagTyperKeypress'
  },
  ui: {
    tags: '.tags-list',
    typer: '#tag-typer'
  },
  initialize(opts) {
    this.collection = new Schema.Tags();
    this.collection.fetch();
  },
  onRender() {

  },
  onTagTyperKeypress(e) {
    var key = e.which;
    if (key == 13 || key == 44) {
      e.preventDefault();
      var tagName = this.getUI('typer').val();
      if (tagName.length > 0) {
        var tag = new Schema.Tag({
          name: tagName
        });
        this.collection.add(tag);
        this.render();
      }
    }
  },
  onDomRefresh() {

  },
  serializeData() {
    return _.extend(this.collection.toJSON());
  }
});

module.exports = TagsView;
