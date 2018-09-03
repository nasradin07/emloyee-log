import { Component, OnInit } from '@angular/core';

import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string;
  password: string;
  constructor(
    private _loginService: LoginService
  ) { }

  public login() {
    this._loginService.login(this.email, this.password);
  }

}
