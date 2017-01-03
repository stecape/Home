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
  
  ngOnInit() {
    this.ws = WeatherSamps.find({},{sort:{'Timestamp':-1},limit:10}).zone();
    this.wsSub = MeteorObservable.subscribe('weatherSamps').subscribe();
  }
  
  ngOnDestroy() {
    this.wsSub.unsubscribe();
  }

  timeSpanUpdate(newTimeSpan){
    this.ws = WeatherSamps.find({ 'Timestamp': { $gte: newTimeSpan.startDate, $lt: newTimeSpan.endDate }}, { sort:{'Timestamp':-1} }).zone();
  }
}
