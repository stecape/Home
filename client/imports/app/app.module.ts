import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { MENU_DECLARATIONS } from './menu';
import { HOME_DECLARATIONS } from './pages/home';
import { CONTROLLER_DECLARATIONS } from './pages/controller';
import { WATERPLANT_DECLARATIONS } from './pages/waterplant';
import { DOCS_DECLARATIONS } from './pages/docs';
import { TRENDS_DECLARATIONS } from './pages/trends';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    ...MENU_DECLARATIONS,
    ...HOME_DECLARATIONS,
    ...CONTROLLER_DECLARATIONS,
    ...DOCS_DECLARATIONS,
    ...TRENDS_DECLARATIONS,
    ...WATERPLANT_DECLARATIONS,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
