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
    this._subscribeToFetchReportsEvent();
    this.getReports();
}

  private _subscribeToFetchReportsEvent() {
    this._subscriptions.push(
      this._reportService.reportsFetchEvent$.subscribe(
        reports => {
          this.reports = reports;
        }
      )
    );
  }

  public openReport(report) {
    this._reportService.saveReportForReportViewer(report);
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
