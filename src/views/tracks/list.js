const config = require('config');
const Marionette = require('backbone.marionette');
const template = require('templates/tracks/list.hbs');
const Schema = require('schemas/track');
const TrackItemView = require('views/tracks/list-item');

require('assets/css/list.css');

var TracksListView = Marionette.CompositeView.extend({
	template: template,
	childView: TrackItemView,
	tagName: 'ul',
	className: 'rolldown-list list-group',
	collectionEvents: {
		'sync': 'render'
	},
	initialize(opts) {
		this.collection = new Schema.Tracks();
	},
	onRender() {
		this.collection.sort();
	},
	serializeData() {
		return _.extend(this.collection.toJSON(), {
			models: this.collection.models
		});
	}
});

module.exports = TracksListView;
