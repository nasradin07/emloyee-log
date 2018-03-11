import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ReportService } from '../../services/report.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private _subscriptions: Subscription[] = [];
  reports: any;
  constructor(
    private _reportService: ReportService,
    private _userService: UserService
  ) { }

  ngOnInit() {

  }

}
