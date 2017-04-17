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
    planetarium: '#planetarium',
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
    _.bindAll(this, 'updateProgress');

    //get track id
    var trackId = _.get(params, 'trackId');

    this.model = new Schema.Track({
      id: trackId
    });

    this.visualizer = require('helpers/visualizer');

    //fetch model
    this.model.fetch();
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

    var svgWidth = this.getUI('planetarium').width();
    var svgHeight = $(window).height() - $('nav').outerHeight();

    //get svg container
    var svgContainer = this.svgContainer;

    /**
     * [volume description]
     * @type {Number}
     */
    this.audioElement[0].volume = 1.0;

    //init svg
    this.initSvg(svgContainer);

    // draw the circles
    this.visualizer.draw.call(this, [svgWidth, svgHeight]);

    /**
     * [add listener for 'progress' event]
     * @type {[type]}
     */
    this.audioElement[0].addEventListener('timeupdate', this.updateProgress, arguments);

    /**
     * [add listener for 'canplay' event]
     * @type {[type]}
     */
    this.audioElement[0].addEventListener('canplay', _.bind(function() {

      try {
        //init timers
        this.initTimers();

      } catch (e) {
        if (this.timer) {
          this.stop();
        }
        throw new Error(e);
      }
    }, this));
  },

  initSvg(parent) {
    var svgWidth = this.getUI('planetarium').width();
    var svgHeight = $(window).height() - this.getUI('player').outerHeight() * 1.7;
    var self = this;

    function createSvg(parent, height, width) {
      return d3.select(parent).append('svg').attr('height', height).attr('width', width);
    }

    this.svg = createSvg(parent, svgHeight, svgWidth);
    return this.svg;
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

  onDomRefresh() {
    //console.log('onDomRefresh');
  },

  play: function(e) {
    e.preventDefault();

    var svgWidth = this.getUI('planetarium').width();
    var svgHeight = $(window).height() - this.getUI('player').outerHeight() * 1.7;
    var self = this;

    //start playing
    this.audioElement[0].play();

    //start visualization using d3.timer function
    this.timer = d3.timer(_.bind(function() {
      return this.visualizer.visualizeData.call(this, [svgWidth, svgHeight]);
    }, this));

    //fix UI
    this.getUI('stop').removeClass('hide');
    this.getUI('play').addClass('hide');
  },

  stop: function(e) {
    if(e) {
      e.preventDefault();
    }

    this.audioElement[0].pause();
    this.audioElement[0].currentTime = 0;

    //stop time
    if (this.timer) {
      this.timer.stop();
    }

    //hide-show controls
    if(this.getUI('stop').length) this.getUI('stop').addClass('hide');
    if(this.getUI('stop').length) this.getUI('play').removeClass('hide');
  },

  updateProgress: function() {
    var progress = this.getUI('progress');
    var currentTime = this.audioElement[0].currentTime;
    var duration = this.audioElement[0].duration;
    // console.log(currentTime, duration);

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

  seek: function(e) {
    e.preventDefault();

    var target = this.$(e.currentTarget);
    var percent = 60;
    var duration = this.audioElement[0].duration;
    var currentTime = this.audioElement[0].currentTime;

    if(target.hasClass('fa-fast-backward')) {
      percent = percent * -1;
    }

    console.log(percent);
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

  onBeforeDestroy() {
    this.stop();
  }
});

module.exports = TrackView;
