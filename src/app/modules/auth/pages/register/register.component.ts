import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RequestStatus } from 'src/app/models/request-status.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  
  status: RequestStatus = 'init';
  @ViewChild('stepper') stepper!: MatStepper;
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
    idRol: [6]
  };

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ){}

  onNextAdmin(userAdmin: IUserAdmin){
    this.userAdmin = {
      ... userAdmin,
      idRol: [6]
    };
    this.stepper.next();
  }

  register(token: number){
    this.status = 'loading';
    this.authService.register(this.userAdmin, token).subscribe({
      next: (data) => {
        if(data.status === 'success'){
          this.status = 'success';
          this.toastrService.success('Registrado correctamente');
          this.router.navigate(['auth/login']);
        } else {
          this.status = 'failed';
          this.toastrService.info(data.errorMessage.message);
        }
      },
      error: () => {
        this.status = 'failed';
      }
    })
  }

}
