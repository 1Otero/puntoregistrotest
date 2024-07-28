import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestStatus } from '../../../../models/request-status.model';
import { AuthService } from '../../../../services/auth.service';
import { CustomValidators } from '../../../../utils/validators';
import { IUserAdmin } from '../../../../models/user-admin.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {

  status: RequestStatus = 'init';
  statusUsers: RequestStatus = 'init';
  showPassword = false;
  showRegister = false;
  userAdmin: IUserAdmin = {
    adminUserId: 0,
    name: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    country: '',
    city: '',
    createDate: new Date(),
    modifiedDate: new Date(),
    modifiedUserId: 0,
    idRol: []
  };
  @Output() onUserAdmin = new EventEmitter<IUserAdmin>();
  captchaResolved = false;
  keyCaptcha: string = environment.recaptchaSiteKey;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    phone: ['', [Validators.required]],
    password: ['', [Validators.minLength(6), Validators.required]],
    confirmPassword: ['', [Validators.required]],
    captcha: [false, [this.captchaValidator()]]
  }, {
    validators: [CustomValidators.MatchValidator('password', 'confirmPassword')]
  });

  register() {
    if (this.form.valid) {
      this.status = 'loading';
      const { name, email, phone, password } = this.form.getRawValue();
      this.userAdmin = {
        ... this.userAdmin,
        name: name,
        email: email,
        phoneNumber: phone,
        password: password,
      }
      this.authService.sendToken(this.userAdmin.email).subscribe({
        next: (data) => {
          if (data) {
            this.status = 'success';
            this.onUserAdmin.emit(this.userAdmin);
          }
        },
        error: () => {
          this.status = 'failed';
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
  }

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

}
