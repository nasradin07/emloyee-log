import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  reports: any;
  constructor(
  ) { }

  ngOnInit() {

  }

}
