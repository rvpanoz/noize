const config = require('../config');
const Marionette = require('backbone.marionette');
const TagsView = require('views/tags');
const template = require('templates/home.hbs');
const moment = require('moment');

require('assets/css/tags.css');

var now = moment();

var HomeView = Marionette.View.extend({
  template: template,
  tagName: 'section',
  id: 'discover',
  className: 'discover',
  date: now,
  regions: {
    'tags-content': '#tags-content'
  },
  onRender() {
    //tags view
    var tagsView = new TagsView();
    this.showChildView('tags-content', tagsView);
  },

  serializeData() {
    return {
      title: 'Tags'
    }
  }
});

module.exports = HomeView;
