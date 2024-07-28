import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ITypeDoc } from '../models/type-doc.model';
import { environment } from '../../environments/environment';
import { IReponseList, IReponseObject } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class TypeDocService {

  private _refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient,
  ) { }

  get(): Observable<IReponseList<ITypeDoc>> {
    const url = `${environment.API_URL}/api/users/getTypeDoc`;
    return this.http.get<IReponseList<ITypeDoc>>(url);
  }

  getById(id: number): Observable<IReponseObject<ITypeDoc>> {
    const url = `${environment.API_URL}/api/typedoc/getById`;
    let params = new HttpParams();
    params = params.append('typeDocId', id);
    return this.http.get<IReponseObject<ITypeDoc>>(url,{params: params});
  }

  create(typeDoc: ITypeDoc): Observable<IReponseObject<ITypeDoc>> {
    const url = `${environment.API_URL}/api/typedoc/create`;
    return this.http.post<IReponseObject<ITypeDoc>>(url, typeDoc).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  update(typeDoc: ITypeDoc): Observable<IReponseObject<ITypeDoc>> {
    const url = `${environment.API_URL}/api/typedoc/update`;
    return this.http.put<IReponseObject<ITypeDoc>>(url, typeDoc).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  delete(adminRolId: number): Observable<IReponseObject<any>> {
    const url = `${environment.API_URL}/api/typedoc/delete/${adminRolId}`;
    return this.http.put<IReponseObject<any>>(url, {}).
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
