const config = require('../config');
const moment = require('moment');
const SC = require('soundcloud');

var backboneSync = Backbone.sync;

var Track = Backbone.Model.extend({
	idAttribute: 'id',
	urlRoot: function () {
		return config.api.tracks;
	},
	parse: function (data) {
		data.created_at = moment(new Date(data.created_at)).format('d/m/Y');
		data.stream_url = data.stream_url + "?client_id=" + config.client_id;
		return data;
	}
});

var Tracks = Backbone.Collection.extend({
	model: Track,
	next_href: null,
	url: function () {
		if (this.next_href) {
			/** TODO pagination **/
			console.log(this.next_href);
		}
		return config.api.tracks;
	},
	doFetch(queryString) {
		var data = null;
		
		if (!queryString) {
			console.error('queryString missing');
			return false;
		}

		data = {
			q: queryString,
			filter: 'public',
			format: 'json',
			limit: config.pageSize,
			linked_partitioning: 1
		};

		return this.fetch({
			data: data
		});
	},
	parse(data) {
		this.next_href = (data.next_href) ? data.next_href : null;
		return data.collection;
	},
	comparator(m1, m2) {
		var cam1 = parseInt(m1.get('id'));
		var cam2 = parseInt(m2.get('id'));
		return -(cam1 > cam2);
	},
	filter_data(data) {
		return data;
	},
	get_sets(minutes) {
		var filtered = _.filter(this.models, function (model) {
			var duration = model.get('duration') //millis
			var min = (duration / 1000) / 60;

			if (min >= minutes) {
				return true;
			}
			return false;
		});

		return filtered;
	},
	get_downloadable() {
		var filtered = _.filter(this.models, function (model) {
			return model.get('downloadable');
		}, this);

		return filtered;
	}
});

module.exports = {
	Track: Track,
	Tracks: Tracks
}
