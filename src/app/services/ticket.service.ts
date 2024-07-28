import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map, tap } from 'rxjs';
import { ITicket, ITicketData, ITicketDataUser } from '../models/ticket.model';
import { IReponseList, IReponseObject } from '../models/response.model';
import { environment } from '../../environments/environment';
import { IAssistantRol } from '../models/assistant-rol-model';
import { ITicketUserData } from '../models/assistant.model';
import { IDocumentHistoryCreatedByTickets } from '../models/document-history.model';

interface addTicket {
  eventId: number;
  roleId: number;
  token: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private _refresh$ = new Subject<void>();
  tikectDataUser$ = new BehaviorSubject<ITicketDataUser[]>([]);
  tikectDataUser = this.tikectDataUser$.asObservable();

  ticketUser$ = new BehaviorSubject<ITicketUserData[] | null>(null);
  ticketUser = this.ticketUser$.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  getByEvent(eventId: number): Observable<IReponseList<ITicket>> {
    const url = `${environment.API_URL}/api/tickets/listTicket/${eventId}`;
    return this.http.get<IReponseList<ITicket>>(url);
  }

  getTicketUserByEvent(eventId: number): Observable<IReponseList<ITicketUserData>> {
    const url = `${environment.API_URL}/api/ticketUsers/getTicketUserByUser`;
    return this.http.post<IReponseList<ITicketUserData>>(url,
      {
        eventId
      }
    );
  }

  getRolesByClientId(clientId: number): Observable<IReponseList<IAssistantRol>> {
    const url = `${environment.API_URL}/api/clientRoles/getRoles/${clientId}`;
    return this.http.get<IReponseList<IAssistantRol>>(url);
  }

  getAllData(eventId: number): Observable<IReponseList<ITicketData>> {
    const url = `${environment.API_URL}/api/ticketUsers/getTicketUserByTicket`;
    return this.http.post<IReponseList<ITicketData>>(url, {
      eventId: eventId,
    });
  }

  getTicketsByUser(eventId: number, userId: number): Observable<IReponseList<ITicketDataUser>> {
    const url = `${environment.API_URL}/api/ticketUsers/getTickesByUser`;
    let params = new HttpParams();
    params = params.append('eventId', eventId);
    params = params.append('userId', userId);
    return this.http.get<IReponseList<ITicketDataUser>>(url, { params: params });
  }

  getAccessTicketsByUser(eventId: number, userId: number): Observable<IReponseList<ITicketDataUser>> {
    const url = `${environment.API_URL}/api/ticketUsers/getaccesspointticketsbyuser`;
    let params = new HttpParams();
    params = params.append('eventId', eventId);
    params = params.append('userId', userId);
    return this.http.get<IReponseList<ITicketDataUser>>(url, { params: params });
  }

  getById(ticketId: number): Observable<IReponseObject<ITicket>> {
    const url = `${environment.API_URL}/api/tickets/ticket/${ticketId}`;
    return this.http.get<IReponseObject<ITicket>>(url);
  }

  create(ticket: ITicket): Observable<IReponseObject<ITicket>> {
    const url = `${environment.API_URL}/api/tickets/ticket`;
    return this.http.post<IReponseObject<ITicket>>(url, ticket).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  update(ticket: ITicket): Observable<IReponseObject<ITicket>> {
    const url = `${environment.API_URL}/api/tickets/updateTicket`;
    return this.http.post<IReponseObject<ITicket>>(url, ticket).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  saveTicketUser(token: string, userId: number, eventId: number, roleId: number): Observable<IReponseObject<ITicket>> {
    const url = `${environment.API_URL}/api/tickets/ticketUserbytoken`;
    const addTicket: addTicket = {
      token: token,
      userId: userId,
      eventId: eventId,
      roleId: roleId
    }
    return this.http.post<IReponseObject<ITicket>>(url, addTicket).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  delete(ticketId: number, descriptChanges: string): Observable<IReponseObject<any>> {
    const url = `${environment.API_URL}/api/tickets/deleteTicket`;
    return this.http.put<IReponseList<any>>(url, {
      ticketId: ticketId,
      descriptChanges: descriptChanges,
    }).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  upload(eventId: number, clientId: number, adminUserId: number, file: any): Observable<IReponseObject<IDocumentHistoryCreatedByTickets>> {
    const url = `${environment.API_URL}/api/file/uploadTicketV2`;
    let formData = new FormData();
    formData.append('file', file);
    formData.append('adminUserId', adminUserId.toString());
    formData.append('clientId', clientId.toString());
    formData.append('eventId', eventId.toString());
    return this.http.post<IReponseObject<IDocumentHistoryCreatedByTickets>>(url, formData).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  validateToken(token: number, eventId: number): Observable<IReponseObject<boolean>> {
    const url = `${environment.API_URL}/api/tickets/validateToken`;
    let params = new HttpParams();
    params = params.append('eventId', eventId);
    params = params.append('token', token);
    return this.http.get<IReponseObject<boolean>>(url, { params: params });
  }


  validateTokenEdit(newtoken: number, token: number, eventId: number): Observable<IReponseObject<boolean>> {
    const url = `${environment.API_URL}/api/tickets/validateTokenEdit`;
    let params = new HttpParams();
    params = params.append('eventId', eventId);
    params = params.append('token', token);
    params = params.append('newtoken', newtoken);
    return this.http.get<IReponseObject<boolean>>(url, { params: params });
  }

  validateKeyKey2(key1: string, key2: string, eventId: number): Observable<IReponseObject<boolean>> {
    const url = `${environment.API_URL}/api/tickets/validateKey1Key2`;
    let params = new HttpParams();
    params = params.append('eventId', eventId);
    params = params.append('key1', key1);
    params = params.append('key2', key2);
    return this.http.get<IReponseObject<boolean>>(url, { params: params });
  }

  validateKeyKey2Edit(key1: string, key2: string, newkey1: string, newkey2: string, eventId: number): Observable<IReponseObject<boolean>> {
    const url = `${environment.API_URL}/api/tickets/validateKey1Key2Edit`;
    let params = new HttpParams();
    params = params.append('eventId', eventId);
    params = params.append('key1', key1);
    params = params.append('key2', key2);
    params = params.append('newkey1', newkey1);
    params = params.append('newkey2', newkey2);
    return this.http.get<IReponseObject<boolean>>(url, { params: params });
  }

  get refresh() {
    return this._refresh$;
  }
}
