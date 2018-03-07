import {RouterModule, Routes} from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { CreateProfileComponent } from './components/create-profile/create-profile.component';
import { CreateReportComponent } from './components/create-report/create-report.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { VacationComponent } from './components/vacation/vacation.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { ViewReportComponent } from './components/view-report/view-report.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'kreiranje-profila',
        component: CreateProfileComponent
    },
    {
        path: 'izvestaj',
        component: CreateReportComponent
    },
    {
        path: 'editovanje-profila',
        component: EditProfileComponent
    },
    {
        path: 'odmor',
        component: VacationComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: 'vidi-izvestaj',
        component: ViewReportComponent
    },
    {
        path: '**',
        component: HomeComponent
    }
];

