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
    svgContainer: '#planetarium',
    svgWidth: 800,
    svgHeight: 600,
    ui: {
      audioCtx: '#audio-content',
      planetarium: '#planetarium',
      play: 'i.fa-play',
      stop: 'i.fa-stop'
    },
    events: {
      'click i.fa-play': 'play',
      'click i.fa-stop': 'stop',
      'click i.fa-pause': 'pause'
    },
    modelEvents: {
      'sync': 'render'
    },
    initialize(params) {
      _.bindAll(this, 'renderVisual', 'onStopAnimation');

      //get track id
      var trackId = _.get(params, 'id');

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
    onAttach() {
      this.audioElement[0].addEventListener("timeupdate", this.updateProgress, false);
      this.audioElement[0].addEventListener("canplay", _.bind(function () {}, this));
    },
    onDomRefresh() {
      this.draw();
    },
    onStopAnimation(e) {
      /**
       * Cancels an animation frame request
       * previously scheduled through a call to
       * window.requestAnimationFrame().
       * @type {Number}
       */
      window.cancelAnimationFrame(this.animation);
    },
    draw() {
      //constants
      var w = 960;
      var h = 500;
      var x = w/2;
      var y = h/2;
      var t0 = new Date();
      var delta = Date.now() - t0;

      // the data to visualize
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      this.planets = require('assets/files/planets');

      // the planetarium
      this.planetarium = d3.select(this.svgContainer)
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      // the sun
      this.planetarium
        .append("circle")
        .attr("r", 10)
        .attr("cx", x)
        .attr("cy", y)
        .attr("class", "sun");

        // planet group
      var planetGroup = this.planetarium.append("g")
          .attr("class", "planet-group")
          .attr("transform", "translate(" + x + "," + y + ")");

          // draw planets and moon clusters
          planetGroup.selectAll("g.planet")
            .data(this.planets)
            .enter()
            .append("g")
            .attr("class", "planet-cluster").each(function(d, i) {
              d3.select(this).append("circle").attr("class", "orbit")
                .attr("r", d.R);
              d3.select(this).append("circle").attr("r", d.r).attr("cx",d.R)
                .attr("cy", 0).attr("class", "planet");
              d3.select(this).append("g").attr("transform", "translate(" + d.R + ",0)")
                 .selectAll("g.moon").data(d.moons).enter().append("g")
                 .attr("class", "moon-cluster").each(function(d, i) {
                   d3.select(this).append("circle").attr("class", "orbit")
                     .attr("r", d.R/2);
                   d3.select(this).append("circle").attr("r", d.r/2).attr("cx",d.R)
                     .attr("cy", 0).attr("class", "moon");
                 })
                 .attr("transform", function(d) {
                   return "rotate(" + (d.phi0 + (delta * (d.speed))) + ")";
                 });
            })
            .attr("transform", function(d) {
              return "rotate(" + (d.phi0 + (delta * (d.speed/100))) + ")";
            });
    },
    renderVisual() {

      /**
      * perform an animation
      * through a call to window.requestAnimationFrame()
      * chk:app.js
      */
      this.animation = requestAnimFrame(this.renderVisual);
      this.analyser.getByteFrequencyData(this.frequencyData);

      var _this = this;
      var t0 = new Date();
      var delta = (Date.now() - t0);
      var speed = 1.4;
      var angle = delta * speed;

      var transform = function(d) {
        console.log(d);
        return "rotate(" + (d.phi0 + (delta * speed)) + ")";
      };

      this.planetarium.selectAll(".planet-cluster, .moon-cluster")
        .attr("transform", transform);

      this.planetarium.exit().remove();
    },
    play: function (e) {
      this.audioElement[0].play();
      this.renderVisual();
      this.getUI('stop').removeClass('hide');
      this.getUI('play').addClass('hide');
    },
    stop: function (e) {
      this.audioElement[0].pause();
      this.audioElement[0].currentTime = 0;

      //event to stop animation
      this.trigger('stop:animation');

      this.getUI('stop').addClass('hide');
      this.getUI('play').removeClass('hide');
    },
    updateProgress: function () {
      console.log(arguments);
    },
    getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    seek: function (e) {
      e.preventDefault();
      this.audioElement.currentTime += 30;
    },
    generateRgbColor: function (d, i) {
      var color = 'rgb(a, 100, 0)';
      var find = "a";
      var rgb = Math.floor(Math.random() * 100);
      var re = new RegExp(find, 'g');
      color = color.replace(re, rgb);

      return color;
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
