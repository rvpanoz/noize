const config = require('config');
const Marionette = require('backbone.marionette');
const template = require('templates/tracks/layout.hbs');
const TracksView = require('views/tracks/list');
const TagsView = require('views/tags');
const FiltersView = require('views/filters');

var TracksLayoutView = Marionette.View.extend({
  template: template,
  tagName: 'section',
  id: 'tracks-layout',
  className: 'container',
  regions: {
    tracks: '#tracks-content',
    tags: '#tags-content',
    filters: '#filters-content'
  },
  initialize() {

  },
  onRender() {
    var tracks = new TracksView();
    var tags = new TagsView();
    var filters = new FiltersView();

    this.showChildView('tracks', tracks);
    this.showChildView('tags', tags);
    this.showChildView('filters', filters);
  },
  serializeData() {
    return {
      title: 'Tracks'
    }
  }
});

module.exports = TracksLayoutView;
