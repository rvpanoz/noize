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
      _.bindAll(this, 'renderVisual', 'onStopAnimation', 'updateProgress');

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

    onDomRefresh() {
      //audio duration
      this.duration = this.audioElement[0].duration;
      console.log(this.duration);
      //set finish time
      var finishTimeMilli = this.duration * 1000;
      var timeFinish = moment.duration(finishTimeMilli);
      this.$('.time-finish').text(moment.utc(timeFinish.asMilliseconds()).format("HH:mm:ss"));

      //add events
      this.audioElement[0].addEventListener("progress", this.updateProgress, arguments);
      this.audioElement[0].addEventListener("canplay", _.bind(function () {}, this));

      //draw the graph
      this.draw();
    },
    onStopAnimation(e) {
      /**
       * Cancels an animation frame request
       * previously scheduled through a call to
       * window.requestAnimationFrame().
       * @type {Number} deprecated
       */
      // window.cancelAnimationFrame(this.animation);

      //use d3.timer tool :)
      this.timer.stop();
      return false;
    },
    draw() {
      //constants
      var w = 960;
      var h = 500;
      var x = w/2;
      var y = h/2;
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
        .attr("r", 10)
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
              d3.select(this).append("circle").attr("class", "orbit")
                .attr("r", d.R + (0.5 * d.R))
              d3.select(this).append("circle")
                .attr("r", d.r)
                .attr("cx", d.R)
                .attr("cy", d.R).attr("class", "planet");
      });
    },
    /**
     * deprecated
     */
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
        var r = d.R * 100;
        return "rotate(" + r + ")";
      };

      this.planetarium.selectAll(".planet-cluster")
        .attr("transform", transform);

      this.planetarium.exit().remove();
    },

    play: function (e) {
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
          speed = -d.phi0 + (delta / 3600);
          return "rotate(" + d.phi0 * speed + ")";
      });
    });

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
      var progress = this.$('progress');
      var timeContainer = this.$('.time-now');
      var value = 0, timeValue;
      var currentTime = this.audioElement[0].currentTime;
      var duration = this.audioElement[0].duration;
      if (currentTime > 0) {
        value = Math.floor(100 * currentTime / duration);
        timeValue = Math.floor(currentTime);
      }

      if(progress.length) {
        progress.css({
          width: value + "%",
          'background-color': '#ff77cc'
        });
        var currenTimeMilli = currentTime * 1000;
        var timeNow = moment.duration(currenTimeMilli);

        this.$('.time-now').text(moment.utc(timeNow.asMilliseconds()).format("HH:mm:ss"));
      }
    },

    seek: function (e) {
      e.preventDefault();
      this.audioElement.currentTime += 30;
    },

    getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
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
