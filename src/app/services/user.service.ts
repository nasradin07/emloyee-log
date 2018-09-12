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
    private subscription: any = null;
    private _userLoggedInSubject = new Subject();
    public userLoggedInEvent$ = this._userLoggedInSubject.asObservable();

    private _userDataSubject = new Subject();
    public userDataFetchEvent$ = this._userDataSubject.asObservable();
    constructor(
        private _auth: AngularFireAuth,
        private _database: AngularFireDatabase,
        private _storage: AngularFireStorage
    ) {    }

    public listenUserStateChange() {
        this._auth.auth.onAuthStateChanged( user => {
            if (user) {
                this._user = user;
                this._getUserData();
                this._notifyOfUserStateChange(true);
            } else {
                if (this.subscription)
                    this.subscription.unsubscribe();
                this._user = null;
                this._userData = null;
                this._notifyOfUserStateChange(false);
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
        this.subscription = this._database.object(`users/${userId}`).valueChanges()
            .subscribe( userData => {
                this._userData = userData;
                this._notifyOfUserDataFetchEvent(true);
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
    public getUserSickDays() {
        return this._userData.sickDays;
    }
    public getUserName() {
        return `${this._userData.name} ${this._userData.lastname}`;
    }

    public getUserDaysOff() {
        return this._userData.daysOff;
    }

    public getUserPosition() {
        return this._userData.position;
    }

    public getUserPassword() {
        return this._userData.password;
    }

    private _notifyOfUserStateChange(param) {
        this._userLoggedInSubject.next(param);
    }

    private _notifyOfUserDataFetchEvent(param) {
        this._userDataSubject.next(param);
    }
}
