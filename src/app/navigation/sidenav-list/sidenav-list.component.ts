import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import * as fromRoot from '../../app.reducer';
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit  {

  @Output() sideNavToggle: EventEmitter<void> = new EventEmitter();
  
  isAuth$: Observable<boolean>;
  authSubscription : Subscription;

 
  constructor(private authService: AuthService, private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
    this.isAuth$= this.store.select(fromRoot.getIsAuth);
  }

  onClose(){
    this.sideNavToggle.emit()
  }


  onLogout(){
    this.onClose();
    this.authService.logout();
 }


}
