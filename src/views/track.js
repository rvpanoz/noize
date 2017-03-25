const config = require('../config');
const Marionette = require('backbone.marionette');
const Schema = require('schemas/track');
const template = require('templates/track.hbs');
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
    timeFinish: '.time-finish'
  },
  events: {
    'click i.fa-play': 'play',
    'click i.fa-stop': 'stop',
    'click i.fa-pause': 'pause',
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
    this.analyser.fftSize = 64;
  },

  onDomRefresh() {
    if (this.model.get('stream_url')) {
      _.delay(_.bind(function() {
        this.duration = this.audioElement[0].duration;
        var finishTime = this.duration * 1000; //milliseconds
        var timeFinish = moment.duration(finishTime);
        this.getUI('timeFinish').text(moment.utc(timeFinish.asMilliseconds()).format("HH:mm:ss"));
      }, this), 3000);

      //draw the graph
      this.draw();
    }

    //add events
    this.audioElement[0].addEventListener("progress", this.updateProgress, arguments);
    this.audioElement[0].addEventListener("canplay", _.bind(function() {}, this));
    this.player = this.getUI('player');
  },

  onStopAnimation(e) {
    this.timer.stop();
    return false;
  },

  draw() {

    var hh = $('nav').height();
    var w = this.getUI('planetarium').width();
    var h = $(window).height() - (3 * hh);
    var x = w / 2;
    var y = h / 2;
    var t0 = new Date();
    var delta = Date.now() - t0;

    var _this = this;

    // the data to visualize
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
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
      .attr("cx", x)
      .attr("cy", y)
      .attr("class", "sun");

    // planet group
    var planetGroup = this.planetarium.append("g")
      .attr("class", "planet-group")
      .attr("transform", "translate(" + x + "," + y + ")");

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
          .attr("class", "planet");
      });
  },

  play: function(e) {
    var t0 = new Date();
    var delta = (Date.now() - t0);
    var _this = this;

    //start playing
    this.audioElement[0].play();
    this.audioElement[0].volume = 0.01;

    //start timer
    this.timer = d3.timer(function() {
      var delta = (Date.now() - t0);
      var speed = 0;
      _this.planetarium.selectAll(".planet-cluster").attr("transform", function(d) {
        speed = d.phi0 * (delta / 3600);
        return "rotate(" + speed + ")";
      });
    });
    this.getUI('stop').removeClass('hide');
    this.getUI('play').addClass('hide');
  },

  stop: function(e) {
    this.audioElement[0].pause();
    this.audioElement[0].currentTime = 0;

    //event to stop animation
    this.trigger('stop:animation');

    this.getUI('stop').addClass('hide');
    this.getUI('play').removeClass('hide');
  },

  updateProgress: function() {
    var progress = this.$('progress');
    var timeContainer = this.$('.time-now');
    var value = 0,
      timeValue;
    var currentTime = this.audioElement[0].currentTime;
    var duration = this.audioElement[0].duration;
    if (currentTime > 0) {
      value = Math.floor(100 * currentTime / duration);
      timeValue = Math.floor(currentTime);
    }

    if (progress.length) {
      progress.css({
        width: value + "%",
        'background-color': '#ff77cc'
      });
      var currenTimeMilli = currentTime * 1000;
      var timeNow = moment.duration(currenTimeMilli);

      this.$('.time-now').text(moment.utc(timeNow.asMilliseconds()).format("HH:mm:ss"));
    }
  },

  seek: function(e) {
    e.preventDefault();
    this.audioElement.currentTime += 30;
  },

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },

  generateRgbColor: function(d, i) {
    var color = 'rgb(a, 100, 0)';
    var find = "a";
    var rgb = Math.floor(Math.random() * 100);
    var re = new RegExp(find, 'g');
    color = color.replace(re, rgb);

    return color;
  },

  onPlayerEnter(e) {
    this.player.css({
      opacity: 1
    })
  },

  onPlayerLeave(e) {
    this.player.css({
      opacity: 0.1
    });
  },

  serializeData() {
    var streamUrl = this.model.get('stream_url') + "?client_id=" + config.client_id;
    return _.extend(this.model.toJSON(), {
      pageTitle: 'Track',
      streamUrl: streamUrl
    });
  }
});

module.exports = TrackView;
