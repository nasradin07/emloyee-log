import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';

import { NotificationService } from './notification.service';

@Injectable()

export class NotificationFirebaseService {
    constructor(
        private _database: AngularFireDatabase,
        private _notificationService: NotificationService
    ) {}

    public sendNotification(userId, userNotification) {
        this._database.list(`notifications/${userId}`).push(userNotification)
            .then(() => {
                const notification = 'Uspesno ste poslali notifikaciju';
                this._notificationService.displayNotification(notification);
            });
    }
}
