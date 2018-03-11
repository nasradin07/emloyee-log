import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import { LoginService } from '../services/login.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userLoggedIn: any = false;
  isUserAdmin = false;
  private _subscriptions: Subscription[] = [];
  constructor(
    private _loginService: LoginService,
    private _userService: UserService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._subscribeToUserLoginEvent();
    this._subscribeToUserDataFetchEvent();
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

  private _subscribeToUserDataFetchEvent() {
    this._subscriptions.push(
      this._userService.userDataFetchEvent$.subscribe(
        notification => {
          if (notification === true) {
            this.getUserPosition();
          }
        }
      )
    );
  }

  public getUserPosition() {
    const positions = this._userService.getUserPosition();
    const isUserAdmin = positions.findIndex(position => {
      return position.trim() === 'admin';
    });
    if (isUserAdmin !== -1) {
      this.showAdminPage();
    } else {
      this.hideAdminPage();
    }
  }

  public showAdminPage() {
    this.isUserAdmin = true;
  }

  public hideAdminPage() {
    this.isUserAdmin = false;
  }

  logout() {
    this._loginService.logout();
    this._router.navigateByUrl('/login');
  }

  ngOnDestroy() {
    this._subscriptions.forEach( subscription => subscription.unsubscribe());
  }

}
