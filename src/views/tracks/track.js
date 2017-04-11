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
	tagName: 'section',
	className: 'track-full',
	svgContainer: '#planetarium',
	ui: {
		nav: '#mainNav',
		audioCtx: '#audio-content',
		planetarium: '#planetarium',
		play: 'i.fa-play',
		stop: 'i.fa-stop',
		player: '#player',
		timeFinish: '.time-finish',
		timeNow: '.time-now'
	},
	events: {
		'click i.fa-play': 'play',
		'click i.fa-stop': 'stop',
		'click i.fa-pause': 'pause',
		'click i.fa-fast-forward': 'seek',
		'mouseenter #player': 'onPlayerEnter',
		'mouseleave #player': 'onPlayerLeave'
	},
	modelEvents: {
		'sync': 'render'
	},
	initialize(params) {
		_.bindAll(this, 'onStopAnimation', 'updateProgress');

		//get track id
		var trackId = _.get(params, 'trackId');

		//Instatiate a new track
		this.model = new Schema.Track({
			id: trackId
		});

		this.listenTo(this, 'stop:animation', this.onStopAnimation, arguments, this)

		//fetch track
		this.model.fetch();
	},

	onRender() {
		//get audio element
		this.audioElement = this.getUI('audioCtx');
		//create audio context using HTML5 API
		this.audioCtx = new(window.AudioContext || window.webkitAudioContext)();
		//create analyser using HTML5 API
		this.analyser = this.audioCtx.createAnalyser();
		//create audio source using HTML5 API
		this.audioSrc = this.audioCtx.createMediaElementSource(this.audioElement[0]);
		//connect audio source with analyser
		this.audioSrc.connect(this.analyser);
		//connect analyser with audio contxt destination
		this.analyser.connect(this.audioCtx.destination);
		//setup fftsize
		this.analyser.fftSize = 256;
	},

	onDomRefresh() {
		if (this.model.get('stream_url')) {
			_.delay(_.bind(function () {
				this.duration = this.audioElement[0].duration;
				var finishTime = this.duration * 1000;
				var timeFinish = moment.duration(finishTime);
				this.getUI('timeFinish').text(moment.utc(timeFinish.asMilliseconds()).format("HH:mm:ss"));
			}, this), 1000);

			//add events
			this.audioElement[0].addEventListener("progress", this.updateProgress, arguments);
			this.audioElement[0].addEventListener("canplay", _.bind(function () {}, this));
			this.player = this.getUI('player');

			//draw the graph
			this.draw();
		}
	},

	onStopAnimation(e) {
		if (this.timer) {
			this.timer.stop();
		}
		return false;
	},

	draw() {
		var hh = $('nav').height();
		var w = this.getUI('planetarium').width() - 50;
		var h = $(window).height() - (3 * hh);
		var x = w / 2;
		var y = h / 2;
		var t0 = new Date();

		var radius = Math.min(w, h);

		//planets data
		var data = require('assets/files/planets-simple');

		var color = d3.scale.category20c();

		var rads = {
			'sun': radius / 8,
			earthOrbit: radius / 2.5,
			earth: radius / 32,
			moonOrbit: radius / 16,
			moon: radius / 96
		};

		// initialize board
		this.spaceBoard = d3.select(this.svgContainer)
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.append("g")
			.attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

		//the sun
		this.spaceBoard.append("circle")
			.attr("class", "sun")
			.attr("r", rads.sun)
			.style("fill", "rgba(255, 204, 0, 1.0)");

		// Earth's orbit
		this.spaceBoard.append("circle")
			.attr("class", "earthOrbit")
			.attr("r", rads.earthOrbit)
			.style("fill", "none")
			.style("stroke", "rgba(255, 204, 0, 0.25)");

		var earthOrbitPosition = d3.arc()
			.outerRadius(rads.earthOrbit + 1)
			.innerRadius(rads.earthOrbit - 1)
			.startAngle(0)
			.endAngle(0);

		this.spaceBoard.append("path")
			.attr("class", "earthOrbitPosition")
			.attr("d", earthOrbitPosition)
			.style("fill", "rgba(255, 204, 0, 0.75)");

		// Earth
		this.spaceBoard.append("circle")
			.attr("class", "earth")
			.attr("r", rads.earth)
			.attr("transform", "translate(0," + -rads.earth + ")")
			.style("fill", "rgba(113, 170, 255, 1.0)");

		// Moon's orbit
		this.spaceBoard.append("circle")
			.attr("class", "moonOrbit")
			.attr("r", rads.moonOrbit)
			.attr("transform", "translate(0," + -rads.earthOrbit + ")")
			.style("fill", "none")
			.style("stroke", "rgba(113, 170, 255, 0.25)");

		// Current position of the Moon in its orbit
		var moonOrbitPosition = d3.arc()
			.outerRadius(rads.moonOrbit + 1)
			.innerRadius(rads.moonOrbit - 1)
			.startAngle(0)
			.endAngle(0);
		this.spaceBoard.append("path")
			.attr("class", "moonOrbitPosition")
			.attr("d", moonOrbitPosition)
			.attr("transform", "translate(0," + -rads.earthOrbit + ")")
			.style("fill", "rgba(113, 170, 255, 0.75)");

		// Moon
		this.spaceBoard.append("circle")
			.attr("class", "moon")
			.attr("r", rads.moon)
			.attr("transform", "translate(0," + (-rads.earthOrbit + -rads.moonOrbit) + ")")
			.style("fill", "rgba(150, 150, 150, 1.0)");
	},

	play: function (e) {
		var _this = this;
		var t0 = new Date();
		var speed = 0.4;

		//start playing
		this.audioElement[0].play();

		//get frequency data
		// _this.analyser.getByteTimeDomainData(dataArray);
		// _this.analyser.getByteFrequencyData(dataArray);

		var bufferLength = this.analyser.frequencyBinCount;
		var dataArray = new Uint8Array(bufferLength);
		var line = d3.line();

		//sort data
		dataArray.sort();

		//start timer
		this.timer = d3.timer(function () {
			var delta = (Date.now() - t0) / 1000; //seconds

			//start rotation
			_this.spaceBoard.selectAll(".moon")
				.data(dataArray)
				.transition()
				.delay(function (d, i, nodes) {
					return delta * 0.5;
				})
				.attr("transform", function (d, i) {
					return "rotate(" + d / 2 + ")";
				})

			//clean up
			_this.spaceBoard.exit().remove();
		});

		this.getUI('stop').removeClass('hide');
		this.getUI('play').addClass('hide');
	},

	stop: function (e) {
		this.audioElement[0].pause();
		this.audioElement[0].currentTime = 0;

		//event to stop animation
		this.trigger('stop:animation');

		//hide-show controls
		this.getUI('stop').addClass('hide');
		this.getUI('play').removeClass('hide');
	},

	updateProgress: function () {
		var progress = this.$('progress');
		var timeContainer = this.$('.time-now');
		var value = 0,
			timeValue;
		var currentTime = this.audioElement[0].currentTime;
		var duration = this.audioElement[0].duration;
		var currenTimeMilli = currentTime * 1000;
		var timeNow = moment.duration(currenTimeMilli);

		if (progress.length && currentTime > 0) {
			value = Math.floor(100 * currentTime / duration);
			timeValue = Math.floor(currentTime);

			progress.css({
				width: value + "%",
				'background-color': '#ff77cc'
			});
			this.getUI('timeNow').text(moment.utc(timeNow.asMilliseconds()).format("HH:mm:ss"));
		}
	},

	seek: function (e) {
		e.preventDefault();
		this.audioElement[0].currentTime += 30;
	},

	getRandomColor() {
		var letters = 'ff77cc';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 6)];
		}
		return color;
	},

	generateRgbColor: function (d, i) {
		var color = 'rgb(255,a,204)';
		var find = "a";
		var rgb = Math.floor(Math.random() * d);
		var re = new RegExp(find, 'g');
		color = color.replace(re, rgb);

		return color;
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

	onBeforeDestroy() {
		this.stop();
	},

	onDestroy() {
		//todo
	}
});

module.exports = TrackView;
