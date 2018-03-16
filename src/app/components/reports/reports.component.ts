import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

declare const $: any;
import { ReportService } from '../../services/report.service';
import { FilterService } from '../../services/filter.service';
import { UserService } from '../../services/user.service';

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
  dateFilter: any;
  projectFilter: any;
  constructor(
    private _reportService: ReportService,
    private _filterService: FilterService,
    private _userService: UserService
  ) { }

  ngOnInit() {
    this._subscribeToUserLoginEvent();
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

  private _subscribeToUserLoginEvent() {
    this._subscriptions.push(
      this._userService.userLoggedInEvent$.subscribe(
        notification => {
          if (notification === true) {
            this.getReports();
          }
        }
      )
    );
  }

  public isCheckedDate(param) {
    return this.dateFilter === param;
  }

  public isCheckedProject(projectName) {
    return this.projectFilter === projectName;
  }

  public clearAllFilters() {
    this.dateFilter = null;
    this.projectFilter = null;
  }

  public openReport(report) {
    this._reportService.saveReportForReportViewer(report);
  }

  public getReports() {
    this._reportService.getReports();
  }

  public filterByDate(param) {
    this.dateFilter = param;
    this.reportsForDisplay = this._filterService.filterByDate(param, this.reportsForDisplay);
  }

  public filterByProject(projectName) {
    this.projectFilter = projectName;
    this.reportsForDisplay = this._filterService.filter(this._reports, null, projectName);
  }

  public showAllReports() {
    this.clearAllFilters();
    this.reportsForDisplay = this._reports;
  }

  ngOnDestroy() {
    this._subscriptions.forEach( subscription => subscription.unsubscribe());
  }

}
