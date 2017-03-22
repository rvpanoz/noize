const config = require('../config');

var Tag = Backbone.Model.extend({

});

var Tags = Backbone.Collection.extend({
  url: 'public/tags.json',
  model: Tag
});

module.exports = {
  Tag: Tag,
  Tags: Tags
}
