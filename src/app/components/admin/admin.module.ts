import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import { AdminService } from './services/admin.service';

import { RequestComponent } from './components/request/request.component';
import { AdminComponent } from './admin.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule,
    ],
    exports: [AdminComponent],
    providers: [
        AdminService
    ],
    declarations: [
        RequestComponent,
        AdminComponent
    ]
})

export class AdminModule { }
