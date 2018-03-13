import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AdminService } from './services/admin.service';
import { NotificationService } from '../../services/notification.service';
import { ReportService } from '../../services/report.service';
import { FilterService } from '../../services/filter.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];
  requests;
  _reports;
  reportsForDisplay: any;
  filteredReports: any = {};
  projects: any = [];
  employeeNames: any = [];
  constructor(
    private _adminService: AdminService,
    private _notificationService: NotificationService,
    private _reportService: ReportService,
    private _filterService: FilterService,
    private _changeDetectorRef: ChangeDetectorRef
  ) { }


  ngOnInit() {
    this._subscribeToRequestFetchEvent();
    this._subscribeToReportsFetchEvent();
    this.getData();
  }

  public getData() {
    this.getReports();
    this.getRequests();
  }

  public getRequests() {
    this._adminService.getRequests();
  }

  public getReports() {
    this._adminService.getReports();
  }

  _subscribeToRequestFetchEvent() {
    this._subscriptions.push(
      this._adminService.requestsFetchEvent$.subscribe(
        requests => {
          this.requests = requests;
        },
        err => console.log(err)
      )
    );
  }

  _subscribeToReportsFetchEvent() {
    this._subscriptions.push(
      this._adminService.reportsFetchEvent.subscribe(
        reports => {
          this._reports = reports;
          this.filteredReports = this._filterService.filterByProjectAndEmployee(this._reports);
          this.reportsForDisplay = this._reports;
          Object.keys(this.filteredReports.byProject).forEach(projectName => this.projects.push(projectName));
          Object.keys(this.filteredReports.byName).forEach( employeeName => this.employeeNames.push(employeeName));
        },
        err => console.log(err)
      )
    );
  }


  public openReport(report) {
    this._reportService.saveReportForReportViewer(report);
  }

  filterByDate(param) {
    this.reportsForDisplay = this._filterService.filterByDate(param, this.reportsForDisplay);
  }

  filterByProject(projectName) {
    this.reportsForDisplay = this.filteredReports.byProject[projectName];
  }

  filterByEmployee(employeeName) {
    this.reportsForDisplay = this.filteredReports.byName[employeeName];
  }

  ngOnDestroy() {
    this._subscriptions.forEach( subscription => subscription.unsubscribe());
  }

}
