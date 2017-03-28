const Backbone = require('backbone');
const Marionette = require('backbone.marionette');
const LayoutView = require('views/layout');
const Router = require('./router');
const config = require('./config');
const Bootstrap = require('bootstrap/dist/js/bootstrap.min');
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

    //global debuglog
    window.dglog = console.log.bind(console, "DEBUG:");

    /**
     * setup config
     */
    this.config = _.extend({}, config);

    /**
     * Show layout view
     */
    this.showView(new LayoutView());

    /**
     * Backbone history start
     */
    if (Backbone.history) {
      Backbone.history.start();
    }

    /**
     * requestAnimFrame
     */
     window.requestAnimFrame = (function(){
       return  window.requestAnimationFrame ||
       window.webkitRequestAnimationFrame ||
       window.mozRequestAnimationFrame ||
       function(callback){
         window.setTimeout(callback, 1000 / 60);
       };
     })();

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
