import { Component, Input, ViewEncapsulation, OnChanges } from '@angular/core';

import template from './chart.component.html';
import style from './chart.component.scss';

@Component({
  selector: 'chart',
  encapsulation: ViewEncapsulation.None,
  template,
  styles:  [style]
})
export class ChartComponent implements OnChanges {

	@Input() data: Object[];

	ngOnChanges(){
  	
  	/*var data=[
			{ "Timestamp" : "2015-12-14T09:35:00Z", "temp" : 6.2 },
			{ "Timestamp" : "2015-12-14T09:30:00Z", "temp" : 6.1 },
			{ "Timestamp" : "2015-12-14T09:25:00Z", "temp" : 6 },
			{ "Timestamp" : "2015-12-14T09:20:00Z", "temp" : 5.9 },
			{ "Timestamp" : "2015-12-14T09:15:00Z", "temp" : 5.8 },
			{ "Timestamp" : "2015-12-14T09:10:00Z", "temp" : 5.7 },
			{ "Timestamp" : "2015-12-14T09:05:00Z", "temp" : 5.5 },
			{ "Timestamp" : "2015-12-14T09:00:00Z", "temp" : 5.3 },
			{ "Timestamp" : "2015-12-14T08:55:00Z", "temp" : 5.2 },
			{ "Timestamp" : "2015-12-14T08:50:00Z", "temp" : 5.2 }
		];*/

		var vis = d3.select("#visualization");

		var WIDTH = 1000;
		var HEIGHT = 500;

  	var MARGINS = {
    	top: 20,
    	right: 20,
    	bottom: 25,
    	left: 50
  	};

		var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%SZ");

		var x = d3.time.scale()
			.range([MARGINS.left, WIDTH - MARGINS.right])
			.domain(d3.extent(this.data, function(d) { return d.Timestamp })); // console.log("Timestamp: ", d.Timestamp, " and format.parse(\"2015-12-14T09:05:00Z\"): ", format.parse("2015-12-14T09:05:00Z")); 

		var xAxis = d3.svg.axis()
		  .scale(x)         
		  .orient('bottom')
		  .ticks(this.data.length);

		var y = d3.scale.linear()
			.range([MARGINS.top, HEIGHT - MARGINS.bottom]) 
			.domain(d3.extent(this.data, function(d) { return d.temp }).sort(d3.descending));

		var yAxis = d3.svg.axis()
		  .scale(y)        
		  .orient('left')
		  .ticks(4);  

		vis.append('svg:g')            
		  .attr("transform", "translate(0, " + (HEIGHT - MARGINS.bottom) + ")")
		  .attr('class', 'x axis')
		  .call(xAxis);    
		 
		vis.append('svg:g')            
		  .attr('class', 'y axis')
		  .attr("transform", "translate(" + (MARGINS.left) + ",0)")
		  .call(yAxis);   

		var lineGen = d3.svg.line()
		  .x(function(d) {
		    return x(d.Timestamp); //format.parse(
		  })
		  .y(function(d) {
		  	console.log(d);
		    return y(d.temp);
		  })
		  .interpolate("basis");

		vis.append('svg:path')
		  .attr('d', lineGen(this.data))
		  .attr('stroke', 'green')
		  .attr('stroke-width', 2)
		  .attr('fill', 'none');
  }
}
