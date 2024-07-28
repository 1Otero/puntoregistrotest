import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.authService.user.subscribe(data => {
      if (data) {
        const requiredRoles = route.data['requiredRoles'] as number[];
        const roles = data?.idRol;
        if (this.hasRequiredRoles(roles ? roles : [], requiredRoles)) {
          return true;
        } else {
          return this.router.navigate(['/punto-registro-operador/codigo']);
        }
      }
      return true;
    })
    return true;
  }

  private hasRequiredRoles(userRoles: number[], requiredRoles: number[]): boolean {
    return requiredRoles.some(role => userRoles.includes(role));
  }

}
