import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// FIREBASE
import { AngularFireDatabase } from 'angularfire2/database';
import { NotificationService } from './notification.service';
import { UserService } from './user.service';

@Injectable()

export class RequestService {

    constructor(
        private _database: AngularFireDatabase,
        private _notificationService: NotificationService,
        private _userService: UserService,
        private _router: Router
    ) {}

    public sendRequest(request) {
        this._database.list('requests').push(request)
            .then(() => {
                const notification = 'Uspesno ste poslali zahtev';
                this._notificationService.displayNotification(notification);
            });
    }

    public sendRegistrationRequest(userObj) {
        const data = {
            dateOfRequest: (new Date).toDateString(),
            request: `Zahtev za registraciju od ${userObj.name} ${userObj.lastname}`,
            status: 'Nije odobren',
            username: `${userObj.name} ${userObj.lastname}`
        };
        const metadata = {
            userObj: userObj,
            type: 'Registracija'
        };
        const request = {
            data: data,
            metadata: metadata
        };

        this.sendRequest(request);
        this._router.navigateByUrl('instrukcije');
    }

    public deleteRequest(requestKey) {
        this._database.object(`requests/${requestKey}`).remove()
            .then(() => {
                const notification = 'Zahtev je izbrisan iz baze';
                this._notificationService.displayNotification(notification);
            }).catch(err => {
                this._notificationService.displayError('Greska', err.code);
            });
    }

    public sendVacationRequest(startDate, endDate, totalVacationInDays) {
        const userName = this._userService.getUserName();
        const userId = this._userService.getUserId();
        const date = (new Date()).toDateString();
        const type = 'Odmor';
        const daysOffRemaining = this._userService.getUserDaysOff() - totalVacationInDays;

        const request = {
            metadata: {
                userId: userId,
                startDate: startDate,
                endDate: endDate,
                type: type,
                daysOffRemaining: daysOffRemaining
            },
            data: {
                dateOfRequest: date,
                request: `Odmor od ${startDate} do ${endDate}` ,
                status: 'Nije odobren',
                userName: userName
            }
        };

        this.sendRequest(request);
    }

    public sendSickDaysRequest(startDate, endDate, totalSickDays) {
        const userName = this._userService.getUserName();
        const userId = this._userService.getUserId();
        const date = (new Date()).toDateString();
        const type = 'Bolovanje';
        const newSickDays = this._userService.getUserSickDays() + totalSickDays;

        const request = {
            metadata: {
                userId: userId,
                startDate: startDate,
                endDate: endDate,
                type: type,
                newSickDays: newSickDays
            },
            data: {
                dateOfRequest: date,
                request: `Bolovanje od ${startDate} do ${endDate}` ,
                status: 'Nije odobren',
                userName: userName
            }
        };

        this.sendRequest(request);
    }

    public getRequests() {
        const requestRef = this._database.object('requests');
        const requests = requestRef.valueChanges()
            .map( values => values);
        return requests;
    }


}
