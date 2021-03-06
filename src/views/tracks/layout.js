const config = require('config');
const Marionette = require('backbone.marionette');
const template = require('templates/tracks/layout.hbs');
const TracksView = require('views/tracks/list');
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
    'filter:data': 'child:filter:data',
    'fetch:data': 'child:fetch:data'
  },
  initialize() {
		var filtersRegion = this.getRegion('filters');

    this.listenTo(this, 'fetch:success', function() {
      filtersRegion.currentView.getUI('cdtrigger').show();
    });
  },
  onRender() {
    var tracks = new TracksView();
    var filters = new FiltersView();

    this.showChildView('tracks', tracks);
    this.showChildView('filters', filters);
  },
  onChildFilterData(data) {
    var tracksView = this.getChildView('tracks');

    if (tracksView && tracksView.collection) {
      var tracks = tracksView.collection;
      var selected = tracks.get_downloadable();
      tracks.reset(selected);
    }

    return false;
  },
  onChildFetchData(queryString) {
    var tracksView = this.getChildView('tracks');

    if (tracksView && tracksView.collection) {
      var tracks = tracksView.collection;
      tracks.doFetch(queryString).done(_.bind(function() {
        this.trigger('fetch:success', arguments);
      }, this));
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
