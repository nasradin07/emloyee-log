import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { AngularFireAuth } from 'angularfire2/auth';

import { ReportService } from '../../../services/report.service';
import { RequestService } from '../../../services/request.service';
import { NotificationFirebaseService } from '../../../services/notification-firebase.service';
import { UserService } from '../../../services/user.service';
import { UpdateService } from '../../../services/update.service';
import { NotificationService } from '../../../services/notification.service';
import { RegistrationService } from '../../../services/registration.service';

@Injectable()

export class AdminService {
    private _requests: any;
    private _sendRequestsSubject = new Subject();
    public requestsFetchEvent$ = this._sendRequestsSubject.asObservable();

    private _reports: Array<any> = [];
    private _sendReportsSubject = new Subject();
    public reportsFetchEvent = this._sendReportsSubject.asObservable();

    constructor(
        private _userService: UserService,
        private _reportService: ReportService,
        private _requestService: RequestService,
        private _updateService: UpdateService,
        private _notificationFirebaseService: NotificationFirebaseService,
        private _notificationService: NotificationService,
        private _registrationService: RegistrationService,
        private _auth: AngularFireAuth
    ) {
    }

    public approveVacationRequest(userId, notification, requestKey, daysOffRemaining) {
        this._requestService.deleteRequest(requestKey);
        this._notificationFirebaseService.sendNotification(userId, notification);
        this._updateService.updateUserDaysOff(userId, daysOffRemaining);
    }

    public approveSickDaysRequest(userId, notification, requestKey, newSickDays) {
        this._requestService.deleteRequest(requestKey);
        this._updateService.updateUserSickDays(userId, newSickDays);
        this._notificationFirebaseService.sendNotification(userId, notification);
    }

    public approveRegistrationRequest(userObj, notification, requestKey) {
        const currentUserEmail = this._userService.getUserEmail();
        const currentUserPassword = this._userService.getUserPassword();
        this._auth.auth.createUserWithEmailAndPassword(userObj.email, userObj.password)
            .then( (user) => {
                console.log('New user:', user);
                const userId = user.uid;
                this._registrationService.registerUser(userId, userObj);
                this._auth.auth.signOut()
                    .then(() => {
                        this._auth.auth.signInWithEmailAndPassword(currentUserEmail, currentUserPassword)
                            .then(() => {
                                console.log('Sending notifications');
                                this._notificationFirebaseService.sendNotification(userId, notification);
                            });
                        });
                this._requestService.deleteRequest(requestKey);
            })
            .catch(err => console.log(err));
    }

    public disapproveRegistrationRequest(requestKey) {
        this._requestService.deleteRequest(requestKey);
    }

    public diapproveRequest(userId, notification, requestKey) {
        this._requestService.deleteRequest(requestKey);
        this._notificationFirebaseService.sendNotification(userId, notification);
    }

    public getRequests() {
        this._requestService.getRequests().subscribe(
            requestsObj => {
                if (requestsObj === null) {
                    return [];
                }
                const requests = [];
                Object.keys(requestsObj).forEach(key => {
                    const request = requestsObj[key];
                    request.metadata.requestKey = key;
                    requests.push(request);
                });
                this.sendRequests(requests);
            },
            err => {
                const notification = 'Greska';
                const error = err.code;
                this._notificationService.displayError(notification, error);
            }
        );
    }

    public getReports() {
        this._reportService.getAllReports().subscribe(
            users => {
                this._reports = [];
                users.forEach(allUsersReportsObj => {
                    const allReports = Object.values(allUsersReportsObj);
                    allReports.forEach(report => {
                        this._reports.push(report);
                    });
                });
                this.sendReports(this._reports);
            },
            err => {
                const notification = 'Greska';
                const error = err.code;
                this._notificationService.displayError(notification, error);
            }
        );
    }

    public sendReports(reports) {
        this._sendReportsSubject.next(reports);
    }

    public sendRequests(requests) {
        this._sendRequestsSubject.next(requests);
    }
}
