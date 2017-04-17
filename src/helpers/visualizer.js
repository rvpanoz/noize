const d3 = require('d3');
const moment = require('moment');

function visualizer() {
  visualizer.prototype.draw = function() {
    var dimensions = arguments[0]
    var svgWidth = dimensions[0];
    var svgHeight = dimensions[1];

    // get frequencyData
    var frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

    this.svg.append("g")
      .attr("class", "circle-group")
      .attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")");

    this.svg.selectAll('g')
      .selectAll('circle')
      .data(frequencyData)
      .enter()
      .append('circle')
      .attr('class', 'circle-item')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 5)
      .style("fill", "none")
      .style("stroke", 1);
  }

  visualizer.prototype.visualizeData = function() {

    // get frequencyData
    var frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

    //copy byte frequencyData into frequencyData array
    this.analyser.getByteFrequencyData(frequencyData);

    //colors
    var colorPallete = d3.scaleOrdinal(d3.schemeCategory10);

    this.svg.selectAll('circle')
    .data(frequencyData)
    // .attr('cy', function(d, i) {
    //   return (d * i) / 2;
    // })
    .attr('cx', function(d, i) {
      return d;
    })

    .style("fill", function(d, i) {
      return colorPallete(Math.floor(Math.random() * d / i))
    })
    .transition()
      .duration(2000)
      .ease(Math.sqrt)

    //clean up
    this.svg.exit().remove();
  }
}

module.exports = new visualizer();
