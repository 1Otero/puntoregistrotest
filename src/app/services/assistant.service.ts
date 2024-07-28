import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { IReponseList, IReponseObject } from '../models/response.model';
import { IAssistantData, IAssistantDataRegister, IAssistantDataWithTickets, IUserAssistant } from '../models/assistant.model';
import { environment } from '../../environments/environment';
import { IUserAssistantCreate } from '../models/user-admin.model';
import { ITicketUserData } from '../models/ticket-user.model';
import { IAssingControl, IAssingControlChange } from '../models/event.model';
import { IDocumentHistoryCreatedByUsers } from '../models/document-history.model';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  private _refresh$ = new Subject<void>();

  constructor(
    private http: HttpClient,
  ) { }

  get(): Observable<IReponseList<IUserAssistant>> {
    const url = `${environment.API_URL}/api/users/get`;
    return this.http.get<IReponseList<IUserAssistant>>(url);
  }

  getByEvent(eventId: number): Observable<IReponseList<IUserAssistant>> {
    const url = `${environment.API_URL}/api/users/getUsersByEvent/${eventId}`;
    return this.http.get<IReponseList<IUserAssistant>>(url);
  }

  getAllData(eventId: number): Observable<IReponseList<IAssistantDataWithTickets>> {
    const url = `${environment.API_URL}/api/ticketUsers/getTicketUserByUser`;
    return this.http.post<IReponseList<IAssistantDataWithTickets>>(url, {
      eventId: eventId,
    });
  }

  getById(ticketId: number): Observable<IReponseObject<IUserAssistant>> {
    const url = `${environment.API_URL}/api/tickets/ticket/${ticketId}`;
    return this.http.get<IReponseObject<IUserAssistant>>(url);
  }

  create(assistant: IUserAssistant, adminUserId: number): Observable<IReponseObject<IUserAssistant>> {
    const url = `${environment.API_URL}/api/users/user`;
    return this.http.post<IReponseObject<IUserAssistant>>(url, assistant).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  saveUserAssistant(assistant: IUserAssistantCreate): Observable<IReponseObject<IUserAssistantCreate>> {
    const url = `${environment.API_URL}/api/users/user`;
    return this.http.post<IReponseObject<IUserAssistantCreate>>(url, assistant).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  update(assistant: IUserAssistant, adminUserId: number): Observable<IReponseObject<IUserAssistant>> {
    const url = `${environment.API_URL}/api/users/userEdit`;
    return this.http.post<IReponseObject<IUserAssistant>>(url, assistant).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  delete(userId: number, descriptChanges: string): Observable<IReponseObject<any>> {
    const url = `${environment.API_URL}/api/users/user`;
    return this.http.put<IReponseList<any>>(url, {
      userId: userId,
      descriptChanges: descriptChanges,
    }).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  upload(adminUserId: number, clientId: number, eventId: number, file: any): Observable<IReponseObject<IDocumentHistoryCreatedByUsers>> {
    const url = `${environment.API_URL}/api/file/uploadUserV2`;
    let formData = new FormData();
    formData.append('file', file);
    formData.append('adminUserId', adminUserId.toString());
    formData.append('clientId', clientId.toString());
    formData.append('eventId', eventId.toString());
    return this.http.post<IReponseObject<IDocumentHistoryCreatedByUsers>>(url, formData).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  validateDocId(docId: string, eventId: number, typeDoc: number): Observable<IReponseObject<boolean>> {
    const url = `${environment.API_URL}/api/users/validateDocId`;
    let params = new HttpParams();
    params = params.append('eventId', eventId);
    params = params.append('docId', docId);
    params = params.append('typeDoc', typeDoc);
    return this.http.get<IReponseObject<boolean>>(url, { params: params });
  }


  validateDocIdEdit(newdocId: string, docId: string, eventId: number, typeDoc: number, typeDocOld: number): Observable<IReponseObject<boolean>> {
    const url = `${environment.API_URL}/api/users/validateDocIdEdit`;
    let params = new HttpParams();
    params = params.append('eventId', eventId);
    params = params.append('docId', docId);
    params = params.append('newdocId', newdocId);
    params = params.append('typeDoc', typeDoc);
    params = params.append('typeDocOld', typeDocOld);
    return this.http.get<IReponseObject<boolean>>(url, { params: params });
  }

  validateEmail(email: string, eventId: number): Observable<IReponseObject<boolean>> {
    const url = `${environment.API_URL}/api/users/validateEmail`;
    let params = new HttpParams();
    params = params.append('eventId', eventId);
    params = params.append('email', email);
    return this.http.get<IReponseObject<boolean>>(url, { params: params });
  }


  validateEmailEdit(newemail: string, email: string, eventId: number): Observable<IReponseObject<boolean>> {
    const url = `${environment.API_URL}/api/users/validateEmailEdit`;
    let params = new HttpParams();
    params = params.append('eventId', eventId);
    params = params.append('email', email);
    params = params.append('newemail', newemail);
    return this.http.get<IReponseObject<boolean>>(url, { params: params });
  }

  validatePhone(phone: string, eventId: number): Observable<IReponseObject<boolean>> {
    const url = `${environment.API_URL}/api/users/validatePhone`;
    let params = new HttpParams();
    params = params.append('eventId', eventId);
    params = params.append('phone', phone);
    return this.http.get<IReponseObject<boolean>>(url, { params: params });
  }


  validatePhoneEdit(newphone: string, phone: string, eventId: number): Observable<IReponseObject<boolean>> {
    const url = `${environment.API_URL}/api/users/validatePhoneEdit`;
    let params = new HttpParams();
    params = params.append('eventId', eventId);
    params = params.append('phone', phone);
    params = params.append('newphone', newphone);
    return this.http.get<IReponseObject<boolean>>(url, { params: params });
  }

  getAttendant(tipRegistro: number, eventId: number, idTypeDoc: number, docId: string, nombre: string, apellido: string, adminUserId: number): Observable<IReponseObject<IAssistantData>> {
    const url = `${environment.API_URL}/api/users/getAttendant`;
    return this.http.post<IReponseObject<IAssistantData>>(url,
      {
        tipRegistro,
        eventId,
        idTypeDoc,
        docId,
        nombre,
        apellido,
        adminUserId
      }
    );
  }

  getAttendantRegister(eventId: number, userId: number): Observable<IReponseObject<IAssistantDataRegister>> {
    const url = `${environment.API_URL}/api/ticketUsers/getTickeByUser`;
    let params = new HttpParams();
    params = params.append('eventId', eventId);
    params = params.append('userId', userId);
    return this.http.get<IReponseObject<IAssistantDataRegister>>(url, { params: params });
  }

  addTicket(ticketData: ITicketUserData, adminUserId: number): Observable<IReponseObject<ITicketUserData>> {
    const url = `${environment.API_URL}/api/ticketUsers/ticketUser`;
    return this.http.post<IReponseObject<ITicketUserData>>(url, {
      ...ticketData,
      adminUserId
    }).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  removeTicket(userId: number, ticketId: number, eventId: number, mensajeDescription: string, adminUserIdResponsable: number): Observable<IReponseObject<ITicketUserData>> {
    const url = `${environment.API_URL}/api/events/disableticketerror`;
    return this.http.post<IReponseObject<ITicketUserData>>(url,
      {
        userId,
        ticketIdOld: ticketId,
        eventId,
        mensajeDescription,
        adminUserIdResponsable
      }).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  disableTicket(userId: number, ticketId: number, eventId: number, mensajeDescription: string, adminUserIdResponsable: number): Observable<IReponseObject<any>> {
    const url = `${environment.API_URL}/api/ticketUsers/deleteTicketUser`;
    return this.http.post<IReponseObject<any>>(url,
      {
        userId,
        ticketId,
        eventId,
        mensajeDescription,
        adminUserIdResponsable
      }).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  changeUser(data: any, adminUserId: number): Observable<IReponseObject<any>> {
    const url = `${environment.API_URL}/api/accessPoints/updateAccessTicket`;
    return this.http.post<IReponseObject<any>>(url, data).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  assignControl(data: any, adminUserId: number): Observable<IReponseObject<IAssingControl>> {
    const url = `${environment.API_URL}/api/tickets/assignVoteOfflineId`;
    return this.http.post<IReponseObject<IAssingControl>>(url, {
      ...data,
      adminUserId
    }).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  changeControl(data: any, adminUserId: number): Observable<IReponseObject<IAssingControlChange>> {
    const url = `${environment.API_URL}/api/tickets/changeVoteOfflineId`;
    return this.http.post<IReponseObject<IAssingControlChange>>(url, data).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  registerExit(typeDocument: number, numberDocument: string, eventId: number, adminUserId: number): Observable<IReponseObject<any>> {
    const url = `${environment.API_URL}/api/events/exituserbyevent`;
    return this.http.post<IReponseObject<any>>(url,
      {
        eventId,
        typeDoc: typeDocument,
        doc: numberDocument,
        adminUserId
      }
    ).
      pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  registerExitByControl(barCode: string, eventId: number, adminUserId: number): Observable<IReponseObject<IUserAssistant>> {
    const url = `${environment.API_URL}/api/voteOffline/exituserbyvoteoffline`;
    let params = new HttpParams();
    params = params.append('barCode', barCode);
    params = params.append('eventId', eventId);
    params = params.append('adminUserId', adminUserId);
    return this.http.post<IReponseObject<IUserAssistant>>(url, {}, { params: params }).
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
