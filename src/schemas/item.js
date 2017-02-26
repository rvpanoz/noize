const config = require('../config');
const moment = require('moment');
const SC = require('soundcloud');

var backboneSync = Backbone.sync;
var Model = Backbone.Model.extend({

});

var Collection = Backbone.Collection.extend({
  model: Model,
  next_href: null,
  url: function() {
    if(this.next_href) {
      return this.next_href;
    } else {
      return "https://api.soundcloud.com/tracks";
    }
  },
  parse(data) {
    this.next_href = (data.next_href) ? data.next_href : null;
    return data.collection;
  },
  comparator(m1, m2) {
    var d1 = moment(m1.get('created_at'));
    var d2 = moment(m2.get('created_at'));
    return d2 > d1;
  },
  doFetch(opts) {
    SC.get('/tracks', {
      q: opts.query, tag_list: opts.tag_list
    }).then(function(tracks) {
      this.reset(tracks);
    });
  },
  get_downloadable() {
    return _.filter(this.models, function(model) {
      console.log(model.toJSON().downloadable);
      return model.get('downloadable');
    }, this);
  }
});

module.exports = {
  Item: Model,
  Items: Collection
}
