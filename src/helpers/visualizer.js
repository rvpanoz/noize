const d3 = require('d3');
const moment = require('moment');

function visualizer() {
  visualizer.prototype.draw = function() {
    var dimensions = arguments[0]
    var svgWidth = dimensions[0];
    var svgHeight = dimensions[1];

    this.svg.append("g")
      .attr("class", "circle-group")
      .attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")");
  }

  visualizer.prototype.visualizeData = function() {

    // get frequencyData
    var frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

    //copy byte frequencyData into frequencyData array
    this.analyser.getByteFrequencyData(frequencyData);

    //colors
    var colorPallete = d3.scaleOrdinal(d3.schemeCategory10);

    
    //clean up
    this.svg.exit().remove();
  }
}

module.exports = new visualizer();
