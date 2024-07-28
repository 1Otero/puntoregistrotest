import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { IUserAdmin } from '../models/user-admin.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectInitialGuard implements CanActivate {
  
  user: IUserAdmin | null = null;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate() {
    const isValidToken = this.tokenService.isValidToken();
    const token = this.tokenService.getToken();
    if(token){
      this.authService.getProfile(token).subscribe(user => {
        this.user = user.payload;
        if (isValidToken) {
          this.router.navigate(['/punto-registro-operador/codigo']);
        }
      });
    }
    return true;
  }
}
