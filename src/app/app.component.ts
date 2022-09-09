import { Component } from '@angular/core';
import { StreamService } from './services/stream.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'chatApp';
  constructor(private streamService: StreamService) {}
}
