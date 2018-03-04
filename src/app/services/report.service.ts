import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

// FIREBASE
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { UserService } from './user.service';
import { NotificationService } from './notification.service';

@Injectable()

export class ReportService {
    reports: any;
    private _sendReportsSubject = new Subject();
    public reportFetchEvent$ = this._sendReportsSubject.asObservable();
    constructor(
        private _database: AngularFireDatabase,
        private _userService: UserService,
        private _notificationService: NotificationService
    ) {}

    public getReports() {
        const userId = this._userService.getUserId();
        console.log(userId);
        if (userId === false) {
            return;
        }
        const reportRef = this._database.list(`reports/${userId}`);
        this.reports =  reportRef.valueChanges()
            .subscribe( reports => {
                    this.reports = reports;
                    this._sendReports(reports);
                },
                (err => console.log(err))
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
