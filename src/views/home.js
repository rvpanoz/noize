const Marionette = require('backbone.marionette');
const template = require('../templates/home.hbs')
const config = require('../config');
const ItemsView = require('./items');
const TagsView = require('./tags');

var HomeView = Marionette.View.extend({
  template: template,
  tags: [],
  childViewTriggers: {
    'add:genre': 'child:add:genre'
  },
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
    var query = this.getUI('query').val();
    var tags = this.tags.join(" ");
    if(query.length) {
      app.onAppEvent('fetch:items', query, tags);
    }
  },
  onChildAddGenre(genre) {
    var index = this.tags.indexOf(genre);
    if(index == -1) {
      this.tags.push(genre);
    } else {
      this.tags.splice(index, 1);
    }
  },
  serializeData() {
    return {
      title: 'Home'
    }
  }
});

module.exports = HomeView;
