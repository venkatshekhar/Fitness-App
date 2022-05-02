import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });

  constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    
    this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['',[Validators.required]],
      });

  }

  onLogin() {
    console.log(this.loginForm.value);
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }
}
