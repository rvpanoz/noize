const config = require('../config');
const moment = require('moment');

var backboneSync = Backbone.sync;
var Model = Backbone.Model.extend({

});

var Collection = Backbone.Collection.extend({
  model: Model,
  url: function() {
    return "https://api.soundcloud.com/tracks";
  },
  comparator(m1, m2) {
    var d1 = moment(m1.get('created_at'));
    var d2 = moment(m2.get('created_at'));
    return d2 > d1;
  },
  get_downloadable() {
    return _.filter(this.models, function(model) {
      return model.get('downloadable') == true;
    }, this);
  }
});

module.exports = {
  Item: Model,
  Items: Collection
}
