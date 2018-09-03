import { Injectable } from '@angular/core';

declare const Materialize: any;

@Injectable()

export class NotificationService {
    constructor() {

    }

    public displayError(notification, error) {
        console.trace();;
        Materialize.toast(`${notification}: ${error}`, 3000);
    }

    public displayNotification(notification) {
        Materialize.toast(notification, 3000);
    }
}
