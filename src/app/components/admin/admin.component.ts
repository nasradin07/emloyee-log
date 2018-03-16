import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

declare const $: any;
import { AdminService } from './services/admin.service';
import { NotificationService } from '../../services/notification.service';
import { ReportService } from '../../services/report.service';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit , OnDestroy {
  private _subscriptions: Subscription[] = [];
  requests;
  _reports;
  reportsForDisplay: any;
  projects: any = [];
  employeeNames: any = [];
  dateFilter: any  = null;
  employeeFilter: any = null;
  projectFilter: any = null;
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

  ngAfterViewInit() {
    $('.collapsible').collapsible();
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
          this.reportsForDisplay = this._reports;
          const projectAndUserNames = this._filterService.getProjectAndUserNames(this._reports);
          Object.keys(projectAndUserNames.projectName).forEach(projectName => this.projects.push(projectName));
          Object.keys(projectAndUserNames.userName).forEach( employeeName => this.employeeNames.push(employeeName));
          this._changeDetectorRef.detectChanges();
        },
        err => console.log(err)
      )
    );
  }


  public openReport(report) {
    this._reportService.saveReportForReportViewer(report);
  }

  public isCheckedDate(param) {
    return param === this.dateFilter;
  }

  public isCheckedProject(projectName) {
    return projectName === this.projectFilter;
  }

  public isCheckedEmployee(employeeName) {
    return employeeName === this.employeeFilter;
  }

  public setProjectFilter(projectFilter) {
    this.projectFilter = projectFilter;
    this.filter();
  }

  public setEmployeeFilter(employeeFilter) {
    this.employeeFilter = employeeFilter;
    this.filter();
  }

  public filterByDate(param) {
    this.dateFilter = param;
    this.reportsForDisplay = this._filterService.filterByDate(param, this.reportsForDisplay);
  }

  public filter() {
    this.reportsForDisplay = this._filterService.filter(this._reports, this.employeeFilter, this.projectFilter);
  }

  public showAllReports() {
    this.reportsForDisplay = this._reports;
    this.removeAllFilters();
  }

  public removeAllFilters() {
    this.employeeFilter = null;
    this.projectFilter = null;
    this.dateFilter = null;
  }
  ngOnDestroy() {
    this._subscriptions.forEach( subscription => subscription.unsubscribe());
  }

}
