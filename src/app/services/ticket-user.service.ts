import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IReponseObject } from '../models/response.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { IDocumentHistoryCreatedByTicketUsers } from '../models/document-history.model';

@Injectable({
  providedIn: 'root'
})
export class TicketUserService {

  constructor(
    private http: HttpClient
  ) { }

  upload(eventId: number, clientId: number, adminUserId: number, file: any): Observable<IReponseObject<IDocumentHistoryCreatedByTicketUsers>> {
    const url = `${environment.API_URL}/api/file/uploadTicketUserV2`;
    let formData = new FormData();
    formData.append('file', file);
    formData.append('adminUserId', adminUserId.toString());
    formData.append('clientId', clientId.toString());
    formData.append('eventId', eventId.toString());
    return this.http.post<IReponseObject<IDocumentHistoryCreatedByTicketUsers>>(url, formData);
  }
}
