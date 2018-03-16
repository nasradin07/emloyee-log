import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireAuth } from 'angularfire2/auth';

import { UserService } from './user.service';
import { NotificationService } from './notification.service';

@Injectable()
export class UpdateService {
    constructor(
        private _database: AngularFireDatabase,
        private _storage: AngularFireStorage,
        private _auth: AngularFireAuth,
        private _userService: UserService,
        private _notificationService: NotificationService
    ) {}

    public updateUserPassword(newPassword) {
        const user = this._auth.auth.currentUser;
        user.updatePassword(newPassword)
            .then(() => {
                const updateObj = { password: newPassword};
                this.updateUserProfile(updateObj);
            })
            .catch(err => {
                const notification = 'Doslo je do greske prilikom promene lozinke';
                const error = err.code;
                this._notificationService.displayError(notification, error);
            });
    }

    public updateUserProfile(updateObj) {
        const userId = this._userService.getUserId();
        const userRef = this._database.object(`users/${userId}`);
        userRef.update(updateObj)
            .then(() => {
                const notification = 'Uspesno ste promenili svoj profil';
                this._notificationService.displayNotification(notification);
            })
            .catch(err => {
                const notification = 'Doslo je do greske prilikom promene vaseg profila.'
                const error = err.code;
                this._notificationService.displayError(notification, error);
            });
    }

    public updateUserImage(file) {
        const userId = this._userService.getUserId();
        const filePath = `images/${userId}`;
        const imageRef = this._storage.upload(filePath, file)
            .then(() => {
                const notification = 'Slika je uspesno promenjena';
                this._notificationService.displayNotification(notification);
            })
            .catch(err => {
                const notification = 'Doslo je do greske prilikom promene profilne slike.';
                const error = err.code;
                this._notificationService.displayError(notification, error);
            });
    }

    public updateUserDaysOff(userId, newDaysOff) {
        this._database.object(`users/${userId}`).update({daysOff: newDaysOff})
            .then(() => {
                const notification = 'Korisniku je promenjen broj slobodnih dana';
                this._notificationService.displayNotification(notification);
            }).catch(err => {
                this._notificationService.displayError('Greska', err.code);
            });
    }

    public updateUserSickDays(userId, newSickDays) {
        this._database.object(`users/${userId}`).update({sickDays: newSickDays})
            .then(() => {
                const notification = 'Korisniku je promenjen broj dana provedenih na bolovanju';
                this._notificationService.displayNotification(notification);
            });
    }
}
