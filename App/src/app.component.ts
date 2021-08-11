import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  styles: [``],
  template: `<side-nav></side-nav>     
  <main role="main" class="col-sm-9 ml-sm-auto col-md-10 pt-3">      
      <router-outlet></router-outlet>
  </main>`
})
export class AppComponent {  
}

