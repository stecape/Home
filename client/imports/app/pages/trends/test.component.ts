import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';

import { TestValues } from '../../../../../both/collections/test-values.collection';
import { WeatherSamps } from '../../../../../both/collections/weather-samps.collection';
import { WeatherSamp } from '../../../../../both/models/weather-samp.model';

import { TrendsFormComponent } from './trends-form.component';
 
import template from './trends.component.html';
 
@Component({
  selector: 'trends',
  template
})
export class TrendsComponent implements OnInit, OnDestroy {
  wsSub: Subscription;
  vSub: Subscription;
  v: Observable<any>;
  subscriptions:Subscription[] = [];
  chart = {
    target: 'chart',
    type: 'LineChart',
    columns: [
      ['datetime', 'Date'],
      ['number', 'Temp']
    ],    
    rows: [],
    options: {
      'title':'Values Trend',
      'width':800,
      'height':300
    }
  };
  ngOnInit() {
    this.wsSub = MeteorObservable.subscribe('weatherSamps').subscribe(); 
    var ts={
      startDate: new Date((new Date("2015-12-14T09:40Z")).getTime() - (50 * 60 * 1000)),
      endDate: new Date ("2015-12-14T09:40Z")
    };
    this.timeSpanUpdate(ts);
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.wsSub.unsubscribe();
  }

  timeSpanUpdate(newTimeSpan){
    this.v = WeatherSamps.find(
      {
        'Timestamp': { 
          $gte: new Date (newTimeSpan.startDate),
          $lt: new Date (newTimeSpan.endDate)
        }
      },
      { sort: {'Timestamp':-1} }
    );
    this.subscriptions.push(this.v
      .debounce(() => Observable.interval(50))
      .subscribe(x => {console.log("timeSpanUpdate!!!"); this.Draw(x, x.length)})
    );
  }

  Draw(x, l){                                             //fai il subscribe alla query, in questo modo ogni volta che emette un valore ti viene spedito
    console.log(x);
    this.chart.rows=[];                                               //la query restituisce un array di oggetti. In questo caso gli oggetti value che voglio rappresentare sul chart. Svuoto quindi l'array delle righe per poterlo riempire con il nuovo risultato della query che mi arriva in caso di cambio del DB
    x.map(y => {                                                      //x è un array di oggetti. Per ogni oggetto dell'array (y) eseguo le seguenti operazioni:
      this.chart.rows.unshift([y.Timestamp,y.temp]);                      //lo inserisco in testa all'array delle rows [[v(t-4)],[v(t-3)],[v(t-2)],[v(t-1)]] <- v(t)
      if(this.chart.rows.length>l) this.chart.rows.pop();            //se l'array ha piu' di 10 elementi ne tolgo uno, il piu' vecchio [v(t-11)]
    });
    drawChart(this.chart)                                           //disegno il grafico.
  }
}
