import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RequestService } from '../../services/request.service';
import { ValidateService } from '../../services/validate.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-vacation',
  templateUrl: './vacation.component.html',
  styleUrls: ['./vacation.component.css']
})
export class VacationComponent implements OnInit {
  startDate: any = {
    day: null,
    month: null,
    year: null
  };
  endDate: any = {
    day: null,
    month: null,
    year: null
  };

  days = [];
  months = [];
  years = [];
  sickDaysRequest:boolean = false;
  constructor(
    private _requestService: RequestService,
    private _validateService: ValidateService,
    private _notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.initializeDates();
  }

  sendRequest() {
    const startDate = new Date(`${this.startDate.month}-${this.startDate.day}-${this.startDate.year}`);
    const endDate = new Date(`${this.endDate.month}-${this.endDate.day}-${this.endDate.year}`);

    const isInputValid = this._validateService.validateUserDateInput(this.startDate)
      && this._validateService.validateUserDateInput(this.endDate);
    if (isInputValid === false) {
      this.showError('Unet datum nije ispravan');
      return;
    }
    if (this.sickDaysRequest === true) {
      this.sendSickDaysRequest(startDate,endDate)
    } else {
      this.sendVacationRequest(startDate,endDate);
    }

  }

  public sendSickDaysRequest(startDate,endDate) {
    const isRequestValid = this._validateService.validateSickDays(startDate,endDate);
    if(isRequestValid.status === false) {
      this.showError(isRequestValid.result);
      return;
    }
    this._requestService.sendSickDaysRequest(startDate, endDate, isRequestValid.result);
  }

  public sendVacationRequest(startDate,endDate) {
    const isRequestValid = this._validateService.validateVacation(new Date(startDate), new Date(endDate));
    if (isRequestValid.status === false) {
      this._notificationService.displayNotification(isRequestValid.result);
      return;
    }
    this._requestService.sendVacationRequest(startDate, endDate, isRequestValid.result);
  }

  setRequest() {
    this.sickDaysRequest = !this.sickDaysRequest;
  }

  public initializeDates() {
    this.initializeYears();
    this.initializeMonths();
    this.initializeDays();

  }

  public initializeYears() {
    const now = new Date();
    this.years.push(now.getFullYear(), now.getFullYear() + 1);
  }

  public initializeMonths() {
    for(let i = 1; i < 13; i++) {
      this.months.push(i);
    }
  }

  public initializeDays() {
    for(let i = 1; i < 32; i++) {
      this.days.push(i);
    }
  }

  public showError(msg) {
    this._notificationService.displayNotification(msg);
  }


}
