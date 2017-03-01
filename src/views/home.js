const Marionette = require('backbone.marionette');
const template = require('../templates/home.hbs')
const config = require('../config');
const ItemsView = require('./items');
const TagsView = require('./tags');

const bootstrapCss = require('bootstrap/dist/css/bootstrap.css');
const fontawesome = require('assets/font-awesome/css/font-awesome.min.css');

var HomeView = Marionette.View.extend({
  template: template,
  searchValue: '',
  regions: {
    itemsRegion: '#items-content'
  },
  events: {
    'click .erase': 'onErase',
    'click .btn-search': 'onSearch'
  },
  ui: {
    query: 'input[name="query"]'
  },
  onRender() {
    this.showChildView('itemsRegion', new ItemsView());
  },
  onErase() {
    this.getUI('query').val('');
  },
  onSearch(e) {
    e.preventDefault();
    var query = this.getUI('query');

    if(!query.val().length > 1) {
      this.searchValue = '';
      query.val('');
      return;
    }

    this.searchValue = query.val();

    if(query && query.length) {
      app.onAppEvent('fetch:items', {
        query: this.searchValue
      });
    }

    return false;
  },
  serializeData() {
    return {
      title: 'Home'
    }
  }
});

module.exports = HomeView;
