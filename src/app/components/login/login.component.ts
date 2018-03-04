import { Component, OnInit } from '@angular/core';

import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  constructor(
    private _loginService: LoginService
  ) { }

  ngOnInit() {
  }

  public login() {
    this._loginService.login(this.email, this.password);
  }

}
