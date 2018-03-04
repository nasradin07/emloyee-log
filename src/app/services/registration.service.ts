import { Injectable } from '@angular/core';

// FIREBASE
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';

import { UserService } from './user.service';
import { NotificationService } from './notification.service';

@Injectable()
export class RegistrationService {

  constructor(
    private _database: AngularFireDatabase,
    private _storage: AngularFireStorage,
    private _userService: UserService,
    private _notificationService: NotificationService
  ) { }

  public registerUser(userObj, file) {
    const email = userObj.email;
    const password = userObj.password;
    this._userService.createUser(email, password)
      .then( (user) => {
        const userId = user.uid;
        const userImageRef = this._storage.storage.ref(`images/${userId}`);
        const userRef = this._database.object(`users/${userId}`);
        Promise.all([userRef.set(userObj), userImageRef.put(file)])
          .then(() => {
            const notification = 'Uspesno ste se registrovali';
            this._notificationService.displayNotification(notification);
          })
          .catch(err => {
            const notification = 'Doslo je do greske';
            const error = err.code;
            this._notificationService.displayError(notification, error);
          });
      });
  }

}
