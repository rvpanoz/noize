const config = require('config');
const Marionette = require('backbone.marionette');
const Schema = require('schemas/track');
const template = require('templates/tracks/track.hbs');
const d3 = require('d3');
const moment = require('moment');

require('assets/css/graph.css');
require('assets/css/player.css');

var TrackView = Marionette.View.extend({
	template: template,
	svgContainer: '#planetarium',
	ui: {
		nav: '#mainNav',
		audioCtx: '#audio-content',
		board: '#planetarium',
		play: 'i.fa-play',
		stop: 'i.fa-stop',
		player: '#player',
		timeFinish: '.time-finish',
		timeNow: '.time-now',
		progress: 'progress'
	},
	events: {
		'click i.fa-play': 'play',
		'click i.fa-stop': 'stop',
		'click i.fa-pause': 'pause',
		'click i.fa-fast-forward': 'seek',
		'click i.fa-fast-backward': 'seek',
		'xmouseenter #player': 'onPlayerEnter',
		'xmouseleave #player': 'onPlayerLeave'
	},
	modelEvents: {
		'sync': 'render'
	},
	initialize(params) {
		_.bindAll(this, 'updateProgress', 'canplay');

		//get track id
		var trackId = _.get(params, 'trackId');

		this.model = new Schema.Track({
			id: trackId
		});

		this.visualizer = require('helpers/visualizer');

		//fetch model
		this.model.fetch();
	},

	canplay() {
		try {
			this.initTimers();
		} catch (e) {
			if (this.timer) {
				this.stop();
			}
			throw new Error(e);
		}
	},

	onRender() {
		/**
		 * [create audio source and analyser]
		 * @type {[type]}
		 */
		this.audioElement = this.getUI('audioCtx'); //get audio element
		this.audioCtx = new(window.AudioContext || window.webkitAudioContext)(); //create audio context using HTML5 API
		this.analyser = this.audioCtx.createAnalyser(); //create analyser using HTML5 API
		this.audioSrc = this.audioCtx.createMediaElementSource(this.audioElement[0]); //create audio source using HTML5 API
		this.audioSrc.connect(this.analyser); //connect audio source with analyser
		this.analyser.connect(this.audioCtx.destination); //connect analyser with audio contxt destination
		this.analyser.fftSize = 256; //setup fftsize

		/**
		 * [volume description]
		 * @type {Number}
		 */
		this.audioElement[0].volume = 1.0;
	},

	onAttach() {
		console.log('on attach to DOM');
	},

	onDomRefresh() {

		var stream_url = this.model.get('stream_url');
		if(!stream_url) return;
		
		var container = this.svgContainer;
		var playerHeight = this.getUI('player').height();
		var navHeight = $('nav').height();
		var margin = {
			left: 15,
			right: 15,
			top: navHeight,
			bottom: playerHeight
		};

		var svgWidth = this.getUI('board').width();
		var svgHeight = $('body').height() - (margin.top + margin.bottom);

		/**
		 * [draw svg and initial state of the objects]
		 */
		this.visualizer.draw.call(this, container, svgWidth, svgHeight);

		/**
		 * [add listener for 'progress' event]
		 * @type {[type]}
		 */
		this.audioElement[0].addEventListener('timeupdate', this.updateProgress, arguments);

		/**
		 * [add listener for 'canplay' event]
		 * @type {[type]}
		 */
		this.audioElement[0].addEventListener('canplay', this.canplay, arguments);
	},

	initTimers() {

		function calculateTotalValue(length) {
			var milliseconds = length * 1000;
			var timeFinish = moment.duration(milliseconds);
			return moment.utc(timeFinish.asMilliseconds()).format("HH:mm:ss");
		}

		var player = this.audioElement[0];
		var length = player.duration;
		var current_time = player.currentTime;

		// calculate total length of value
		var totalLength = calculateTotalValue(length);
		this.getUI('timeFinish').text(totalLength);

		var timeNow = moment.duration();
		this.getUI('timeNow').text(moment.utc(timeNow.asMilliseconds()).format("HH:mm:ss"));
	},

	play: function (e) {
		e.preventDefault();

		//start playing
		var playPromise = this.audioElement[0].play();

		if (playPromise !== undefined) {
			playPromise.then(_.bind(function () {
				this.timer = d3.timer(_.bind(function (elapsed) {
					this.visualizer.visualize.call(this, elapsed);
				}, this));
				this.getUI('stop').removeClass('hide');
				this.getUI('play').addClass('hide');
			}, this)).catch(function (error) {
				throw new Error(error);
			});
		}
	},

	stop: function (e) {
		if (e) {
			e.preventDefault();
		}

		this.audioElement[0].pause();
		this.audioElement[0].currentTime = 0;

		//hide-show controls
		if (this.getUI('stop')) this.getUI('stop').addClass('hide');
		if (this.getUI('stop')) this.getUI('play').removeClass('hide');
	},

	updateProgress: function () {
		var progress = this.getUI('progress');
		var currentTime = this.audioElement[0].currentTime;
		var duration = this.audioElement[0].duration;

		var current_milliseconds = currentTime * 1000;
		var timeNow = moment.duration(current_milliseconds);

		var t = moment.utc(timeNow.asMilliseconds()).format("HH:mm:ss");
		this.getUI('timeNow').text(t);

		if (progress.length && currentTime > 0) {
			var value = Math.floor(currentTime * 100 / duration);
			progress.css({
				width: value + "%"
			});
		}
	},

	seek: function (e) {
		e.preventDefault();

		var target = this.$(e.currentTarget);
		var percent = 60;
		var duration = this.audioElement[0].duration;
		var currentTime = this.audioElement[0].currentTime;

		if (target.hasClass('fa-fast-backward')) {
			percent = percent * -1;
		}

		this.getUI('progress').value = percent / 100;
		this.audioElement[0].currentTime += percent;
	},

	onPlayerEnter(e) {
		this.getUI('player').css({
			opacity: 1
		})
	},

	onPlayerLeave(e) {
		this.getUI('player').css({
			opacity: 0.1
		});
	},

	serializeData() {
		var streamUrl = this.model.get('stream_url') + "?client_id=" + config.client_id;
		return _.extend(this.model.toJSON(), {
			pageTitle: 'Track',
			streamUrl: streamUrl
		});
	},

	onDestroy() {

		//stop the player
		this.audioElement[0].pause();

		//remove listeners
		this.audioElement[0].removeEventListener('timeupdate', function() {}, false);
		this.audioElement[0].removeEventListener('canplay', function() {}, false);

		//stop time
		if (this.timer) {
			this.timer.stop();
		}

	}
});

module.exports = TrackView;
