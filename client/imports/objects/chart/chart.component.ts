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

	margin = 40;
  width = 960 - this.margin*2;
  height = 500 - this.margin*2;

	ngOnChanges(){
  	
		var vis = d3.select("#visualization")
	    .attr("width", this.width + this.margin*2)
	    .attr("height", this.height + this.margin*2)
	  .append("g")
	    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");

		var x = d3.time.scale()
			.range([0, this.width])//[this.margin, this.width - this.margin])
			.domain(d3.extent(this.data, function(d) { return d.Timestamp })); 

		var xAxis = d3.svg.axis()
		  .scale(x)         
		  .orient('bottom')
		  .ticks(this.data.length);

		var y = d3.scale.linear()
			.range([0, this.height]) 
			.domain(d3.extent(this.data, function(d) { return d.temp }).sort(d3.descending));

		var yAxis = d3.svg.axis()
		  .scale(y)        
		  .orient('left')
		  .ticks(4);  

		vis.append('svg:g')            
      .attr("transform", "translate(0," + this.height + ")")
		  .attr('class', 'x axis')
		  .call(xAxis);    
		 
		vis.append('svg:g')
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Temperature (°C)");

		var lineGen = d3.svg.line()
		  .x(function(d) {
		    return x(d.Timestamp);
		  })
		  .y(function(d) {
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
