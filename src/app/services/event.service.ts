import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAdminChart, IClientRoles, IConfig, ICreateEvent, IDataQuorum, IEvent, IEventConfig, IInfoQuorum, IQuorum, IQuorumByTime, IQuorumCreate, IUpdateEvent, InfoEvent } from '../models/event.model';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { IReponseList, IReponseObject } from '../models/response.model';
import { environment } from '../../environments/environment';
import { IDocumentHistory, IDocumentHistoryComplete, IDocumentHistoryCreated } from '../models/document-history.model';
import { ITicket } from '../models/ticket.model';
import { IAssistantData, IAssistantDataWithTickets, IUserAssistant } from '../models/assistant.model';
import { IControl, IControlUser } from '../models/control.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private _refresh$ = new Subject<void>();
  event$ = new BehaviorSubject<IEventConfig | null>(null);
  event = this.event$.asObservable();
  quorum$ = new BehaviorSubject<IDataQuorum | null>(null);
  quorum = this.quorum$.asObservable();
  infoEvent$ = new BehaviorSubject<InfoEvent | null>(null);
  infoEvent = this.infoEvent$.asObservable();
  tickets$ = new BehaviorSubject<ITicket[] | null>(null);
  tickets = this.tickets$.asObservable();
  assistants$ = new BehaviorSubject<IAssistantDataWithTickets[] | null>(null);
  assistants = this.assistants$.asObservable();
  documentHistory$ = new BehaviorSubject<IDocumentHistoryComplete[] | null>(null);
  documentHistory = this.documentHistory$.asObservable();
  roles$ = new BehaviorSubject<IClientRoles[] | null>(null);
  roles = this.roles$.asObservable();

  // infoEvent$ = new BehaviorSubject<InfoEvent | null>(null);
  // infoEvent = this.infoEvent$.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  getByAdminUser(adminUserId: number): Observable<IReponseList<IEvent>> {
    const url = `${environment.API_URL}/api/adminuserevent/getallevents/${adminUserId}`;
    return this.http.get<IReponseList<IEvent>>(url);
  }

  getById(eventId: number): Observable<IReponseObject<IEvent>> {
    const url = `${environment.API_URL}/api/events/getEvent/${eventId}`;
    return this.http.get<IReponseObject<IEvent>>(url);
  }

  save(event: ICreateEvent): Observable<IReponseObject<IEvent>> {
    const url = `${environment.API_URL}/api/events/duplicate`;
    return this.http.post<IReponseObject<IEvent>>(url, event).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  create(event: ICreateEvent): Observable<IReponseObject<IEvent>> {
    const url = `${environment.API_URL}/api/events/event`;
    return this.http.post<IReponseObject<IEvent>>(url, event).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  updateEvent(event: IUpdateEvent): Observable<IReponseObject<IEvent>> {
    const url = `${environment.API_URL}/api/events/updateevent`;
    return this.http.post<IReponseObject<IEvent>>(url, event).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  getByClientId(clientId: number): Observable<IReponseList<IEventConfig>> {
    const url = `${environment.API_URL}/api/events/getEventsWithConfig/${clientId}`;
    return this.http.get<IReponseList<IEventConfig>>(url);
  }

  initialCharge(adminUserId: number, clientId: number, eventId: number, file: any): Observable<IReponseObject<IDocumentHistoryCreated>> {
    const url = `${environment.API_URL}/api/file/initialCharge`;
    const isAssambli = 1;
    let formData = new FormData();
    formData.append('file', file);
    formData.append('adminUserId', adminUserId.toString());
    formData.append('clientId', clientId.toString());
    formData.append('eventId', eventId.toString());
    formData.append('isAssambli', isAssambli.toString());
    return this.http.post<IReponseObject<IDocumentHistoryCreated>>(url, formData);
  }

  delete(eventId: number): Observable<IReponseObject<IEvent>> {
    const url = `${environment.API_URL}/api/events/deletelogicevent/${eventId}`;
    return this.http.delete<IReponseObject<IEvent>>(url).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  getByCode(code: number): Observable<IReponseObject<IEventConfig>> {
    const url = `${environment.API_URL}/api/events/geteventbycodevent/${code}`;
    return this.http.get<IReponseObject<IEventConfig>>(url);
  }

  validateEventId(userId: number, eventId: number): Observable<IReponseObject<boolean>> {
    const url = `${environment.API_URL}/api/events/permissionsbyeventandadminuser/${eventId}/${userId}`;
    return this.http.get<IReponseObject<boolean>>(url);
  }

  getquorumrelacion(eventId: number): Observable<IReponseList<IInfoQuorum>> {
    const url = `${environment.API_URL}/api/events/getquorumrelacion/${eventId}`;
    return this.http.get<IReponseList<IInfoQuorum>>(url);
  }

  getQuorum(eventId: number): Observable<IReponseObject<IDataQuorum>> {
    const url = `${environment.API_URL}/api/events/getquorum/${eventId}`;
    return this.http.get<IReponseObject<IDataQuorum>>(url);
  }

  getInfoEvent(eventId: number, clientId: number): Observable<IReponseObject<InfoEvent>> {
    const url = `${environment.API_URL}/api/events/getticketandpoderesandpersona/${eventId}/${clientId}`;
    return this.http.get<IReponseObject<InfoEvent>>(url);
  }

  updateConfigEvent(confEvent: IConfig): Observable<IReponseObject<IConfig>> {
    const url = `${environment.API_URL}/api/configregistrationpoint/update`;
    return this.http.put<IReponseObject<IConfig>>(url, confEvent);
  }

  createConfigEvent(confEvent: IConfig): Observable<IReponseObject<IConfig>> {
    const url = `${environment.API_URL}/api/configregistrationpoint/create`;
    return this.http.post<IReponseObject<IConfig>>(url, confEvent).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  getInfoVariable(eventId: number, type: string): Observable<IReponseList<any>> {
    const url = `${environment.API_URL}/api/configPre/getByEventType`;
    return this.http.post<IReponseList<any>>(url,
      {
        eventId,
        type
      }
    );
  }

  getRolesByCliente(clientId: number): Observable<IReponseList<IClientRoles>> {
    const url = `${environment.API_URL}/api/clientRoles/getRoles/${clientId}`;
    return this.http.get<IReponseList<IClientRoles>>(url);
  }

  updatesControls(): Observable<IReponseList<any>> {
    const url = `${environment.API_URL}/api/voteOffline/updateVoteofflines`;
    return this.http.post<IReponseList<any>>(url, {});
  }

  updateVoteOffline(control: IControl): Observable<IReponseList<any>> {
    const url = `${environment.API_URL}/api/voteOffline/updateVoteOffline`;
    return this.http.post<IReponseList<any>>(url, control);
  }

  getControlsByEvent(eventId: number): Observable<IReponseList<IControlUser>> {
    const url = `${environment.API_URL}/api/voteOffline/getVoteOffline`;
    return this.http.get<IReponseList<IControlUser>>(url);
  }

  createControl(control: IControl): Observable<IReponseObject<IControl>> {
    const url = `${environment.API_URL}/api/voteOffline/voteOffline`;
    return this.http.post<IReponseObject<IControl>>(url, control);
  }

  assingControlToEvent(controlsIds: number[], eventId: number): Observable<IReponseObject<any>> {
    const url = `${environment.API_URL}/api/voteOffline/assignRangeControlByEvent`;
    return this.http.post<IReponseObject<IControl>>(url, {
      voteOfflineIds: controlsIds,
      eventId
    });
  }

  eventEmptyValid(eventId: number): Observable<IReponseObject<boolean>> {
    const url = `${environment.API_URL}/api/ticketUsers/eventEmptyValid/${eventId}`;
    return this.http.get<IReponseObject<boolean>>(url);
  }

  saveChartQuorum(quorum: IQuorumCreate) {
    const url = `${environment.API_URL}/api/quorum/create`;
    return this.http.post<IReponseObject<boolean>>(url, quorum);
  }

  getQuorumChart(eventId: number): Observable<IReponseObject<IQuorumByTime>> {
    const url = `${environment.API_URL}/api/quorum/getChart/${eventId}`;
    return this.http.get<IReponseObject<IQuorumByTime>>(url);
  }

  getAdminUserChart(eventId: number): Observable<IReponseList<IAdminChart>> {
    const url = `${environment.API_URL}/api/auditpuntoregistro/getinfoauditpuntoregistrobyexitandentryalladminusers/${eventId}`;
    return this.http.get<IReponseList<IAdminChart>>(url);
  }

  downloadExcelFormarInitial(eventId: number, nameEvent: string, data: string): Observable<Blob> {
    const url = `${environment.API_URL}/api/file/baseinitialcharge`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'blob' as 'json',
    };
    return this.http.post<Blob>(url, {
      eventId,
      nameEvent,
      data
    }, options);
  }

  updateRolTicketUser(data: any): Observable<IReponseObject<any>> {
    const url = `${environment.API_URL}/api/ticketUsers/updaterolticketuser`;
    return this.http.put<IReponseObject<any>>(url, data);
  }

  get refresh() {
    return this._refresh$;
  }

}
