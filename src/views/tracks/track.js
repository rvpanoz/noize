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
    this.analyser.fftSize = 256;
  },
  onDomRefresh() {
    if (this.model.get('stream_url')) {
      _.delay(_.bind(function() {
        this.duration = this.audioElement[0].duration;
        var finishTime = this.duration * 1000; //milliseconds
        var timeFinish = moment.duration(finishTime);
        this.getUI('timeFinish').text(moment.utc(timeFinish.asMilliseconds()).format("HH:mm:ss"));
      }, this), 1000);

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
    //up to heres

    var w = $(window).width();
    var h = $(window).height();
    var x = w / 2;
    var y = h / 2;
    // console.log()
    var t0 = new Date();

    var bufferLength = this.analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    //get frequency data
    this.analyser.getByteTimeDomainData(dataArray);

    this.board = d3.select(this.svgContainer);
    var width = +this.board.attr("width");
    var height = +this.board.attr("height");
    console.log(width, height)
    this.angles = d3.range(0, 2 * Math.PI, Math.PI / 200);


    this.path = this.board.append("g")
      .attr("transform", "translate(" + x + "," + y + ")")
      .attr("fill", "none")
      .attr("stroke-width", 10)
      .attr("stroke-linejoin", "round")
      .selectAll("path")
      .data(["cyan", "magenta", "yellow"])
      .enter().append("path")
      .attr("stroke", function(d) {
        return d;
      })
      .style("mix-blend-mode", "darken")
      .datum(function(d, i) {
        return d3.radialLine()
          .curve(d3.curveLinearClosed)
          .angle(function(a) {
            return a;
          })
          .radius(function(a) {
            var t = d3.now() / 1000;
            return 200 + Math.cos(a * 8 - i * 2 * Math.PI / 3 + t) * Math.pow((1 + Math.cos(a - t)) / 2, 3) * 32;
          });
      });

  },
  play: function(e) {

    var _this = this;
    var t0 = new Date();
    var speed = 0.4;

    //start playing
    this.audioElement[0].play();

    var bufferLength = this.analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    //get frequency data
    _this.analyser.getByteTimeDomainData(dataArray);
    // _this.analyser.getByteFrequencyData(dataArray);

    //start timer
    this.timer = d3.timer(function() {
      var delta = (Date.now() - t0) / 1000; //seconds

      _this.path.attr("d", function(d) {
        return d(_this.angles);
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

    //hide-show controls
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
  seek: function(e) {
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
  generateRgbColor: function(d, i) {
    var color = 'rgb(255,a,204)';
    var find = "a";
    var rgb = Math.floor(Math.random() * d);
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
  },
  onBeforeDestroy() {
    this.stop();
  },
  onDestroy() {
    //todo
  }
});

module.exports = TrackView;
