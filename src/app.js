const Backbone = require('backbone');
const Marionette = require('backbone.marionette');
const HomeView = require('views/home');
const Router = require('./router');
const config = require('./config');
const Bootstrap = require('bootstrap/dist/js/bootstrap.min');
const themeJS = require('./assets/js/theme');
const SC = require('soundcloud');

var app = Marionette.Application.extend({
  user: null,
  content: null,
  region: '#app-content',
  baseUrl: config.api.url,

  onBeforeStart() {

    /**
     * initialize soundcloud
     */
    SC.initialize({
      client_id: config.client_id
    });

    /**
     * Instatiate router
     * @type {Router}
     */
    this.router = new Router();
  },

  onStart() {
    console.log('app:start');
    /**
     * setup config
     */
    this.config = _.extend({}, config);

    /**
     * Show layout view
     */
    this.showView(new HomeView());

    /**
     * Backbone history start
     */
    if (Backbone.history) {
      Backbone.history.start();
    }

    /**
     * Global app events
     */
  },

  navigate(cls, params) {
    var url = {};
    _.extend(url, {
      cls: cls,
      params: params
    });

    this.router.navigate(JSON.stringify(url), {
      trigger: true
    });

    return false;
  },

  onAppEvent(event, opts) {
    this.trigger(event, opts);
  },
  updateUI() {
    console.log('app:updateUI');
  },
  wait(active) {
    var spinner = $('.loading');
    if (active == true) {
      spinner.show();
    } else if (active == false) {
      setTimeout(function() {
        spinner.hide();
      }, 1000);
    }
  },
  showMessage(message, type) {
    alert(message);
  }
});

module.exports = new app();
