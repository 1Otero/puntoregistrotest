import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RecaptchaModule } from "ng-recaptcha";
import { MatStepperModule } from '@angular/material/stepper';

import { LoginComponent } from './pages/login/login.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SharedModule } from '../shared/shared.module';
import { RecoveryComponent } from './pages/recovery/recovery.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password-form.component';
import { RecoveryFormComponent } from './components/recovery-form/recovery-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { RegisterTokenFormComponent } from './components/register-token-form/register-token-form.component';


@NgModule({
  declarations: [
    LoginComponent,
    LoginFormComponent,
    RecoveryComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ForgotPasswordFormComponent,
    RecoveryFormComponent,
    RegisterFormComponent,
    RegisterTokenFormComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    SharedModule,
    RecaptchaModule,
    MatStepperModule
  ]
})
export class AuthModule { }
