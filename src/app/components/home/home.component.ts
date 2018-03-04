import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

// FIREBASE
import { ReportService } from '../../services/report.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];
  reports: any;
  constructor(
    private _reportService: ReportService,
    private _userService: UserService
  ) {
   }

  ngOnInit() {
    this._subscribeToFetchReportEvent();
    this.getReports();
}

  private _subscribeToFetchReportEvent() {
    this._subscriptions.push(
      this._reportService.reportFetchEvent$.subscribe(
        reports => {
          this.reports = reports;
          console.log(reports);
        }
      )
    );
  }

  public getUserId() {
    return this._userService.getUserId();
  }

  public getReports() {
    this._reportService.getReports();
  }

  ngOnDestroy() {
    this._subscriptions.forEach( subscription => subscription.unsubscribe());
  }


}
