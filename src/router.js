const _ = require('lodash');
const Backbone = require('backbone');
const utils = require('./utils');

module.exports = Backbone.Router.extend({
  routes: {
    '*actions': 'do_action'
  },
  do_action: function (actions) {
    var token = localStorage.getItem('token');
    var url = utils.decode(actions), opts;

    //fix url
    if (!url || _.isNull(url)) {
      url = {
        cls: 'home'
      }
    }

    //load the view
    this.navigate(JSON.stringify(url), {
      trigger: true
    });
  }
});
