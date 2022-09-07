import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inside-layout',
  templateUrl: './inside-layout.component.html',
  styleUrls: ['./inside-layout.component.scss'],
})
export class InsideLayoutComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  async signOut() {
    await this.auth.signOut();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
