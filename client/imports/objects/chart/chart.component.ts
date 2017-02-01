import { Meteor } from 'meteor/meteor';
import { Component, Input, ViewEncapsulation, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import template from './chart.component.html';
import style from './chart.component.scss';


@Component({
  selector: 'chart',
  encapsulation: ViewEncapsulation.None,	/*fondamentale per far si che gli stili del component vengano applicati agli oggetti d3*/
  template,
  styles:  [style]
})
export class ChartComponent implements OnChanges {


	/*Interfaccia col component padre: punto di ingresso dei dati. E' un array di oggetti {Timestamp: date, temp: number} */
	@Input() data: Object[];

	margin: number;											/*margine del grafico*/
	width: number;											/*larghezza dell'svg*/
	height: number;											/*altezza dell'svg*/
	vis;																/*riferimento all'svg stesso*/
  rsz: Observable<any>;								/*Observable all'evento resize dello schermo*/
  subscriptions:Subscription[] = [];	/*Array delle subscription a v. Verrà iterato per disiscrivere tutti gli observer da v*/

  /*questa funzione si occupa di ridisegnare il grafico 
  in seguito ad eventi come il cambio dei dati o il resize dello schermo*/
  reDraw() {

  	/*definizione delle dimensioni del grafico vero e proprio, al netto dei margini*/
  	this.width = parseInt(d3.select("#visualization").style("width")) - this.margin*2;
		this.height = parseInt(d3.select("#visualization").style("height")) - this.margin*2;

		/*questa è una funzione che si occupa di applicare il fattore di scala. 
		In pratica dato un range pari alla larghezza (o altezza) del grafico,
		gli viene assegnato un dominio pari alla massima escursione del set di dati.
		Quindi se il mio grafico è alto 100px e il mio dominio è 0-1000, chiamando
		y(200) mi verrà restituito 20px*/
    var x = d3.time.scale()
			.range([0, this.width])
			.domain(d3.extent(this.data, function(d) { return d.Timestamp })); 

		var y = d3.scale.linear()
			.range([0, this.height]) 
			.domain(d3.extent(this.data, function(d) { return d.temp }).sort(d3.descending));

		/*definizione dell'asse x del grafico. gli viene assegnato il fattore di scala appena definito,
		la posizione e l'orientamento nell'svg, il numero di divisioni.*/
		var xAxis = d3.svg.axis()
		  .scale(x)         
		  .orient('bottom')
		  .ticks(this.data.length);

		var yAxis = d3.svg.axis()
		  .scale(y)        
		  .orient('left')
		  .ticks(4);  

		/*definizione della funzione(?) che disegna la linea,
		definizione di come interpretare i punti:
		dato un oggetto d:
		x=scalatura di (d.Timestamp)
		y=scalatura di (d.temp)
		interpola i punti con un effetto morbido e non con una linea spezzata
		*/
		var lineGen = d3.svg.line()
		  .x(function(d) {
		    return x(d.Timestamp);
		  })
		  .y(function(d) {
		    return y(d.temp);
		  })
		  .interpolate("basis");

		d3.select(".text")
      .text("Temperature (°C)");
		/*definita la modalità di rappresentazione della linea, vai a cercare tutte le linee dell'svg
		e ridefiniscine l'attributo d(?). Questa operazione porta a ridisegnare la linea.*/
	  d3.select(".line")
	  	.attr('d', lineGen(this.data));

	  /*quindi riscala e ridisegna gli assi alla luce del nuovo set di dati*/
	  d3.select(".x.axis")
	  	.call(xAxis)
    	.attr("transform", "translate(0," + this.height + ")");
	  
	  d3.select(".y.axis")
	  	.call(yAxis);
  }





	ngOnInit(){

		/*al caricamento del componente viene creato un Observable per l'evento Resize della finestra*/
		this.rsz = Observable.fromEvent(window, 'resize');
		/*il subscribe all'observer viene inserito nell'array delle subscription, 
		in modo da collezionarle tutte assieme e poi quando il componente viene distrutto
		averli tutti assieme per rimuoverli*/
  	this.subscriptions.push( 
  		this.rsz
  			/*Il debounce è stato inserito per evitare che l'observer emetta eventi ogni pixel di resize*/
	  		.debounceTime(500)
	  	  .subscribe((event) => {
	      	this.reDraw();
	    	})
    );


		/*dopo l'observer viene dimensionato l'svg, che già di suo occupa il 100% del viewport in larghezza
		 e il 50% in altezza (vedi chart.component.scss) */
  	this.margin = 40;
  	this.width = parseInt(d3.select("#visualization").style("width")) - this.margin*2;
		this.height = parseInt(d3.select("#visualization").style("height")) - this.margin*2;

		/*definizione dell'svg: set di altezza e larghezza
		e inserimento contenitore del grafico vero e proprio, che viene centrato nell'svg
		non so perchè viene ridefinita la dimensione dell'svg, pero' se non lo fai nn funziona*/
		this.vis = d3.select("#visualization")
		    .attr("width", this.width + this.margin*2)
		    .attr("height", this.height + this.margin*2)
	  .append("g")
	    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");

	  /*inserimento e traslazione dell'asse x:
	  viene traslato di this.height per andarsi a posizionare sul bottom del contenitore del grafico.
	  Le traslazioni si misurano in senso crescente verso il basso e verso sinistra.*/
		this.vis.append('svg:g')            
      .attr("transform", "translate(0," + this.height + ")")
		  .attr('class', 'x axis');
		
		/*inserimento dell'asse y:
	  non viene traslato perchè si trova già al posto giusto.*/
		this.vis.append('svg:g')
      .attr("class", "y axis")

    /*applicazione del testo della categoria sull'asse y. Viene ruotato, posizionato e dimensionato.
    Non viene scritto. Verrà scritto all'arrivo dei dati*/
    .append("text")
    	.attr("class", "text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")

    /*applicazione della linea del grafico. in questo momento è solo un path senza punti,
    quando arrivano i dati poi viene popolato*/
		this.vis.append('svg:path')
		  .attr('stroke', 'green')
		  .attr('stroke-width', 2)
		  .attr('fill', 'none')
		  .attr('class', 'line');
  }




  ngOnChanges(){
  	/*quando data[] cambia, viene ridisegnato il grafico*/
  	this.reDraw();
  }



	ngOnDestroy() {

    /*  cancellazione delle subscription all'Observable rsz  */
    this.subscriptions.forEach(s => s.unsubscribe());

  }
}


