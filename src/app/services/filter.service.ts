import { Injectable } from '@angular/core';


@Injectable()
export class FilterService {
    constructor() {}

    filterByDate(param, reports) {
        reports.sort((report1, report2) => {
          const dateReport1WasWritten: any = new Date(report1.date);
          const dateReport2WasWritten: any = new Date(report2.date);
          const difference = dateReport1WasWritten - dateReport2WasWritten;
          if (param === 'eldest') {
            return -difference;
          } else if (param === 'youngest') {
            return difference;
          }
        });
        return reports;
    }

    public filterByProjectAndEmployee(reports) {
        const filteredReportsObj = {
            byName: {},
            byProject: {}
        };
        reports.forEach(report => {
            const currentProject = report.currentProject.toString();
            if (filteredReportsObj.byProject[currentProject] === undefined) {
                filteredReportsObj.byProject[currentProject] = [];
            }
            filteredReportsObj.byProject[currentProject].push(report);

            const employee = report.name;
            if (filteredReportsObj.byName[employee] === undefined) {
                filteredReportsObj.byName[employee] = [];
            }
            filteredReportsObj.byName[employee].push(report);
        });

        return filteredReportsObj;
    }
}
