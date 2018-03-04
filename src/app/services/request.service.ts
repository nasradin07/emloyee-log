import { Injectable } from '@angular/core';

// FIREBASE
import { AngularFireDatabase } from 'angularfire2/database';
import { NotificationService } from './notification.service';
import { UserService } from './user.service';

@Injectable()

export class RequestService {

    constructor(
        private _database: AngularFireDatabase,
        private _notificationService: NotificationService,
        private _userService: UserService
    ) {}

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

        const request = {
            metadata: {
                userId: userId,
                startDate: startDate,
                endDate: endDate,
                type: type,
                totalVacationInDays: totalVacationInDays
            },
            data: {
                dateOfRequest: date,
                request: `Odmor od ${startDate} do ${endDate}` ,
                status: 'Nije odobren',
                userName: userName
            }
        };

        const requestRef = this._database.list('requests');
        requestRef.push(request)
            .then((datasentback) => {
                const notification = 'Uspesno ste poslali zahtev';
                this._notificationService.displayNotification(notification);
            });
    }

    public sendSickDaysRequest(startDate, endDate) {
        const userName = this._userService.getUserName();
        const userId = this._userService.getUserId();
        const date = (new Date()).toDateString();
        const type = 'Bolovanje';

        const request = {
            metadata: {
                userId: userId,
                startDate: startDate,
                endDate: endDate,
                type: type
            },
            data: {
                dateOfRequest: date,
                request: `Bolovanje od ${startDate} do ${endDate}` ,
                status: 'Nije odobren',
                userName: userName
            }
        };

        const requestRef = this._database.list('requests');
        requestRef.push(request)
            .then(() => this._notificationService.displayNotification('Uspesno ste poslali zahtev'));
    }

    public getRequests() {
        const requestRef = this._database.object('requests');
        const requests = requestRef.valueChanges()
            .map( values => values);
        return requests;
    }


}
