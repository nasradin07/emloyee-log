import { Injectable } from '@angular/core';

import { UserService } from './user.service';
import { User } from '@firebase/auth-types';

@Injectable()
export class ValidateService {

  constructor(
    private _userService: UserService
  ) { }

  public validateVacation(vacationStartDate, vacationEndDate) {
    const totalVacationAllowed = 21;
    const userDaysOff = this._userService.getUserDaysOff();
    const stateHolidays = [
      new Date('1-1-2018'),
      new Date('1-2-2018'),
      new Date('2-15-2018'),
      new Date('2-16-2018'),
      new Date('5-1-2018'),
      new Date('5-2-2018'),
      new Date('11-11-2018')
    ];
    console.log(userDaysOff);
    let totalVacationInDays = (vacationEndDate - vacationStartDate) / ( 24 * 60 * 60 * 1000) + 1;
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
    stateHolidays.forEach(holidayDate => {
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


  public validateUserDateInput(dateObj) {
    let isValid = true;
    Object.values(dateObj).forEach( value => {
      if (value === null) {
        isValid = false;
      }
    });
    return isValid;
  }

}
