import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RequestStatus } from '../../../../models/request-status.model';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss']
})
export class ForgotPasswordFormComponent {

  form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
  });
  status: RequestStatus = 'init';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService,
  ) { }

  sendLink() {
    if (this.form.valid) {
      this.status = 'loading';
      const { email } = this.form.getRawValue();
      this.authService.sendTokenEmail(email).
      subscribe({
        next: (data) => {
          console.log(data)
          if(data){
            this.status = 'success';
            this.toastrService.success('Token enviado correctamente');
            this.router.navigate(['auth/recuperar']);
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


}
