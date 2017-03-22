const d3 = require('d3');

module.exports = function Visualizer(svgContainer, svgwidth, svgheight) {

  let container = svgContainer;
  let width = svgwidth;
  let height = svgheight;
  let graph;
  let audioElement;

  let _audioCtx;
  let _analyser;
  let _audioSrc;


  // define drawing line function
  function lineFn() {

    return d3.svg.line()
      .x(function(d, i) {
        return x(d / 2);
      })
      .y(function(d) {
        return y(d);
      });

  }

  

  return {
    createSvg: createSvg,
    connect: connect,
    draw: draw,
    play: play,
    stop: stop
  }
}
