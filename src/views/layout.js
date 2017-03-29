//js
const config = require('../config');
const Marionette = require('backbone.marionette');
const template = require('../templates/layout.hbs')
const HeaderView = require('./common/header');

//css
require('bootstrap/dist/css/bootstrap.css');
require('assets/font-awesome/css/font-awesome.min.css');
require('assets/css/agency.min.css');
require('assets/css/app.css');
require('assets/css/buttons.css');
require('assets/css/animate.min.css');
require('assets/css/normalize.css');

var LayoutView = Marionette.View.extend({
  template: template,
  tagName: 'layout',
  regions: {
    headerRegion: '#header-content',
    mainRegion: '#main-content'
  },
  childViewTriggers: {
    'scroll:page': 'child:scroll:page'
  },
  initialize() {
    /**
     * [load main view]
     */
    this.listenTo(app, 'app:loadView', _.bind(function(url) {
      var View = require("views/" + url.cls);
      var params = _.extend(url.params, {});

      app.activeView = new View(params);
      this.showChildView('mainRegion', app.activeView);
    }, this));
  },
  onChildScrollPage(section) {
    var $target = this.$(section);

    if ($target.length) {
      $('html, body').animate({
        scrollTop: $target.offset().top
      }, 1000);
    }

    return false;
  },
  onRender() {
    var headerView = new HeaderView();
    this.showChildView('headerRegion', headerView);
  }
});

module.exports = LayoutView;
