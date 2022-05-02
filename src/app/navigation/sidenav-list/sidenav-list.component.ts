import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit, OnDestroy {

  @Output() sideNavToggle: EventEmitter<void> = new EventEmitter();
  
  isAuth: boolean =false;
  authSubscription : Subscription;

 
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange.subscribe(authStatus =>{
      this.isAuth= authStatus
    });
  }

  onClose(){
    this.sideNavToggle.emit()
  }


  onLogout(){
    this.onClose();
    this.authService.logout();
 }


  ngOnDestroy(){
    this.authSubscription.unsubscribe();
  }
}
