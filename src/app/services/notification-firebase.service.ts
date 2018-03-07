import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { AngularFireDatabase } from 'angularfire2/database';

import { NotificationService } from './notification.service';

@Injectable()

export class NotificationFirebaseService {
    notifications: any;

    private _sendNotificationsSubject = new Subject();
    public notificationsFetchEvent$ = this._sendNotificationsSubject.asObservable();

    constructor(
        private _database: AngularFireDatabase,
        private _notificationService: NotificationService
    ) {}

    public getNotifications(userId) {
        this._database.object(`notifications/${userId}`).valueChanges()
            .subscribe(
                notificationsObj => {
                    if (notificationsObj === null) {
                        this.notifyOfNotificationFetchEvent(false);
                        return;
                    }
                    const notifications = [];
                    Object.keys(notificationsObj).forEach(key => {
                        notifications.push({
                            notificationKey: key,
                            notification: notificationsObj[key]
                        });
                    });
                    this.notifyOfNotificationFetchEvent(notifications);
                }
            );
    }

    public sendNotification(userId, userNotification) {
        this._database.list(`notifications/${userId}`).push(userNotification)
            .then(() => {
                const notification = 'Uspesno ste poslali notifikaciju';
                this._notificationService.displayNotification(notification);
            });
    }

    public deleteNotification(userId, notificationKey) {
        this._database.list(`notifications/${userId}/${notificationKey}`).remove();
    }

    public notifyOfNotificationFetchEvent(param) {
        this._sendNotificationsSubject.next(param);
    }
}
