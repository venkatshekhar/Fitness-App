import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import * as fromApp from '../../app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoading$ : Observable<boolean>;
  private loadingSubs: Subscription;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<{ui: fromApp.State}>
  ) { }

  ngOnInit(): void {
    this.isLoading$= this.store.pipe(map(state => state.ui.isLoading));
    this.store.subscribe(data => console.log(data));
    // this.loadingSubs= this.uiService.loadingStateChanged.subscribe(isloading =>{
    //   this.isLoading= isloading;
    // })
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

  }

  onLogin() {
    console.log(this.loginForm.value);
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

  // ngOnDestroy(): void {
  //   if(this.loadingSubs)
  //     this.loadingSubs.unsubscribe();
  // }
}
