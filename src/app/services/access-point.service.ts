import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IReponseList, IReponseObject } from '../models/response.model';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { IAccessPointCreate, IAccessPointTicketData, IAccessPointUser, IAuditoria } from '../models/access-point.model';

@Injectable({
  providedIn: 'root'
})
export class AccessPointService {

  private _refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient,
  ) { }

  getAccessPointTicketByEvent(eventId: number): Observable<IReponseList<IAccessPointTicketData>>{
    const url = `${environment.API_URL}/api/accessPoints/getAccessPointTicketByEvent/${eventId}`;
    return this.http.get<IReponseList<IAccessPointTicketData>>(url);
  }

  save(accesPoint: IAccessPointCreate, adminUserId: number): Observable<IReponseList<any>> {
    const url = `${environment.API_URL}/api/accessPoints/addAccessPoint`;
    return this.http.post<IReponseList<any>>(url, {
      ... accesPoint,
      adminUserId
    });
  }

  getAccessPointUserByUserId(userId: number): Observable<IReponseObject<IAccessPointUser>>{
    const url = `${environment.API_URL}/api/accessPoints/getAccessPointUserByUserId/${userId}`;
    return this.http.get<IReponseObject<IAccessPointUser>>(url);
  }

  getAudit(eventId: number): Observable<IReponseList<IAuditoria>>{
    const url = `${environment.API_URL}/api/auditpuntoregistro/getinfoauditpuntoregistrobyeventid/${eventId}`;
    return this.http.get<IReponseList<IAuditoria>>(url);
  }

  get refresh() {
    return this._refresh$;
  }
}
