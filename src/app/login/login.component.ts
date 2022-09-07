import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  async register() {
    this.auth.register(this.email, this.password).subscribe((res) => {
      this.login();
    });
  }

  async login() {
    this.auth.login(this.email, this.password).subscribe((res) => {
      this.router.navigateByUrl('/app', { replaceUrl: true });
    });
  }
}
