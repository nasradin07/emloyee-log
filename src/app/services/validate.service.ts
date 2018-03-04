import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  public validateVacation(vacationStartDate, vacationEndDate) {
    const totalVacationAllowed = 21;
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

    if (totalVacationAllowed >= totalVacationInDays) {
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
