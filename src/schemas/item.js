const config = require('../config');
const moment = require('moment');
const SC = require('soundcloud');

var backboneSync = Backbone.sync;
var Model = Backbone.Model.extend({
  idAttribute: 'id'
});

var Collection = Backbone.Collection.extend({
  model: Model,
  next_href: null,
  url: function() {
    if(this.next_href) {
      return this.next_href;
    }
    return config.api.tracks;
  },
  parse(data) {
    this.next_href = (data.next_href) ? data.next_href : null;
    return data.collection;
  },
  comparator(m1, m2) {
    return m1.get('id');
  },
  doFetch(opts) {
    SC.get('/tracks', {
      q: opts.query, tag_list: opts.tag_list
    }).then(function(tracks) {
      this.reset(tracks);
    });
  },
  get_sets(minutes) {
    var filtered = _.filter(this.models, function(model) {
      var duration = model.get('duration') //millis
      var min = (duration/1000) / 60;

      if(min >= minutes) {
        console.log(model.get('title'));
        return true;
      }

      return false;
    });

    return filtered;
  },
  get_downloadable() {
    var filtered = _.filter(this.models, function(model) {
      return model.get('downloadable');
    }, this);

    return filtered;
  }
});

module.exports = {
  Item: Model,
  Items: Collection
}
