const config = require('config');
const Marionette = require('backbone.marionette');
const template = require('templates/tracks/layout.hbs');
const TracksView = require('views/tracks/list');
const TagsView = require('views/tags');

var TracksLayoutView = Marionette.View.extend({
  template: template,
  tagName: 'section',
  id: 'tracks-layout',
  className: 'container',
  regions: {
    tracks: '#tracks-content',
    tags: '#tags-content'
  },
  initialize() {

  },
  onRender() {
    var tracks = new TracksView();
    var tags = new TagsView();

    this.showChildView('tracks', tracks);
    this.showChildView('tags', tags);
  },
  serializeData() {
    return {
      title: 'Tracks'
    }
  }
});

module.exports = TracksLayoutView;
