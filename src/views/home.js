const Marionette = require('backbone.marionette');
const template = require('../templates/home.hbs')
const config = require('../config');
const ItemsView = require('./items');
const TagsView = require('./tags');

var HomeView = Marionette.View.extend({
  template: template,
  regions: {
    tagsRegion: '#tags-content',
    itemsRegion: '#items-content'
  },
  events: {
    'click .search': 'onSearch'
  },
  ui: {
    query: 'input[name="query"]'
  },
  onRender() {
    this.showChildView('tagsRegion', new TagsView());
    this.showChildView('itemsRegion', new ItemsView());
  },
  onSearch(e) {
    e.preventDefault();
    var query = this.getUI('query');
    app.onAppEvent('fetch:items', query.val());
  },
  serializeData() {
    return {
      title: 'Home'
    }
  }
});

module.exports = HomeView;
