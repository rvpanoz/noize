const _ = require('lodash');
const Marionette = require('backbone.marionette');
const template = require('../templates/item.hbs');

var ItemView = Marionette.View.extend({
  template: template,
  className: 'col-lg-6 col-md-6 col-sm-6 col-xs-6',
  events: {
    'click a': 'onClick'
  },
  ui: {
    'embed': '.embed'
  },
  initialize() {
    _.bindAll(this, 'onEmbed')
  },
  onRender() {
    var permalink_url = this.model.get('permalink_url');

    SC.oEmbed(permalink_url, {
      auto_play: false
    }).then(this.onEmbed);
  },
  onEmbed(content) {
    this.getUI('embed').html(content.html);
    return false;
  },
  serializeData() {
    return _.extend(this.model.toJSON());
  }
});

module.exports = ItemView;
