import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

// FIREBASE
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { UserService } from './user.service';
import { NotificationService } from './notification.service';

@Injectable()

export class ReportService {
    reports: any;
    report: any;
    private _sendReportsSubject = new Subject();
    public reportsFetchEvent$ = this._sendReportsSubject.asObservable();

    private _sendReportSubject = new Subject();
    public reportFetchEvent$ = this._sendReportSubject.asObservable();

    constructor(
        private _database: AngularFireDatabase,
        private _userService: UserService,
        private _notificationService: NotificationService
    ) {}

    public saveReportForReportViewer(report) {
        this.report = report;
    }

    public getReport() {
        this._sendReportSubject.next(this.report);
    }

    public getReports() {
        const userId = this._userService.getUserId();
        if (userId === false) {
            return;
        }
        const reportRef = this._database.list(`reports/${userId}`);
        this.reports =  reportRef.valueChanges()
            .subscribe( reports => {
                    this.reports = reports;
                    this._sendReports(reports);
                },
                (err) => {
                    const notification = 'Greska';
                    const error = err.code;
                    this._notificationService.displayError(notification, error);
                }
            );
    }

    public getAllReports() {
        const requestRef = this._database.list('reports');
         return requestRef.valueChanges()
            .map(values => values);
    }

    public sendReportToDatabase(reportObj) {
        const date = this.getTodaysDate();
        const userEmail = this._userService.getUserEmail();
        reportObj['date'] = date;
        reportObj['email'] = userEmail;
        reportObj['name'] = this._userService.getUserName();
        const userId = this._userService.getUserId();
        const newReportRef = this._database.list(`reports/${userId}`);
        newReportRef.push(reportObj)
        .then(() => {
            const notification = 'Uspesno se poslali izvestaj';
            this._notificationService.displayNotification(notification);
        });
    }

    private _sendReports(reports) {
        this._sendReportsSubject.next(reports);
    }

    private _mutateEmail(email) {
        return email.replace(/[@.]/g, '-');
    }

    public getTodaysDate() {
        const date = new Date();
        return date.toLocaleDateString();
    }

}
