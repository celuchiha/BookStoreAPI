import { Component } from '@angular/core';

@Component({
  selector: 'home',  
  template: `
    <div class="jumbotron text-center">
      <h1>Yellicode Bookstore tutorial</h1>
      <p>{{ message }}</p>
    </div>
  `
})
export class HomeComponent {
  message = 'Welcome to the Bookstore tutorial app. If all code was generated successfully, you can use the side navigation to manage the bookstore data.';
}