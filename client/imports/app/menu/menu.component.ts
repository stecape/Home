import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MenuItem } from './menu-item-model';											//importo la classe MenuItems
import { MENUITEMS } from './mocks';
 
import template from './menu.component.html';
 
@Component({
  selector: 'menu',
  template
})
export class MenuComponent implements OnInit {

	menuItems: MenuItem[];																		//creo un'istanza di menuItems[] che quindi al momento risulta vuoto.
																														//E' un array di oggetti MenuItem, e conterrà gli oggetti MenuItem che 
  constructor() { }																					//definiscono le proprietà delle voci del Menu di navigazione.

  ngOnInit() {
  	this.menuItems= MENUITEMS;															//sull'inizializzazione del component inizializzo l'oggetto menuItems
  }																													//andando a fare riferimento a quanto specificato nel file mocks.ts

}
