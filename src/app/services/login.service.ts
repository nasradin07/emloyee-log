import { Injectable } from '@angular/core';

// FIREBASE
import { AngularFireAuth } from 'angularfire2/auth';

import { NotificationService } from './notification.service';

@Injectable()
export class LoginService {

  constructor(
    private _auth: AngularFireAuth,
    private _notificationService: NotificationService
  ) { }

  public login(email, password) {
    this._auth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        const notification = 'Uspesno ste se ulogovali';
        this._notificationService.displayNotification(notification);
      })
      .catch(err => console.log(err));
  }

  public logout() {
    this._auth.auth.signOut();
  }

}
