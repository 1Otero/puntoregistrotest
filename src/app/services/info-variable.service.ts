import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { IReponseList, IReponseObject } from '../models/response.model';
import { IClient } from '../models/client.model';
import { IConfigRegistrationPoint } from '../models/event.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InfoVariableService {

  private _refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient,
  ) { }


  create(client: IConfigRegistrationPoint): Observable<IReponseObject<IConfigRegistrationPoint>> {
    const url = `${environment.API_URL}/api/configPre/create`;
    return this.http.post<IReponseObject<IConfigRegistrationPoint>>(url, client).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  update(client: IConfigRegistrationPoint): Observable<IReponseObject<IConfigRegistrationPoint>> {
    const url = `${environment.API_URL}/api/configPre/update`;
    return this.http.put<IReponseObject<IConfigRegistrationPoint>>(url, client).
    pipe(
      tap(() => {
        this._refresh$.next();
      })
    );
  }

  delete(configId: number): Observable<IReponseObject<IConfigRegistrationPoint>> {
    const url = `${environment.API_URL}/api/configPre/delete/${configId}`;
    return this.http.delete<IReponseObject<IConfigRegistrationPoint>>(url, {}).
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
