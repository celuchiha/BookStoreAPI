import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SideNavComponent } from './components/side-nav.component';
import * as generatedConfig from './app-components.config';
import { HomeComponent } from './components/home.component';

// Component declarations
const declarations: any[] = [AppComponent, SideNavComponent, HomeComponent]; // add any manual components here
declarations.push(...generatedConfig.declarations);

// Routes
const routes: {path:string, component: any}[] = []; 
routes.push({path: '', component: HomeComponent}); // home
// routes.push({path: 'my-path', component: MyComponent}); // add any manual routes here
routes.push(...generatedConfig.routes);

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule, 
    RouterModule.forRoot(routes)
  ],
  declarations: declarations,
  bootstrap: [AppComponent]
})
export class AppModule { }