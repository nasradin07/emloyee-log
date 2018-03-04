import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// FIREBASE
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';

// ROUTES
import { appRoutes } from './app.routing';

// SERVICES
import { ReportService } from './services/report.service';
import { RegistrationService } from './services/registration.service';
import { LoginService } from './services/login.service';
import { UserService } from './services/user.service';
import { RequestService } from './services/request.service';
import { ValidateService } from './services/validate.service';
import { AdminService } from './services/admin.service';
import { NotificationService } from './services/notification.service';
import { UpdateService } from './services/update.service';
import { NotificationFirebaseService } from './services/notification-firebase.service';

// COMPONENTS
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './components/home/home.component';
import { CreateProfileComponent } from './components/create-profile/create-profile.component';
import { CreateReportComponent } from './components/create-report/create-report.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { VacationComponent } from './components/vacation/vacation.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    CreateProfileComponent,
    CreateReportComponent,
    EditProfileComponent,
    VacationComponent,
    LoginComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    RegistrationService,
    ReportService,
    LoginService,
    UserService,
    RequestService,
    ValidateService,
    AdminService,
    NotificationService,
    UpdateService,
    NotificationFirebaseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
