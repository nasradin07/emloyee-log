import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.css']
})
export class ViewReportComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];
  report: any = null;
  constructor(
    private _reportService: ReportService
  ) { }

  ngOnInit() {
    this._subscribeToReportFetchEvent();
    this.getReport();
  }

  public getReport() {
    this._reportService.getReport();
  }

  private _subscribeToReportFetchEvent() {
    this._subscriptions.push(
      this._reportService.reportFetchEvent$.subscribe(
        report => this.report = report
      )
    );
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
