import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RequestService } from '../../services/request.service';
import { ValidateService } from '../../services/validate.service';
import { NotificationService } from '../../services/notification.service';
import { start } from 'repl';

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

  startDays = [];
  startMonths = [];
  endDays = [];
  endMonths = [];
  startYear: any;
  endYear: any;
  constructor(
    private _requestService: RequestService,
    private _validateService: ValidateService,
    private _notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.initializeDates();
  }

  sendRequest(param) {
    const startDate = `${this.startDate.month}-${this.startDate.day}-${this.startDate.year}`;
    const endDate = `${this.endDate.month}-${this.endDate.day}-${this.endDate.year}`;

    const isInputValid = this._validateService.validateUserDateInput(startDate)
      && this._validateService.validateUserDateInput(endDate);
    if (isInputValid === false) {
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

  public updatePossibleMonths(param) {
    if (param === 'end') {
      this.initializePossibleMonths(parseInt(this.endDate.year, 10), 'end');
      this.initializePossibleDays(parseInt(this.endMonths[0], 10), 'end');
    } else if (param === 'start') {
      this.initializePossibleMonths(parseInt(this.startDate.year, 10), 'start');
      this.initializePossibleDays( parseInt(this.startMonths[0], 10), 'start' );
    }
  }

  public updatePossibleDays(param) {
    let month;
    if ( param === 'start') {
      month = this.startDate.month;
    } else if ( param === 'end' ) {
      month = this.endDate.month;
    }
    this.initializePossibleDays( parseInt(month, 10), param);
  }

  public initializeDates() {
    const now = new Date();
    this.startDate.year = now.getFullYear();
    this.endDate.year = now.getFullYear();
    this.initializeStartYear(now.getFullYear());
    this.initializeEndYear(now.getFullYear());
    this.initializePossibleMonths(this.startYear, 'start');
    this.initializePossibleMonths(this.endYear[0], 'end');
    this.initializePossibleDays(this.startMonths[0], 'start');
    this.initializePossibleDays(this.endMonths[0], 'end');
  }

  public initializeStartYear(year) {
    this.startYear = year;
  }

  public initializeEndYear(year) {
    this.endYear = [year, year + 1];
  }


  public initializePossibleMonths(year, param) {
    const now = new Date();
    this.clearMonths(param);
    if ( parseInt(year, 10) === now.getFullYear()) {
      const nowMonth = now.getMonth();
      this.loopPossibleMonths(nowMonth, param);
    } else {
      this.loopPossibleMonths(0, param);
    }
  }

  public loopPossibleMonths(startMonth, param) {
    for (let month = startMonth; month < 12; month += 1) {
      if ( param === 'start' ) {
        this.startMonths.push(month + 1);
      } else if (param === 'end') {
        this.endMonths.push(month + 1);
      }
    }
  }

  public initializePossibleDays(month, param) {
    this.clearDays(param);
    const startCountingAt = this.getStartCountingAtDay(param, month);
    if ( month <= 7) {
      if ( month === 2 ) {
        this.loopFebruaryDays(param, startCountingAt);
      } else if ( month % 2 === 1 ) {
          this.loopDaysTo31(param, startCountingAt);
        } else if (month % 2 === 0) {
            this.loopDaysTo30(param, startCountingAt);
        }
    } else if ( month > 7) {
      if (month % 2 === 1) {
        this.loopDaysTo30(param, startCountingAt);
      } else if (month % 2 === 0) {
        this.loopDaysTo31(param, startCountingAt);
      }
    }

  }

  getStartCountingAtDay(param, month) {
    let startCountingAt = 1;
    const now = new Date();
    if (param === 'start') {
      const year = parseInt(this.startDate.year, 10);
      if (year === now.getFullYear() && month === now.getMonth() + 1) {
        startCountingAt = now.getDate();
      }
    } else if (param === 'end') {
      const year = parseInt( this.endDate.year, 10);
      if (year === now.getFullYear() && month === now.getMonth() + 1) {
        startCountingAt = now.getDate();
      }
    }
    return startCountingAt;
  }

  loopDaysTo31(param, startCountingAt) {
    const now = new Date();
    for (let day = startCountingAt; day < 32; day += 1) {
      if (param === 'start') {
        this.startDays.push(day);
      } else if (param === 'end') {
        this.endDays.push(day);
      }
    }
  }

  loopDaysTo30(param, startCountingAt) {
    for (let day = startCountingAt; day < 31; day += 1) {
      param === 'start' ? this.startDays.push(day) : this.endDays.push(day);
    }
  }

  loopFebruaryDays(param, startCountingAt) {
    for (let day = startCountingAt; day < 29; day += 1) {
      param === 'start' ? this.startDays.push(day) : this.endDays.push(day);
    }
    const now = new Date();
    if (now.getFullYear() % 4 === 0) {
      param === 'start' ? this.startDays.push(29) : this.endDays.push(29);
     }
  }

  clearDays(param) {
    if (param === 'start') {
      this.startDays = [];
    } else if (param === 'end') {
      this.endDays = [];
    }
  }

  clearMonths(param) {
    if (param === 'start') {
      this.startMonths = [];
    } else if (param === 'end') {
      this.endMonths = [];
    }
  }
}
