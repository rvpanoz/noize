const _ = require('lodash');
const Marionette = require('backbone.marionette');
const template = require('../templates/tag.hbs');

var TagView = Marionette.View.extend({
  template: template,
  tagName: 'a',
  className: 'btn btn-light filter-button tag',
  events: {
    'click': 'onClick'
  },
  onAfterRender() {
    console.log(this.model.get('name'));
  },
  onClick(e) {
    e.preventDefault();
    this.$el.toggleClass('selected');
    this.triggerMethod('add:tag', this.model.get('name').toLowerCase());
  },
  serializeData() {
    return _.extend(this.model.toJSON());
  }
});

module.exports = TagView;
