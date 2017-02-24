const _ = require('lodash');
const Marionette = require('backbone.marionette');
const template = require('../templates/tag.hbs');

var TagView = Marionette.View.extend({
  template: template,
  tagName: 'a',
  className: 'col-lg-3 col-md-3 col-sm-3 col-xs-3',
  events: {
    'click': 'onClick'
  },
  onClick(e) {
    e.preventDefault();
    this.$el.toggleClass('tag-selected');
    this.triggerMethod('add:genre', this.model.get('name').toLowerCase());
  },
  serializeData() {
    return _.extend(this.model.toJSON());
  }
});

module.exports = TagView;
