import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Fitness-tracker';
  // sideNavOpen: boolean = false;

  logout(){
    console.log('logout')
  }

}
