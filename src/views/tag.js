const _ = require('lodash');
const Marionette = require('backbone.marionette');
const template = require('../templates/tag.hbs');

var TagView = Marionette.View.extend({
  template: template,
  tagName: 'li',
  className: 'list-group-item',
  events: {
    'click a': 'onClick'
  },
  onClick(e) {
    e.preventDefault();
    this.$el.toggleClass('tag-selected');
    this.triggerMethod('add:tag', this.model.get('name').toLowerCase());
  },
  serializeData() {
    return _.extend(this.model.toJSON());
  }
});

module.exports = TagView;
