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
    return config.api.users;
  },
  parse(data) {
    this.next_href = (data.next_href) ? data.next_href : null;
    return data.collection;
  },
  comparator(m1, m2) {
    return m1.get('id');
  },
  doFetch(opts) {

    if(!opts && this.next_href) {
      return this.fetch();
    }

    return SC.get('/users', {
      q: opts.query,
      filter: 'public',
      format: 'json',
      client_id: config.client_id,
      limit: config.pageSize,
      linked_partitioning: 1
    });
  },
  get_sets(minutes) {
    var filtered = _.filter(this.models, function(model) {
      var duration = model.get('duration') //millis
      var min = (duration/1000) / 60;

      if(min >= minutes) {
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
  user: Model,
  users: Collection
}
