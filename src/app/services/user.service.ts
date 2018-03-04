import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

// FIREBASE
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable()

export class UserService {
    private _user: any = null;
    private _userData: any = null;
    private _userLoggedInSubject = new Subject();
    public userLoggedInEvent$ = this._userLoggedInSubject.asObservable();
    constructor(
        private _auth: AngularFireAuth,
        private _database: AngularFireDatabase,
        private _storage: AngularFireStorage
    ) {    }

    public createUser(email, password) {
        return this._auth.auth.createUserWithEmailAndPassword(email, password);
    }

    public listenUserStateChange() {
        this._auth.auth.onAuthStateChanged( user => {
            console.log('user state changed');
            if (user) {
                this._user = user;
                this._getUserData();
                this._sendNotification(true);
            } else {
                this._user = null;
                this._userData = null;
                this._sendNotification(false);
            }
        });
    }

    public getUserData() {
        return this._userData;
    }

    public getUserImageUrl() {
        const userId = this.getUserId();
        const imageRef = this._storage.ref(`images/${userId}`);
        const imageUrl = imageRef.getDownloadURL();
        return imageUrl;
    }

    private _getUserData() {
        const userId = this.getUserId();
        this._database.object(`users/${userId}`).valueChanges()
            .subscribe( userData => {
                this._userData = userData;
            });
    }

    public getUserEmail() {
        return this._userData.email;
    }

    public getUserId() {
        if (this._user !== null) {
        return this._user.uid;
        } else {
            return false;
        }
    }

    public getUserName() {
        return `${this._userData.name} ${this._userData.lastname}`;
    }

    public getUserDaysOff() {
        return this._userData.daysOff;
    }

    private _sendNotification(param) {
        this._userLoggedInSubject.next(param);
    }
}
