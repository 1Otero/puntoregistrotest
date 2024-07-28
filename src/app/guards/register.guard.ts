import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterComponent } from '../modules/events/pages/register/register.component';
import { Dialog } from '@angular/cdk/dialog';
import { ConfirmExitComponent } from '../modules/shared/components/confirm-exit/confirm-exit.component';

export interface IDeactiveGuard {
  canExit: () => boolean | Promise<boolean> | Observable<boolean>
}

@Injectable({
  providedIn: 'root'
})
export class RegisterGuard implements CanDeactivate<IDeactiveGuard> {

  constructor(
    private dialog: Dialog,
  ){}

  canDeactivate(
    component: IDeactiveGuard, 
    route: ActivatedRouteSnapshot,
    currentSate: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean | Promise<boolean> {
    // this.dialog.open(ConfirmExitComponent).closed.subscribe(data => {
    //   if(data){
    //     return true;
    //   } else {
    //     return false;
    //   }
    // })
    // return true;
    return component.canExit();
  }
}
