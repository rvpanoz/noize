const Marionette = require('backbone.marionette');
const template = require('../templates/home.hbs')
const config = require('../config');
const ItemsView = require('./items');
const TagsView = require('./tags');

const bootstrapCss = require('bootstrap/dist/css/bootstrap.css');
const fontawesome = require('assets/font-awesome/css/font-awesome.min.css');

var HomeView = Marionette.View.extend({
  template: template,
  tags: [],
  childViewTriggers: {
    'add:tag': 'child:add:tag'
  },
  regions: {
    tagsRegion: '#tags-content',
    itemsRegion: '#items-content'
  },
  events: {
    'click .btn-search': 'onSearch'
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
    var tags = this.tags.join(",");
    console.log(tags);
    if(query && query.length) {
      app.onAppEvent('fetch:items', {
        query: query,
        tags: tags
      });
    }
  },
  onChildAddTag(tag) {
    var index = this.tags.indexOf(tag);
    if(index == -1) {
      this.tags.push(tag);
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
