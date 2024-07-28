import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { IReponseList, IReponseObject } from '../models/response.model';
import { IClient, IClientCreate } from '../models/client.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private _refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient,
  ) { }

  get(): Observable<IReponseList<IClient>> {
    const url = `${environment.API_URL}/api/events/getListClient`;
    return this.http.get<IReponseList<IClient>>(url);
  }

  getByUrl(urlClient: string): Observable<IReponseObject<IClient>> {
    const url = `${environment.API_URL}/api/client/getByUrl`;
    let params = new HttpParams();
    params = params.append('url', urlClient);
    return this.http.get<IReponseObject<IClient>>(url, {params: params});
  }

  getEventById(eventId: Number): Observable<IReponseObject<any>> {
    const url = `${environment.API_URL}/api/events/getEvent/${eventId}`;
    return this.http.get<IReponseObject<any>>(url);
  }

  getConfigEventId(eventId: Number): Observable<IReponseObject<any>> {
    const url= `${environment.API_URL}/api/configappevent/getconfigappevent/${eventId}`
    return this.http.get<IReponseObject<any>>(url);
  }

  getById(clientId: number): Observable<IReponseObject<IClient>> {
    const url = `${environment.API_URL}/api/events/getClient/${clientId}`;
    return this.http.get<IReponseObject<IClient>>(url);
  }

  create(client: IClientCreate, adminUserId: number): Observable<IReponseObject<IClient>> {
    const url = `${environment.API_URL}/api/events/createClient`;
    return this.http.post<IReponseObject<IClient>>(url, client).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  update(client: IClientCreate): Observable<IReponseObject<IClient>> {
    const url = `${environment.API_URL}/api/events/updateClient`;
    return this.http.post<IReponseObject<IClient>>(url, client).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  delete(clienteId: number): Observable<IReponseObject<any>> {
    const url = `${environment.API_URL}/api/events/deleClient/${clienteId}`;
    return this.http.put<IReponseList<IClient>>(url, {}).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  desactive(clienteId: number): Observable<IReponseObject<any>> {
    const url = `${environment.API_URL}/api/events/deleLogicalClient/${clienteId}`;
    return this.http.put<IReponseList<IClient>>(url, {}).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  get refresh() {
    return this._refresh$;
  }
}
