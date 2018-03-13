import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// FIREBASE
import { AngularFireAuth } from 'angularfire2/auth';

import { NotificationService } from './notification.service';

@Injectable()
export class LoginService {

  constructor(
    private _auth: AngularFireAuth,
    private _notificationService: NotificationService,
    private _router: Router
  ) { }

  public login(email, password) {
    this._auth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        const notification = 'Uspesno ste se ulogovali';
        this._notificationService.displayNotification(notification);
        this._router.navigateByUrl('');
      })
      .catch(err => {
        const notification = 'Greska';
        const error = err.code;
        this._notificationService.displayError(notification, error);
      });
  }

  public logout() {
    this._auth.auth.signOut();
  }

}
