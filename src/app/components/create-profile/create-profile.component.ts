import { Component, OnInit } from '@angular/core';

import { RegistrationService } from '../../services/registration.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {
  userObj: any = {
    name: null,
    lastname: null,
    address: null,
    email: null,
    number: null,
    jmbg: null,
    position: null,
    password: null,
    daysOff: 25
  };
  test;
  url: any = '../../../assets/img/emptyprofile.png';
  file: File;
  constructor(
    private _registrationService: RegistrationService
  ) { }

  push(param) {console.log(param); }

  ngOnInit() {
  }

  public registerUser() {
    this._registrationService.registerUser(this.userObj, this.file);
  }

  public getFile(event) {
    const that = this;
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = function(e: any) {
        that.url = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }


}
