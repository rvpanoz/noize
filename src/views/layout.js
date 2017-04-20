//js
const config = require('../config');
const Marionette = require('backbone.marionette');
const template = require('../templates/layout.hbs')
const HeaderView = require('./common/header');

//css
require('bootstrap/dist/css/bootstrap.css');
require('assets/font-awesome/css/font-awesome.min.css');
require('assets/themes/paper/css/paper.css');
require('assets/css/app.css');

var LayoutView = Marionette.View.extend({
	template: template,
	tagName: 'layout',
	navbar_initialized: false,
	navbar_menu_visible: 0,
	regions: {
		headerRegion: '#header-content',
		mainRegion: '#main-content'
	},

	initialize() {
		var mainRegion = this.getRegion('mainRegion');

		this.listenTo(mainRegion, 'show', function () {
			app.toggleMask(false);
		});

		/**
		 * [load main view]
		 */
		this.listenTo(app, 'app:loadView', _.bind(function (url) {
			app.toggleMask(true);
			var View = require("views/" + url.cls);
			var params = _.extend(url.params, {});

			app.activeView = new View(params);
			this.showChildView('mainRegion', app.activeView);
		}, this));
	},

	onRender() {
		var headerView = new HeaderView();
		this.showChildView('headerRegion', headerView);
	},

	setupMenu() {
		if ($(window).width() < 768) {
			this._initRightMenu();
		}
	}
});

module.exports = LayoutView;
