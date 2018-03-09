import { Injectable } from '@angular/core';

import { UserService } from './user.service';
import { User } from '@firebase/auth-types';

@Injectable()
export class ValidateService {
  stateHolidays = [
    new Date('1-1-2018'),
    new Date('1-2-2018'),
    new Date('2-15-2018'),
    new Date('2-16-2018'),
    new Date('5-1-2018'),
    new Date('5-2-2018'),
    new Date('11-11-2018')
  ];

  constructor(
    private _userService: UserService
  ) { }

  public validateVacation(vacationStartDate, vacationEndDate) {
    const totalVacationAllowed = 21;
    const userDaysOff = this._userService.getUserDaysOff();

    let totalVacationInDays = (Math.abs(vacationEndDate - vacationStartDate)) / ( 24 * 60 * 60 * 1000) + 1;
    // increase for weekends
    const vacationStartDay = vacationStartDate.getDay();
    const vacationEndDay = vacationEndDate.getDay();

    if (vacationEndDay < vacationStartDay && totalVacationInDays % 7 !== 0) {
      totalVacationInDays -= 2;
    } else if (vacationEndDay === 6) {
      totalVacationInDays -= 1;
    }

    const numberOfWeekends = Math.floor(totalVacationInDays / 7) * 2;
    totalVacationInDays -= numberOfWeekends;
    // holydays
    this.stateHolidays.forEach(holidayDate => {
      const holidayDay = holidayDate.getDay();
      if (holidayDay === 0 || holidayDay === 6) { // saturday or sunday
        return;
      } else if (vacationStartDate <= holidayDate && vacationEndDate >= holidayDate) {
        totalVacationInDays -= 1;
      }
    });

    if (totalVacationAllowed >= totalVacationInDays && totalVacationInDays <= userDaysOff) {
      return totalVacationInDays;
    } else {
      return false;
    }
  }

  public getTotalSickDays(startDate, endDate) {
    let totalSickdays = (Math.abs(endDate - startDate)) / ( 24 * 60 * 60 * 1000) + 1;
    // increase for weekends
    const startDay = startDate.getDay();
    const endDay = endDate.getDay();

    if (endDay < startDay && totalSickdays % 7 !== 0) {
      totalSickdays -= 2;
    } else if (endDay === 6) {
      totalSickdays -= 1;
    }

    const numberOfWeekends = Math.floor(totalSickdays / 7) * 2;
    totalSickdays -= numberOfWeekends;
    // holydays
    this.stateHolidays.forEach(holidayDate => {
      const holidayDay = holidayDate.getDay();
      if (holidayDay === 0 || holidayDay === 6) { // saturday or sunday
        return;
      } else if (startDate <= holidayDate && endDate >= holidayDate) {
        totalSickdays -= 1;
      }
    });

    return totalSickdays;
  }

  public validateUserReportInput(reportInput) {
    if (reportInput !== null && reportInput.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

  public validateReportObj(reportObj) {
    let isValid = true;
    Object.values(reportObj).forEach( value => {
      if (this.validateUserReportInput(value) !== true) {
        isValid = false;
      }
    });
    return isValid;
  }

  public validateUserDateInput(dateObj) {
    let isValid = true;
    Object.values(dateObj).forEach( value => {
      if (value === null) {
        isValid = false;
      }
    });
    return isValid;
  }

  public validatePassword(password) {
    const passwordRegex = /^[\w_]{8,20}$/;
    return passwordRegex.test(password);
  }

  public validateName(name) {
      const nameRegex = /^[a-z]{2,}\b$/i;
      return nameRegex.test(name);
  }

  public validateAddress(address) {
      const addressRegex = /^[\w\s]{3,}\s[0-9]+$/i;
      return addressRegex.test(address);
  }

  public validatePhoneNumber(number) {
      const numberRegex = /^[0-9]{6,12}$/;
      return numberRegex.test(number);
  }

  public validateJmbg(jmbg) {
      const jmbgRegex = /^[0-9]{13}$/;
      return jmbgRegex.test(jmbg);
  }

  public validateEmail(email) {
      const emailRegex = /^[\w_.%+-]{2,}@([a-z]{1,}.){1,}[a-z]{1,}$/i;
      return emailRegex.test(email);
  }

  public validatePosition(position) {
      const positionRegex = /^[\w]{2,}$|^[\w]{2,}\s*,\s*[\w]{2,}$/i;
      return positionRegex.test(position);
  }

public validateUserRegistrationInput(obj) {
    return this.validateAddress(obj['address']) &&
           this.validateName(obj['name']) &&
           this.validateName(obj['lastname']) &&
           this.validatePassword(obj['password']) &&
           this.validatePhoneNumber(obj['number']) &&
           this.validateJmbg(obj['jmbg']) &&
           this.validateEmail(obj['email']) &&
           this.validatePosition(obj['position']);
}

}
