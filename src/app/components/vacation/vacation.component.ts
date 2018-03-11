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
  ay;
  days: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  months: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  constructor(
    private _requestService: RequestService,
    private _validateService: ValidateService,
    private _notificationService: NotificationService
  ) { }

  ngOnInit() {}

  sendRequest(param) {
    const startDate = `${this.startDate.month}-${this.startDate.day}-${this.startDate.year}`;
    const endDate = `${this.endDate.month}-${this.endDate.day}-${this.endDate.year}`;

    const isInputValid = this._validateService.validateUserDateInput(startDate)
      && this._validateService.validateUserDateInput(endDate);
    if (isInputValid === false) {
      console.log('Input is invalid');
      return;
    }

    if (param === 'vacation') {
      const totalVacationInDays = this._validateService.validateVacation(new Date(startDate), new Date(endDate));
      if (totalVacationInDays === false) {
        const notification = 'Odmor mora biti kraci od 21 dan';
        this._notificationService.displayNotification(notification);
        return;
      }
      this._requestService.sendVacationRequest(startDate, endDate, totalVacationInDays);
    } else if (param === 'sickDays') {
      const totalSickDays = this._validateService.getTotalSickDays(new Date(startDate), new Date(endDate));
      this._requestService.sendSickDaysRequest(startDate, endDate, totalSickDays);
    }
  }

}
