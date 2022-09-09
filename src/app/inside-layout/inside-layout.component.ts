import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'stream-chat-angular';

@Component({
  selector: 'app-inside-layout',
  templateUrl: './inside-layout.component.html',
  styleUrls: ['./inside-layout.component.scss'],
})
export class InsideLayoutComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {}

  toggleLight() {
    const current = this.themeService.theme$.getValue();
    if (current === 'light') {
      this.themeService.theme$.next('dark');
    } else {
      this.themeService.theme$.next('light');
    }
  }

  async signOut() {
    await this.auth.signOut();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
