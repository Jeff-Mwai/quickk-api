import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  implements OnInit{

loginForm: FormGroup | any;

constructor(
  private _formBuilder: FormBuilder,
  private _authService: AuthService
){}

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],

    })
  }

  login() {
    let email = this.loginForm.value.email
    let password = this.loginForm.value.password
    if(email === '') {
      alert('Enter Email address')
    }
    if(password === '') {
      alert('Enter Password')
    }
    this._authService.login(email, password)
  }

  getCurrentUser() {
    this._authService.getCurrentUser().then(user => {
      if (user) {
        console.log('Current user:', user);
      } else {
        console.log('User not logged in.');
      }
    });
  }


}
