const d3 = require('d3');
const moment = require('moment');

function visualizer() {
  visualizer.prototype.draw = function() {
    var dimensions = arguments[0];
    var svgWidth = dimensions[0];
    var svgHeight = dimensions[1];

    // generate random points
    var data = d3.range(50).map(function(i) {
      return [Math.floor(Math.random() * svgWidth), Math.floor(Math.random() * svgHeight)];
    });

    var matrix = [
      [11975, 5871, 8916, 2868],
      [1951, 10048, 2060, 6171],
      [8010, 16145, 8090, 8045],
      [1013, 990, 940, 6907]
    ];

    var outerRadius = Math.floor(Math.min(svgWidth, svgHeight) / 3) - 40;
    var innerRadius = outerRadius - 30;
    var formatValue = d3.formatPrefix(",.0", 1e3);

    var chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending);

    var arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    var ribbon = d3.ribbon()
      .radius(innerRadius);

    var color = d3.scaleOrdinal()
      .domain(d3.range(4))
      .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

    var g = this.svg.append("g")
      .attr("transform", "translate(" + svgWidth / 2 + "," + ((svgHeight / 2) - 100) + ")")
      .datum(chord(matrix));

    var group = g.append("g")
      .attr("class", "groups")
      .selectAll("g")
      .data(function(chords) {
        return chords.groups;
      })
      .enter().append("g");

    group.append("path")
      .attr('class', 'outer')
      .style("fill", function(d) {
        return color(d.index);
      })
      .style("stroke", function(d) {
        return d3.rgb(color(d.index)).darker();
      })
      .attr("d", arc);

    g.append("g")
      .attr("class", "ribbons")
      .selectAll("path")
      .data(function(chords) {
        return chords;
      })
      .enter().append("path")
      .attr("class", "inner")
      .attr("d", ribbon)
      .style("fill", function(d) {
        return color(d.target.index);
      })
      .style("stroke", function(d) {
        return d3.rgb(color(d.target.index)).darker();
      });
  }

  visualizer.prototype.visualizeData = function() {
    var data = [];

    // get frequencyData
    var frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

    //copy byte frequencyData into frequencyData array
    this.analyser.getByteFrequencyData(frequencyData);

    this.svg.selectAll('path.inner')
      .data(frequencyData)
      .attr('transform', function(d, i) {;
        return "rotate(" + (d / 2.5 * i) + ")";
      })

    //clean up
    this.svg.exit().remove();
  }
}

module.exports = new visualizer();
