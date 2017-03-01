const _ = require('lodash')
const Marionette = require('backbone.marionette')
const template = require('templates/common/header.hbs')

var HeaderView = Marionette.View.extend({
  template: template,
  className: 'header',
  attributes: {
    id: 'top'
  },
  ui: {
    sidebar: '#sidebar-wrapper'
  },
  events: {
    'click #filters-toggle': 'onFiltersToggle',
    'click #filters-close': 'onFiltersToggle'
  },
  onFiltersToggle(e) {
    e.preventDefault();
    this.getUI('sidebar').toggleClass("active");
  }
});

module.exports = HeaderView
