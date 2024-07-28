import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestStatus } from 'src/app/models/request-status.model';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {

  keyCaptcha: string = environment.recaptchaSiteKey;
  captchaResolved = false;
  showPassword = false;
  status: RequestStatus = 'init';
  user: IUserAdmin | null = null;
  userRoles: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {}

  form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    captcha: [false, [this.captchaValidator()]]
  });

  captchaValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const captchaValue = control.value;
      if (captchaValue === true) {
        return null;
      } else {
        return { captchaInvalid: true };
      }
    };
  }

  resolved(): void {
    this.captchaResolved = !this.captchaResolved;
    this.form.get('captcha')?.setValue(this.captchaResolved);
  }

  doLogin() {
    if (this.form.valid) {
      this.status = 'loading';
      const { email, password } = this.form.getRawValue();
      this.authService.login(email, password).
        subscribe({
          next: (data) => {
            if(data.payload){
              this.authService.getProfile(data.payload).subscribe({
                next: (data) => {
                  if(data){
                    this.user = data.payload;
                    this.userRoles = this.user.idRol;
                    if (this.userRoles.includes(1)) {
                      this.status = 'success';
                      this.router.navigate(['/punto-registro-operador/cliente']);
                    } else if (this.userRoles.includes(5) || this.userRoles.includes(6)) {
                      this.status = 'success';
                      this.router.navigate(['/punto-registro-operador/codigo']);
                    } else {
                      this.status = 'failed';
                    }
                  }
                },
                error: (error) => {
                  console.error(error);
                  this.status = 'failed';
                }
              })
            }else{
              this.status = 'failed';
            }
          },
          error: () => {
            this.status = 'failed';
          },
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
