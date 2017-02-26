const _ = require('lodash');
const Marionette = require('backbone.marionette');
const template = require('../templates/item.hbs');
const config = require('../config');

var ItemView = Marionette.View.extend({
  template: template,
  tagName: 'tr',
  ui: {
    'embed': '.embed'
  },
  initialize() {
    _.bindAll(this, 'onEmbed');

  },
  onRender() {
    var permalink_url = this.model.get('permalink_url');

    SC.oEmbed(permalink_url, {
      auto_play: false
    }).then(this.onEmbed);
  },
  onDownload(e) {
    e.preventDefault();
  },
  onDomRefresh() {

  },
  onEmbed(content) {
    this.getUI('embed').html(content.html);
  },
  serializeData() {
    return _.extend(this.model.toJSON(), {
      client_id: config.client_id
    });
  }
});

module.exports = ItemView;
