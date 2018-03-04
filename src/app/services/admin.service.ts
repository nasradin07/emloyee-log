import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ReportService } from './report.service';
import { RequestService } from './request.service';
import { NotificationFirebaseService } from './notification-firebase.service';
import { UserService } from './user.service';
import { UpdateService } from './update.service';

@Injectable()

export class AdminService {
    private _requests: any;
    private _sendRequestsSubject = new Subject();
    public requestsFetchEvent$ = this._sendRequestsSubject.asObservable();

    private _reports: any = [];
    private _sendReportsSubject = new Subject();
    public reportsFetchEvent = this._sendReportsSubject.asObservable();

    constructor(
        private _userService: UserService,
        private _reportService: ReportService,
        private _requestService: RequestService,
        private _updateService: UpdateService,
        private _notificationFirebaseService: NotificationFirebaseService
    ) {}

    public approveVacationRequest(userId, notification, requestKey, totalVacationInDays) {
        const userDaysOffRemaining = this._userService.getUserDaysOff() - totalVacationInDays;
        this._requestService.deleteRequest(requestKey);
        this._notificationFirebaseService.sendNotification(userId, notification);
        this._updateService.updateUserDaysOff(userId, userDaysOffRemaining);
    }

    public diapproveRequest(userId, notification, requestKey) {
        this._requestService.deleteRequest(requestKey);
        this._notificationFirebaseService.sendNotification(userId, notification);
    }

    public getRequests() {
        this._requestService.getRequests().subscribe(
            requestsObj => {
                if (requestsObj === null) {
                    return;
                }
                const requests = [];
                Object.keys(requestsObj).forEach(key => {
                    const request = requestsObj[key];
                    request.metadata.requestKey = key;
                    requests.push(request);
                });
                this.sendRequests(requests);
            },
            err => console.log(err)
        );
    }

    public getReports() {
        this._reportService.getAllReports().subscribe(
            users => {
                users.forEach(allUsersReportsObj => {
                    const allReports = Object.values(allUsersReportsObj);
                    allReports.forEach(report => {
                        this._reports.push(report);
                    });
                });
                this.sendReports(this._reports);
            },
            err => console.log(err)
        );
    }

    public sendReports(reports) {
        this._sendReportsSubject.next(reports);
    }

    public sendRequests(requests) {
        this._sendRequestsSubject.next(requests);
    }
}
