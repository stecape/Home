import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';

import { WeatherSamps } from '../../../../../both/collections/weather-samps.collection';
import { WeatherSamp } from '../../../../../both/models/weather-samp.model';

import { TrendsFormComponent } from './trends-form.component';
import { TrendsTableComponent } from './trends-table.component';
import { ChartComponent } from '../../../objects/chart/chart.component';
 
import template from './trends.component.html';
import style from './trends.component.scss';
 
@Component({

  selector: 'trends',
  template,
  styles:  [style]
})

export class TrendsComponent implements OnInit, OnDestroy {
	
  /*  Sottoscrizione alla collection weatherSamps  */
  wsSub: Subscription;

  /*  Observable restituito dalla query  */
  v: Observable<WeatherSamp[]>;
  
  /*  Array delle subscription a v. Verrà iterato per disiscrivere tutti gli observer da v  */
  subscriptions:Subscription[] = [];
  
  data = [];
  /*  Oggetto di parametrizzazione del grafico. #todo: portare fuori  */
  // chart = {
  //   target: 'chart',
  //   type: 'LineChart',
  //   columns: [
  //     ['datetime', 'Date'],
  //     ['number', 'Temp']
  //   ],    
  //   rows: [],
  //   options: {
  //     'title':'Values Trend',
  //     'width':800,
  //     'height':300
  //   }
  // };
  
  ngOnInit() {
    
    /*  subscribe alla collection weatherSamps in minimongo  */
    this.wsSub = MeteorObservable.subscribe('weatherSamps').subscribe(); 
    
    /*  chiamata alla funzione di definizioe dell'intervallo temporale che voglio visualizzare nel
    momento in cui carica la pagina  */
    this.timeSpanUpdate(
      {
      startDate: new Date((new Date("2015-12-14T09:40Z")).getTime() - (50 * 60 * 1000)),
      endDate: new Date ("2015-12-14T09:40Z")
      }
    );

  }
  
  ngOnDestroy() {

    /*  cancellazione delle subscription all'Observable v  */
    this.subscriptions.forEach(s => s.unsubscribe());
    
    /*  cancellazione della subscription alla collection weatherSamps  */
    this.wsSub.unsubscribe();
  
  }

  /*  gli passi un timespan, lui fa la query per avere i dati #todo: verificare che non sia meglio
  andare a definire i parametri da altre parti https://www.discovermeteor.com/blog/query-constructors/  */
  timeSpanUpdate(newTimeSpan){
  
    this.v = WeatherSamps.find(
      {
        'Timestamp': { 
          $gte: new Date (newTimeSpan.startDate),  //$gte: greather then or equal
          $lt: new Date (newTimeSpan.endDate)      //$lt: less then
        }
      },
      { sort: {'Timestamp':-1} }
    );
  
    /*le subscription vanno messe tutte in un array, così almeno non ne perdi nessuna in giro.
    In questo modo quando esci dalla pagina sull'onDestroy iteri l'array e fai l'unsubscribe di tutte.  */
    this.subscriptions.push(                
      this.v
        /*  debounce è fondamentale per avere tutti i risultati della query in una volta.
        Se non lo metti, su un array di 10 elementi, ti arriva prima un array con 1 elemento, 
        poi uno con 2, poi uno con 3... ecc fino a 10. Tu quindi devi reagire 10 volte.
        Col debounce invece aspetta 50 ms che arrivi un'altro dato. se non arriva niente emette,
        sennò aspetta altri 50ms.  */
        .debounce(() => Observable.interval(50))          
        /*  subscribe all'Observable. Se v emette un valore reagisco passandolo a Draw, la funzione che disegna il grafico.  */
        .subscribe(x => this.Draw(x, x.length))
    );
  
  }

  /*  funzione che disegna il grafico dato un array di oggetti  */
  Draw(x, l){
    /*  la query restituisce un array di oggetti. In questo caso gli oggetti weatherSamps che voglio rappresentare sul chart. 
    Svuoto quindi l'array delle righe per poterlo riempire con il nuovo risultato della query
    che mi arriva in caso di cambio del DB  */
    this.data=[];
  
    /*  x è un array di oggetti. Per ogni oggetto dell'array (y) lo inserisco in testa all'array delle rows 
    [[v(t-4)],[v(t-3)],[v(t-2)],[v(t-1)]] <- v(t)
    se l'array ha piu' di l elementi ne tolgo uno, il piu' vecchio [v(t-11)]
    faccio questo per supportare i grafici live, dove stabilisci una finestra temporale larga l
    e il grafico presenta a video solo gli ultimi l elementi, realizzando un effetto di scroll temporale  */
    x.map(y => {                                                      
      this.data.unshift({ Timestamp: y.Timestamp, temp:y.temp });                      
      if(this.data.length>l) this.data.pop();            
    });
  
    /*  disegno il grafico.  */
    //drawChart(this.chart)
  
  }

}