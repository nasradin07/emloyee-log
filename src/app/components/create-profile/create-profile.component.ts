import { Component, OnInit } from '@angular/core';

import { RegistrationService } from '../../services/registration.service';
import { ValidateService } from '../../services/validate.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {
  isNameValid = true;
  isLastnameValid = true;
  isAddressValid = true;
  isEmailValid = true;
  isNumberValid = true;
  isJMBGValid = true;
  isPositionValid = true;
  isPasswordValid = true;
  invalidInput = false;
  user = {
    gender: ''
  };
  userInputObj: any = {
    name: '',
    lastname: '',
    address: '',
    email: '',
    number: '',
    jmbg: '',
    position: '',
    password: '',
  };
  url: any = '../../../assets/img/emptyprofile.png';
  file: File = null;
  constructor(
    private _registrationService: RegistrationService,
    private _validateService: ValidateService
  ) { }

  ngOnInit() {
  }

  public registerUser() {
    const isUserRegisterInputValid = this.isUserRegisterInputValid(this.userInputObj);
    if (isUserRegisterInputValid === false || this.file === null) {
      this.invalidInput = true;
      return;
    } else {
      this.invalidInput = false;
    }
    const userObj = this.createUserObj(this.userInputObj);
    this._registrationService.registerUser(userObj, this.file);
  }

  public createUserObj(userInput) {
    const userObj = {};
    Object.keys(userInput).forEach(key => {
      if (key === 'position') {
        const position = [];
        userInput[key].split(',').forEach(pos => position.push(pos.trim()));
        userObj[key] = position;
      } else {
        userObj[key] = userInput[key].trim();
      }
    });
    userObj['daysOff'] = 25;
    userObj['sickDays'] = 0;
    return userObj;
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

  public validateName() {
    this.isNameValid = this._validateService.validateName(this.userInputObj.name);
  }

  public validateLastname() {
    this.isLastnameValid = this._validateService.validateName(this.userInputObj.lastname);
  }

  public validateAddress() {
    this.isAddressValid = this._validateService.validateAddress(this.userInputObj.address);
  }

  public validateEmail() {
    this.isEmailValid = this._validateService.validateEmail(this.userInputObj.email);
  }

  public validateNumber() {
    this.isNumberValid = this._validateService.validatePhoneNumber(this.userInputObj.number);
  }

  public validateJMBG() {
    this.isJMBGValid = this._validateService.validateJmbg(this.userInputObj.jmbg);
  }

  public validatePosition() {
    this.isPositionValid = this._validateService.validatePosition(this.userInputObj.position);
  }

  public validatePassword() {
    this.isPasswordValid = this._validateService.validatePassword(this.userInputObj.password);
  }

  public isUserRegisterInputValid(userInput) {
    return this._validateService.validateUserRegistrationInput(userInput);
  }


}
