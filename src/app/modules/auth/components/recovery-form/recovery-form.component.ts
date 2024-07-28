import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../../../utils/validators';
import { RequestStatus } from '../../../../models/request-status.model';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recovery-form',
  templateUrl: './recovery-form.component.html',
  styleUrls: ['./recovery-form.component.scss']
})
export class RecoveryFormComponent {

  form = this.formBuilder.nonNullable.group(
    {
      token: ['', [Validators.required]],
      newPassword: ['', [Validators.minLength(6), Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [
        CustomValidators.MatchValidator('newPassword', 'confirmPassword'),
      ],
    }
  );
  status: RequestStatus = 'init';
  showPassword = false;
  token = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService,
    ) {}

  recovery() {
    console.log(this.form)
    if (this.form.valid) {
      this.status = 'loading';
      const { token, newPassword, confirmPassword} = this.form.getRawValue();
      this.authService.changePassword(Number(token), newPassword, confirmPassword).subscribe(
        {
          next: (data) => {
            if(data.status === 'success'){
              this.status = 'success';
              this.toastrService.success('Contraseña actualizada correctamente');
              this.router.navigate(['auth/login']);
            }else{
              this.status = 'failed';
            }
          },
          error: (error) => {
            console.log(error);
            this.status = 'failed';
          }
        }
      );
    } else {
      this.form.markAllAsTouched();
    }
  }
  
}
