import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent  implements OnInit{

registerForm: FormGroup | any;

constructor(
  private _formBuilder: FormBuilder,
  private _authService: AuthService
){}

  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],

    })
  }

  register() {
    let email = this.registerForm.value.email
    let password = this.registerForm.value.password
    if(email === '') {
      alert('Enter Email address')
    }
    if(password === '') {
      alert('Enter Password')
    }
    this._authService.register(email, password)
  }

}
