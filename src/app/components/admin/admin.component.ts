import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AdminService } from '../../services/admin.service';
import { NotificationService } from '../../services/notification.service';
import { ReportService } from '../../services/report.service';

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
    private _notificationService: NotificationService,
    private _reportService: ReportService
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
          console.log(requests);
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
    if (request.metadata.type === 'Odmor' || request.metadata.type === 'Bolovanje') {
      this._adminService.diapproveRequest(userId, notification, requestKey);
    } else if (request.metadata.type === 'Registracija') {
      this._adminService.disapproveRegistrationRequest(userId, requestKey);
    }
  }

  public approveRequest(request) {
    const requestKey = request.metadata.key;
    const notification = {
      date: request.data.dateOfRequest,
      requestStatus: `Zahtev: ${request.data.request} - je odobren`
    };
    const userId = request.metadata.userId;
    if (request.metadata.type === 'Odmor') {
      const daysOffRemaining = request.metadata.daysOffRemaining;
      this._adminService.approveVacationRequest(userId, notification, requestKey, daysOffRemaining);
    } else if (request.metadata.type === 'Registracija') {
      this._adminService.approveRegistrationRequest(userId, notification, requestKey);
    } else if (request.metadata.type === 'Bolovanje') {
      const newSickDays = request.metadata.newSickDays;
       this._adminService.approveSickDaysRequest(userId, notification, requestKey, newSickDays);
    }
  }

  public openReport(report) {
    this._reportService.saveReportForReportViewer(report);
  }

  ngOnDestroy() {
    this._subscriptions.forEach( subscription => subscription.unsubscribe());
  }

}
