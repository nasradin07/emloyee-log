import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {
  _subscriptions: Subscription[] = [];
  reports: any;
  constructor(
    private _reportService: ReportService
  ) { }

  ngOnInit() {
    this._subscribeToFetchReportsEvent();
    this.getReports();
    console.log('Called on init');
  }

  private _subscribeToFetchReportsEvent() {
    this._subscriptions.push(
      this._reportService.reportsFetchEvent$.subscribe(
        reports => {
          this.reports = reports;
          this.reports.reverse();
        }
      )
    );
  }

  public openReport(report) {
    this._reportService.saveReportForReportViewer(report);
  }

  public getReports() {
    this._reportService.getReports();
  }

  ngOnDestroy() {
    this._subscriptions.forEach( subscription => subscription.unsubscribe());
  }

}
