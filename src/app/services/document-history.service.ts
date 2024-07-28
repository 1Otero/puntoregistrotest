import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IReponseList, IReponseObject } from '../models/response.model';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDocumentHistoryComplete, IDocumentHistoryCreated } from '../models/document-history.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentHistoryService {

  private _refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient,
  ) { }

  getByClientIAndEventId(clientId: number, eventId: number):Observable<IReponseList<IDocumentHistoryComplete>>{
    const url = `${environment.API_URL}/api/documenthistory/get`;
    let params = new HttpParams();
    params = params.append('clientId', clientId);
    params = params.append('eventId', eventId);
    return this.http.get<IReponseList<IDocumentHistoryComplete>>(url, {params: params});
  }

  initialCharge(adminUserId: number, clientId: number, eventId:number, file: any):Observable<IReponseObject<IDocumentHistoryCreated>>{
    const url = `${environment.API_URL}/api/file/initialCharge`;
    let formData = new FormData();
    formData.append('file', file);
    formData.append('adminUserId', adminUserId.toString());
    formData.append('clientId', clientId.toString());
    formData.append('eventId', eventId.toString());
    formData.append('isAssambli', '0');
    return this.http.post<IReponseObject<IDocumentHistoryCreated>>(url, formData).
    pipe(
      tap(()=>{
        this._refresh$.next();
      })
    );
  }
  
  validateEventEmptyValid(eventId: number):Observable<IReponseObject<boolean>>{
    const url = `${environment.API_URL}/api/ticketUsers/eventEmptyValid/${eventId}`;
    return this.http.get<IReponseObject<boolean>>(url);
  }


  deleteInitialCharge(eventId: number):Observable<IReponseObject<any>>{
    const url = `${environment.API_URL}/api/ticketUsers/deleteInitialCharge/${eventId}`;
    return this.http.get<IReponseObject<any>>(url);
  }

  get refresh(){
    return this._refresh$;
  }
}
