const config = require('config');
const Marionette = require('backbone.marionette');
const template = require('templates/tracks/layout.hbs');
const TracksView = require('views/tracks/list');
const TagsView = require('views/tags');
const FiltersView = require('views/tracks/list-filters');

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
  childViewTriggers: {
    'filter:data':'child:filter:data'
  },
  onRender() {
    var tracks = new TracksView();
    var tags = new TagsView();
    var filters = new FiltersView();

    this.showChildView('tracks', tracks);
    this.showChildView('tags', tags);
    this.showChildView('filters', filters);
  },
  onChildFilterData(data) {
    var tracksView = this.getChildView('tracks');

    if(tracksView && tracksView.collection) {
      var tracks = tracksView.collection;
      var selected = tracks.get_downloadable();
      tracks.reset(selected);
    }
    return false;
  },
  serializeData() {
    return {
      title: 'Tracks'
    }
  }
});

module.exports = TracksLayoutView;
