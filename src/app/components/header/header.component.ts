import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private router: Router, private auth: AuthService) {}

  isLoginPage(): boolean {
    return this.router.url === '/login';
}

logOut() {
  this.auth.logout()
}

isregisterPage(): boolean {
  return this.router.url === '/register';
}
islandingPage(): boolean {
  return this.router.url === '';
}

isDashboardPage(): boolean {
  return this.router.url === '/dashboard';
}
}
