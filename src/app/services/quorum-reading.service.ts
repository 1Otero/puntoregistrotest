import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { IQuorumReading, IQuorumReadingByUser } from '../models/quorum-reading.model';
import { IReponseList, IReponseObject } from '../models/response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuorumReadingService {

  private _refresh$ = new Subject<void>();
  control$ = new BehaviorSubject<number | null>(null);
  control = this.control$.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  get(eventId: number): Observable<IReponseList<IQuorumReadingByUser>>{
    const url = `${environment.API_URL}/api/quorumreading/allinfoquorumreading`;
    let params = new HttpParams();
    params = params.append('eventId', eventId);
    return this.http.get<IReponseList<IQuorumReadingByUser>>(url, {params: params});
  }

  create(quorumReading: IQuorumReading): Observable<IReponseObject<IQuorumReading>> {
    const url = `${environment.API_URL}/api/quorumreading/create`;
    return this.http.post<IReponseObject<IQuorumReading>>(url, quorumReading).
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
