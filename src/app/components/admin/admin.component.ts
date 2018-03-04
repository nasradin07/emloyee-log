import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AdminService } from '../../services/admin.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];
  requests;
  reports;
  constructor(
    private _adminService: AdminService,
    private _notificationService: NotificationService
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
          this.reports = reports;
        },
        err => console.log(err)
      )
    );
  }


  public disapproveRequest(request) {
    const requestKey = request.metadata.requestKey;
    const notification = {
      date: request.data.dateOfRequest,
      requestStatus: `Zahtev: ${request.data.request} - nije odobren`
    };
    const userId = request.metadata.userId;
    this._adminService.diapproveRequest(userId, notification, requestKey);
  }

  public approveRequest(request) {
    const requestKey = request.metadata.key;
    const notification = {
      date: request.data.dateOfRequest,
      requestStatus: `Zahtev: ${request.data.request} - je odobren`
    };
    const userId = request.metadata.userId;
    const totalVacationInDays = request.metadata.totalVacationInDays;
    this._adminService.approveVacationRequest(userId, notification, requestKey, totalVacationInDays);
  }

  public openReport(report) {
    console.log('Open', report);
  }

  ngOnDestroy() {
    this._subscriptions.forEach( subscription => subscription.unsubscribe());
  }

}
