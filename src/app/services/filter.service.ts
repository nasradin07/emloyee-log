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

    getProjectNames(reports) {
        const projectNames = {};
        reports.forEach(report => {
            const projectName = report.currentProject;
            if (projectNames[projectName] === undefined) {
                projectNames[projectName] = true;
            }
        });
        return Object.keys(projectNames);
    }

    public getProjectAndUserNames(reports) {
        const projectAndUserNames = {
            userName: {},
            projectName: {}
        };
        reports.forEach(report => {
            if (projectAndUserNames.userName[report.name] === undefined) {
                projectAndUserNames.userName[report.name] = true;
            }
            if (projectAndUserNames.projectName[report.currentProject] === undefined) {
                projectAndUserNames.projectName[report.currentProject] = true;
            }
        });

        return projectAndUserNames;
    }

    filter(reports, employeeFilter, projectFilter) {
        return reports.filter(report => {
            const employeeName = report.name.trim().toLowerCase();
            const reportName = report.currentProject.trim().toLowerCase();
            projectFilter !== null ? projectFilter = projectFilter.trim().toLowerCase() : projectFilter = null;
            employeeFilter !== null ? employeeFilter = employeeFilter.trim().toLowerCase() : employeeFilter = null;
            if (employeeFilter === null) {
                return reportName === projectFilter;
            } else if ( projectFilter === null) {
                return report.name.toLowerCase() === employeeFilter;
            } else {
                return reportName === projectFilter &&
                       employeeName === employeeFilter;
            }
        });
    }
}
