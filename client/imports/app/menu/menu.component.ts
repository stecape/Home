import { Component, OnInit, OnDestroy } from '@angular/core';

import { MenuItem } from './menu-item.model';											
import { MENUITEMS } from './mocks';
 
import template from './menu.component.html';
 
@Component({
  selector: 'menu',
  template
})
export class MenuComponent implements OnInit {

  menuItems: MenuItem[];																	

  ngOnInit() {
  	this.menuItems= MENUITEMS;  	
  }																													


}
