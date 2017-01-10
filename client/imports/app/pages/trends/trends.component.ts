import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';

import { WeatherSamps } from '../../../../../both/collections/weather-samps.collection';
import { WeatherSamp } from '../../../../../both/models/weather-samp.model';

import { TrendsFormComponent } from './trends-form.component';
 
import template from './trends.component.html';
 
@Component({
  selector: 'trends',
  template
})
export class TrendsComponent implements OnInit, OnDestroy {
	ws: Observable<WeatherSamp[]>;
	wsSub: Subscription;

  chart = {
    target: 'chart1',
    type: 'LineChart',
    columns: [
      ['datetime', 'Date'],
      ['number', 'Temperature']
    ],    
    rows: [
      [new Date("2015-12-14T09:35:00Z"), 6.2],
      [new Date("2015-12-14T09:30:00Z"), 6.1],
      [new Date("2015-12-14T09:25:00Z"), 6],
      [new Date("2015-12-14T09:20:00Z"), 5.9],
      [new Date("2015-12-14T09:15:00Z"), 5.8],
      [new Date("2015-12-14T09:10:00Z"), 5.7],
      [new Date("2015-12-14T09:05:00Z"), 5.5],
      [new Date("2015-12-14T09:00:00Z"), 5.3],
      [new Date("2015-12-14T08:55:00Z"), 5.2],
      [new Date("2015-12-14T08:50:00Z"), 5.2]
    ],
    options: {
      'title':'Temperature Trend',
      'width':800,
      'height':300
    }
  };
  /*
    devo definire le righe a runtime, direi per iniziare in inInit()
    rows: [
      ['Mushrooms', 3],
      ['Onions', 1],
      ['Olives', 1],
      ['Zucchini', 1],
      ['Pepperoni', 2]
    ]


  */
  ngOnInit() {
    this.ws = WeatherSamps.find({},{sort:{'Timestamp':-1},limit:10}).zone();
    this.wsSub = MeteorObservable.subscribe('weatherSamps').subscribe();

    drawChart(this.chart);
  }
  
  ngOnDestroy() {
    this.wsSub.unsubscribe();
  }

  timeSpanUpdate(newTimeSpan){
    this.ws = WeatherSamps.find(
      {
        'Timestamp': { 
          $gte: new Date (newTimeSpan.startDate),
          $lt: new Date (newTimeSpan.endDate)
        }
      },
      { sort: {'Timestamp':-1} }
    );
    this.chart.rows=[];
    this.ws.forEach(x => this.chart.rows.push([x[0].Timestamp, x[0].temp]));
    drawChart(this.chart);
  }
}
