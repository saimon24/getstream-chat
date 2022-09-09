import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  error: any = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  async register() {
    this.spinner.show();

    this.auth.register(this.email, this.password).subscribe(
      (res) => {
        this.spinner.hide();
        this.login();
      },
      (err) => {
        console.log('reg err: ', err);
        this.spinner.hide();
        this.error = err.error;
      }
    );
  }

  async login() {
    this.spinner.show();

    this.auth.login(this.email, this.password).subscribe(
      (res) => {
        this.spinner.hide();
        this.router.navigateByUrl('/app', { replaceUrl: true });
      },
      (err) => {
        console.log('login err: ', err);
        this.spinner.hide();
        this.error = err.error;
      }
    );
  }
}
