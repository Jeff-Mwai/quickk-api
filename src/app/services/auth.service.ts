import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


interface User {
  uid: string;
  email: string;
  // Other user properties...
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth, private router: Router) { }

  register(email: string, password: string, name: string, phoneNumber: string) {
    this.fireAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
  
        if (user) {
          // Update user profile with name
          user.updateProfile({
            displayName: name,
          })
          .then(() => {
            console.log('User registered with name:', user.displayName);
  
            // Alert or navigate as needed
            alert('User Registered Successfully!');
            this.router.navigate(['/login']);
          })
          .catch((error) => {
            console.error('Error updating user profile:', error);
          });
        } else {
          console.error('User is null after registration');
          alert('Error during registration');
          this.router.navigate(['/register']);
        }
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        alert(error.message);
        this.router.navigate(['/register']);
      });
  }

login(email: string, password: string) {
  this.fireAuth.signInWithEmailAndPassword(email, password).then( () => {
    localStorage.setItem('token', 'true')
    this.router.navigate(['/dashboard']);
  }, err => {
    alert(err.message);
    this.router.navigate(['/login']);

  })
}

logout() {
  this.fireAuth.signOut().then ( () => {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);

  }, err => {
    alert(err.message)
  })
}

getCurrentUser() {
  return this.fireAuth.currentUser;
}
}
