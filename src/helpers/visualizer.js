const d3 = require('d3');
const moment = require('moment');

function visualizer() {
	visualizer.prototype.draw = function (container, width, height) {

		var radius = Math.min(width, height) / 2;
		var tau = 2 * Math.PI; //full circle
		/**
		 * [createSvg helper]
		 * @param  {[type]} parent [description]
		 * @param  {[type]} width  [description]
		 * @param  {[type]} height [description]
		 * @return [type]          [description]
		 */
		function createSvg(parent, width, height) {
			return d3.select(parent)
				.append('svg')
				.attr('height', height)
				.attr('width', width);
		}

		//create
		var frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

		//draw the svg element container
		this.svg = createSvg(container, width, height);

		//append center circle
		this.svg
			.append("circle")
			.attr("r", 45)
			.attr("cx", width / 2)
			.attr("cy", height / 2)
			.attr("class", "center")
			.attr('fill', 'none')
			.attr('stroke', '#ccc')
			.attr('stroke-width', 1);

		//append group element and position it at the center
		this.svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

		var arc = d3.arc()
			.startAngle(function (d) {
				return 0;
			})
			.endAngle(function (d) {
				return (2 * Math.PI) - Math.SQRT2;
			})
			.innerRadius(function (d) {
				return 90;
			})
			.outerRadius(function (d) {
				return 180;
			});

		this.svg.select('g')
			.selectAll('path')
			.data(frequencyData)
			.enter()
			.append('path')
			.attr('d', arc)
			.style('stroke', 'steelblue')
			.style('stroke-width', 1)
			.attr('fill', 'none')
			.transition()
			.duration(1500)
			.delay(1500)
			.ease(Math.sqrt)
			.attr('transform', function (d, i) {
				return "rotate(" + i * tau + ")";
			})
	}

	visualizer.prototype.visualize = function (elapsed) {
		var data = [];

		// get frequencyData
		var frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

		//color
		var colors = d3.scaleOrdinal(d3.schemeCategory10);

		//copy byte frequencyData into frequencyData array
		this.analyser.getByteFrequencyData(frequencyData);

		var arc = d3.arc()
			.startAngle(function (d, i) {
				return 0;
			})
			.endAngle(function (d, i) {
				return (2 * Math.PI);
			})
			.innerRadius(function (d) {
				return d / 2;
			})
			.outerRadius(function (d) {
				return d;
			});

		this.svg.select('g')
			.selectAll('path')
			.data(frequencyData)
			.attr('d', arc)
			.attr('fill', function(d, i){
				return colors(function(d, i) {
					return d * i + Math.floor(Math.random() * 100);
				});
			});

		//clean up
		this.svg.exit().remove();
	}
}

module.exports = new visualizer();
