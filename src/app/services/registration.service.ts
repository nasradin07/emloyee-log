import { Injectable } from '@angular/core';

// FIREBASE
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';

import { UserService } from './user.service';
import { NotificationService } from './notification.service';
import { RequestService } from './request.service';
import { NotificationFirebaseService } from './notification-firebase.service';

@Injectable()
export class RegistrationService {

  constructor(
    private _database: AngularFireDatabase,
    private _storage: AngularFireStorage,
    private _userService: UserService,
    private _notificationService: NotificationService,
    private _requestService: RequestService,
    private _notificationFirebaseService: NotificationFirebaseService
  ) { }

  public registerUser(userId, userObj) {
    const userRef = this._database.object(`users/${userId}`);
    userRef.set(userObj)
      .catch(err => {
        const error = err.code;
        this._notificationService.displayError('Doslo je do greske', error);
      });
  }

  public deleteUser(userId) {
    this._database.object(`users/${userId}`).remove()
      .then(() => {
        const notification = 'Korisnik je obrisan iz baze';
        this._notificationService.displayNotification(notification);
      }).catch(err => {
        const notification = 'Doslo je do greske prilikom brisanja korisnika';
        const error = err.code;
        this._notificationService.displayError(notification, error);
      });
  }

  public saveUserImage(file, picturePath) {
    const pictureRef = this._storage.upload(picturePath, file);
  }

}
