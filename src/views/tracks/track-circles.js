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

		this.model = new Schema.Track({
			id: trackId
		});
		this.model.fetch();
		this.listenTo(this, 'stop:animation', this.onStopAnimation, arguments, this);
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
      _.delay(_.bind(function() {
        this.duration = this.audioElement[0].duration;
        var finishTime = this.duration * 1000; //milliseconds
        var timeFinish = moment.duration(finishTime);
        this.getUI('timeFinish').text(moment.utc(timeFinish.asMilliseconds()).format("HH:mm:ss"));
      }, this), 3000);

			try {
				//draw the graph
	      this.draw();
			} catch (e) {
				console.error(e);
				this.stop();
			}
    }

    //add events
    this.audioElement[0].addEventListener("timeupdate", this.updateProgress, arguments);
    this.audioElement[0].addEventListener("canplay", _.bind(function() {}, this));
    this.player = this.getUI('player');
  },

  onStopAnimation(e) {
		if(this.timer)
    	this.timer.stop();
    return false;
  },

  draw() {
    var hh = $('nav').height();
    var w = this.getUI('planetarium').width();
    var h = $(window).height() - (3 * hh);
    var t0 = new Date();
    var delta = Date.now() - t0;

    var _this = this;

    // the data to visualize
    this.frequencyData = new Uint8Array(200);

    this.planets = require('assets/files/planets-simple');

    // the planetarium
    this.planetarium = d3.select(this.svgContainer)
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    // the sun
    this.planetarium
      .append("circle")
      .attr("r", 20)
      .attr("cx", w/2)
      .attr("cy", h/2)
      .attr("class", "sun");

    // planet group
    var planetGroup = this.planetarium.append("g")
      .attr("class", "planet-group")
      .attr("transform", "translate(" + w/2 + "," + h/2 + ")");

    // draw planets with orbits
    planetGroup.selectAll("g.planet")
      .data(this.planets)
      .enter()
      .append("g")
      .attr("class", "planet-cluster").each(function(d, i) {
        d3.select(this).append("circle")
          .attr("class", "orbit")
          .attr("r", d.R * 2)
          .attr("cx", 0)
          .attr("cy", 0)
        d3.select(this).append("circle")
          .attr("r", d.r)
          .attr("cx", d.R * 2)
          .attr("class", "nplanet")
					.style("fill", "#e7e7e7");
      });
  },

  play: function(e) {
    var t0 = new Date();
    var delta = (Date.now() - t0);
    var _this = this;

    //start playing
    this.audioElement[0].play();

		// adjust volume
    // this.audioElement[0].volume = 0.01;

		// Copy frequency data to frequencyData array.
   	var frequencyData = new Uint8Array(200);

		var color = d3.scaleOrdinal(d3.schemeCategory20);

    //start timer
    this.timer = d3.timer(function() {

			var delta = Date.now() - t0;
      var speed = 0;

			//copy byte frequencyData into frequencyData array
			_this.analyser.getByteFrequencyData(frequencyData);

			//rotate planets
      _this.planetarium.selectAll(".planet-cluster")
			.selectAll('.nplanet').each(function(circle) {
				d3.select(this)
				.style('fill', color(Math.floor(Math.random() * 20)))
			})
			.attr("transform", function(d, i) {
				var speed = frequencyData[Math.floor(Math.random() * frequencyData.length)] / 100;
        return "rotate(" + speed + ")";
      });

			_this.planetarium.exit().remove();
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
			value = Math.floor(10 * currentTime / duration);
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
