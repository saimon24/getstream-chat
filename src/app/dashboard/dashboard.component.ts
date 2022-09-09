import { Component, OnInit } from '@angular/core';
import data from '../../assets/classes.json';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  classes = data.classes;

  constructor() {}

  ngOnInit(): void {}
}
