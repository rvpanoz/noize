const config = require('../config');
const Marionette = require('backbone.marionette');
const template = require('templates/tag-item.hbs');
const moment = require('moment');

var TagItemView = Marionette.View.extend({
  template: template,
  className: 'tag',
  ui: {
    checkbox: 'input[type=checkbox]',
    label: 'label'
  },
  events: {
    'click input[type=checkbox]': 'onTagClick',
    'click .close': 'onClose'
  },
  onTagClick(e) {
    this.getUI('label').toggleClass('selected');
  },
  onClose(e) {
    e.preventDefault();
    this.model.destroy({
      success: _.bind(function() {
        this.$el.fadeOut(100);
      }, this)
    })
  },
  serializeData() {
    return _.extend(this.model.toJSON());
  }
});

module.exports = TagItemView;
