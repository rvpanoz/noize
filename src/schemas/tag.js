const config = require('../config');
const moment = require('moment');

var backboneSync = Backbone.sync;
var Model = Backbone.Model.extend({

});

var Collection = Backbone.Collection.extend({
  model: Model,
  url: function() {
    return "../assets/genres.json";
  }
});

module.exports = {
  Tag: Model,
  Tags: Collection
}
