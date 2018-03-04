import { Injectable } from '@angular/core';

declare const Materialize: any;

@Injectable()

export class NotificationService {
    constructor() {

    }

    public displayError(notification, error) {
        Materialize.toast(notification);
        Materialize.toast(error);
    }

    public displayNotification(notification) {
        Materialize.toast(notification, 3000);
    }
}
