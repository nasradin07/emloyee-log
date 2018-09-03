import { Component, OnInit, Input } from '@angular/core';

import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  @Input() request;
  showRequest = true;
  constructor(
    private _adminService: AdminService
  ) { }

  ngOnInit() {
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
      this._adminService.disapproveRegistrationRequest(requestKey);
    }
    this.showRequest = false;
  }

  public approveRequest(request) {
    const requestKey = request.metadata.requestKey;
    const notification = {
      date: request.data.dateOfRequest,
      requestStatus: `Zahtev: ${request.data.request} - je odobren`
    };
    const userId = request.metadata.userId;
    if (request.metadata.type === 'Odmor') {
      const daysOffRemaining = request.metadata.daysOffRemaining;
      this._adminService.approveVacationRequest(userId, notification, requestKey, daysOffRemaining);
    } else if (request.metadata.type === 'Registracija') {
      console.log(request);
      const userObj = request.metadata.userObj;
      this._adminService.approveRegistrationRequest(userObj, notification, requestKey);
    } else if (request.metadata.type === 'Bolovanje') {
      const newSickDays = request.metadata.newSickDays;
       this._adminService.approveSickDaysRequest(userId, notification, requestKey, newSickDays);
    }

    this.showRequest = false;
  }

}
