import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LoginService } from '../services/login.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userLoggedIn: any = false;
  private _subscriptions: Subscription[] = [];
  constructor(
    private _loginService: LoginService,
    private _userService: UserService
  ) { }

  ngOnInit() {
    this._subscribeToUserLoginEvent();
    this._userService.listenUserStateChange();
  }

  private _subscribeToUserLoginEvent() {
    this._subscriptions.push(
      this._userService.userLoggedInEvent$.subscribe(
        notification => {
          this.userLoggedIn = notification;
        }
      )
    );
  }

  logout() {
    this._loginService.logout();
  }

  ngOnDestroy() {
    this._subscriptions.forEach( subscription => subscription.unsubscribe());
  }

}
