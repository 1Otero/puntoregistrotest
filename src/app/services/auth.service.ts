import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IReponseObject } from '../models/response.model';
import { IUserAdmin } from '../models/user-admin.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$ = new BehaviorSubject<IUserAdmin | null>(null);
  user = this.user$.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) { }

  login(email: string, password: string) {
    const url = `${environment.API_URL}/api/adminUsers/loginAdminuserexternal`;
    return this.http.post<IReponseObject<string>>(url, {
      email,
      password
    }).
      pipe(
        tap(response => {
          if(response.status === 'success'){
            this.tokenService.saveToken(response.payload);
          }
        })
      );
  }

  getProfile(token: string): Observable<IReponseObject<IUserAdmin>> {
    const url = `${environment.API_URL}/api/adminUsers/token/${token}`;
    return this.http.get<IReponseObject<IUserAdmin>>(url);
  }

  register(userAdmin: IUserAdmin, token: number): Observable<IReponseObject<IUserAdmin>> {
    const url = `${environment.API_URL}/api/adminUsers/createexternaladminuserPe/${token}`;
    return this.http.post<IReponseObject<IUserAdmin>>(url, userAdmin);
  }

  sendTokenEmail(email: string): Observable<IReponseObject<any>> {
    const url = `${environment.API_URL}/api/email/envianewtokenpass`;
    return this.http.post<IReponseObject<any>>(url, {
      email
    });
  }

  changePassword(token: number, newpass: string, verifypass: string): Observable<IReponseObject<any>> {
    const url = `${environment.API_URL}/api/adminUsers/changepass`;
    return this.http.post<IReponseObject<any>>(url, {
      token,
      newpass,
      verifypass
    });
  }

  notifyfrontconnectforquorum(eventId: number): Observable<IReponseObject<any>>{
    const url = `${environment.API_URL}/api/events/notifyfrontconnectforquorum/${eventId}`;
    return this.http.get<IReponseObject<any>>(url);
  }

  sendToken(email: string): Observable<IReponseObject<any>>{
    const url = `${environment.API_URL}/api/email/creationuser`;
    return this.http.post<IReponseObject<any>>(url, {
      email
    });
  }

}
