import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { NotificationFirebaseService } from '../../services/notification-firebase.service';
import { UserService } from '../../services/user.service';

declare const Materialize: any;
declare const $: any;

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];
  notifications: any = [];
  buttonClasses = {
    red: false,
    pulse: false
  };
  constructor(
    private _notificationFirebaseService: NotificationFirebaseService,
    private _userService: UserService
  ) { }

  ngOnInit() {
    this._subscribeToUserLoginEvent();
    this._subscribeToNotificationsFetchEvent();
  }

  private _subscribeToNotificationsFetchEvent() {
    this._subscriptions.push(
      this._notificationFirebaseService.notificationsFetchEvent$.subscribe(
        notifications => {
          this.notifications = notifications;
          const param = this.notifications.length > 0 ? true : false;
          this.toggleButtonClass(param);
        },
        err => console.log(err)
      )
    );
  }

  private _subscribeToUserLoginEvent() {
    this._subscriptions.push(
      this._userService.userLoggedInEvent$.subscribe(
        param => {
          if (param === true) {
            this.getNotifications();
          }
        }
      )
    );
  }

  public removeNotifications() {
    this.notifications = [];
  }

  public getNotifications() {
    const userId = this.getUserId();
    this._notificationFirebaseService.getNotifications(userId);
  }

  public getUserId() {
    return this._userService.getUserId();
  }

  public deleteNotification(notificationKey) {
    const userId = this._userService.getUserId();
    this._notificationFirebaseService.deleteNotification(userId, notificationKey);
    this.removeNotificationFromComponent(notificationKey);
  }

  public toggleButtonClass(param) {
    this.buttonClasses.red = param;
    this.buttonClasses.pulse = param;
  }

  public removeNotificationFromComponent(notificationKey) {
    if (this.notifications.length === 1) {
      this.notifications = [];
    }
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
