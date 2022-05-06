import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  isLoading = false;
  private loadingSubs: Subscription;

  maxDate: Date= new Date();

  constructor(private authService: AuthService,
    private uiService: UIService) { }

  ngOnInit(): void {
    this.loadingSubs= this.uiService.loadingStateChanged.subscribe(isloading =>{
      this.isLoading= isloading;
    })
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18)
  }

  onSubmit(form: NgForm){
    console.log(form);
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    });
  }

  ngOnDestroy(): void {
    if(this.loadingSubs)
      this.loadingSubs.unsubscribe();
  }
}
