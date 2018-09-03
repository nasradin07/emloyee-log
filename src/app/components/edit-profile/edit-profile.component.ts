import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { UpdateService } from '../../services/update.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  address: any = null;
  email: any = null;
  number: any = null;
  position: any = null;
  password: any = null;

  userIsLoggedIn = false;
  imageUrl: any = '../../../assets/img/emptyprofile.png';
  file: any;

  constructor(
    private _userService: UserService,
    private _updateService: UpdateService,
    private _notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.getUserData();
  }

  changeAddress() {
    const updateObj = { address: this.address };
    this.updateUserProfile(updateObj);
  }

  changeEmail() {
    const updateObj = { email: this.email };
    this.updateUserProfile(updateObj);
  }

  changePosition() {
  const updateObj = { position: this.position };
  this.updateUserProfile(updateObj);
}

  changePassword() {
    const newPassword = this.password;
    this._updateService.updateUserPassword(newPassword);
  }

  changeNumber() {
    const updateObj = { number: this.number };
    this.updateUserProfile(updateObj);
  }

  changeProfilePicture() {
    this._updateService.updateUserImage(this.file);
  }

  public getFile(event) {
    const that = this;
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = function(e: any) {
        that.imageUrl = e.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  public updateUserProfile(updateObj) {
    this._updateService.updateUserProfile(updateObj);
  }

  public getUserData() {
    const userObj = this._userService.getUserData();
    this.displayUserData(userObj);
    this._userService.getUserImageUrl().subscribe(
      imageUrl => {
        this.imageUrl = imageUrl;
      },
      err => {
        this.handleImageError(err);
      }
    );
    if (userObj === null) {
      this.userIsLoggedIn = false;
    } else {
      this.userIsLoggedIn = true;
    }
  }

  public displayUserData(userObj) {
    if (userObj === null) {
      return;
    }
    this.address = userObj.address;
    this.position = userObj.position;
    this.email = userObj.email;
    this.number = userObj.number;
    this.password = userObj.password;
  }

  public handleImageError(error) {
    let notification;
    if(error.code.indexOf('object-not-found')) {
      notification = 'Nemate sliku. Molimo da izaberete sliku.'
    }
    else notification = 'Doslo je do greske. Vasa profilna slika ne moze biti prikazana';
    this._notificationService.displayNotification(notification);
  }

}
