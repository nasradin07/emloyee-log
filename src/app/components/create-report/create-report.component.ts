import { Component, OnInit } from '@angular/core';

import { ReportService } from '../../services/report.service';
import { ValidateService } from '../../services/validate.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css']
})
export class CreateReportComponent implements OnInit {
  reportObj: any = {
    currentProject: null,
    assessment: null,
    communication: null,
    dislike: null,
    like: null,
    imporve: null
  };
  isCurrentProjectValid = true;
  isAssessmentValid = true;
  isCommunicationValid = true;
  isDislikeValid = true;
  isLikeValid = true;
  isImproveValid = true;
  constructor(
    private _reportService: ReportService,
    private _validateService: ValidateService,
    private _notificationService: NotificationService
  ) { }

  ngOnInit() {
  }

  public sendReport() {
    const isInputValid = this.isUserReportObjValid();
    if (isInputValid === true) {
      this._reportService.sendReportToDatabase(this.reportObj);
    } else {
      const notification = 'Morate da popunite sva polja da biste poslali izvestaj';
      this._notificationService.displayNotification(notification);
    }
  }

  public isUserReportObjValid() {
    return this._validateService.validateReportObj(this.reportObj);
  }

  public validateCurrentProject() {
    this.isCurrentProjectValid = this._validateService.validateUserReportInput(this.reportObj.currentProject);
  }

  public validateAssessment() {
    this.isAssessmentValid = this._validateService.validateUserReportInput(this.reportObj.assessment);
  }

  public validateCommunication() {
    this.isCommunicationValid = this._validateService.validateUserReportInput(this.reportObj.communication);
  }

  public validateDislike() {
    this.isDislikeValid = this._validateService.validateUserReportInput(this.reportObj.dislike);
  }

  public validateLike() {
    this.isLikeValid = this._validateService.validateUserReportInput(this.reportObj.like);
  }

  public validateImprove() {
    this.isImproveValid = this._validateService.validateUserReportInput(this.reportObj.imporve);
  }

}
