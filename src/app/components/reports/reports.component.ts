import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

declare const $: any;
import { ReportService } from '../../services/report.service';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, AfterViewInit, OnDestroy {
  _subscriptions: Subscription[] = [];
  _reports: any;
  reportsForDisplay: any = [];
  projectNames: any = [];
  constructor(
    private _reportService: ReportService,
    private _filterService: FilterService
  ) { }

  ngOnInit() {
    this._subscribeToFetchReportsEvent();
    this.getReports();
  }

  ngAfterViewInit() {
    $('.collapsible').collapsible();
  }

  private _subscribeToFetchReportsEvent() {
    this._subscriptions.push(
      this._reportService.reportsFetchEvent$.subscribe(
        reports => {
          this._reports = reports;
          this._reports.reverse();
          this.projectNames = this._filterService.getProjectNames(this._reports);
          this.reportsForDisplay = this._reports;
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

  public filterByDate(param) {
    this.reportsForDisplay = this._filterService.filterByDate(param, this._reports);
  }

  public filterByProject(projectName) {
    this.reportsForDisplay = this._filterService.filter(this._reports, null, projectName);
  }

  ngOnDestroy() {
    this._subscriptions.forEach( subscription => subscription.unsubscribe());
  }

}
