import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import * as fromRoot from '../../app.reducer';
import { Store } from "@ngrx/store";
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuth$: Observable<boolean>;

  @Output() sideNavToggle: EventEmitter<void> = new EventEmitter();

  constructor(private authService: AuthService, private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
    this.isAuth$= this.store.select(fromRoot.getIsAuth);
  }

  onToggleSideNav(){
    this.sideNavToggle.emit();
  }

  onLogout(){
    this.authService.logout();
 }

  
}
