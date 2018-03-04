import { Component, OnInit } from '@angular/core';

import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css']
})
export class CreateReportComponent implements OnInit {
  reportObj: any = {
    currentProject: null,
    date: null,
    email: null,
    assessment: null,
    communication: null,
    dislike: null,
    like: null,
    imporve: null
  };
  constructor(
    private _reportService: ReportService
  ) { }

  ngOnInit() {
  }

  public sendReport() {
    this._reportService.sendReportToDatabase(this.reportObj);
  }

}
