const _ = require('lodash');
const Marionette = require('backbone.marionette');
const template = require('templates/common/sidebar.hbs');

var SidebarView = Marionette.View.extend({
  template: template
});

module.exports = SidebarView;
