import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TicketService } from '../services/ticket.service';
import { Observable, catchError, map, of } from 'rxjs';
import { AssistantService } from '../services/assistant.service';

export class CustomValidators {
  static MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
        ? { mismatch: true }
        : null;
    };
  }

  static selectValidator(control: { value: string }): { [key: string]: boolean } | null {
    const select = control.value;
    if (select === '0') {
      return { 'selectValidate': true };
    }
    return null;
  }

  static tokenTicketAsyncValidator(ticketService: TicketService, eventId: number) {
    return (control: AbstractControl) => {
      const value = control.value;
      return ticketService.validateToken(value, eventId).pipe(
        map(response => {
          if (!response.payload) {
            return null;
          } else {
            return { tokenInvalid: true };
          }
        }),
        catchError(() => {
          return of(null);
        })
      );
    };
  }

  static tokenTicketEditAsyncValidator(ticketService: TicketService, token: number, eventId: number) {
    return (control: AbstractControl) => {
      const value = control.value;
      return ticketService.validateTokenEdit(value, token, eventId).pipe(
        map(response => {
          if (!response.payload) {
            return null;
          } else {
            return { tokenEditInvalid: true };
          }
        }),
        catchError(() => {
          return of(null);
        })
      );
    };
  }

  static docIdAsyncValidator(assistantService: AssistantService, typeDoc: number, eventId: number) {
    return (control: AbstractControl) => {
      const value = control.value;
      return assistantService.validateDocId(value, eventId, typeDoc).pipe(
        map(response => {
          if (!response.payload) {
            return null;
          } else {
            return { docIdInvalid: true };
          }
        }),
        catchError(() => {
          return of(null);
        })
      );
    };
  }

  static docIdEditAsyncValidator(assistantService: AssistantService, docId: string, eventId: number, typeDoc: number, typeDocOld: number) {
    return (control: AbstractControl) => {
      const value = control.value;
      return assistantService.validateDocIdEdit(value, docId, eventId, typeDoc, typeDocOld).pipe(
        map(response => {
          if (!response.payload) {
            return null;
          } else {
            return { docIdEdit: true };
          }
        }),
        catchError(() => {
          return of(null);
        })
      );
    };
  }

  static emailAsyncValidator(assistantService: AssistantService, eventId: number) {
    return (control: AbstractControl) => {
      const value = control.value;
      return assistantService.validateEmail(value, eventId).pipe(
        map(response => {
          if (!response.payload) {
            return null;
          } else {
            return { emailInvalid: true };
          }
        }),
        catchError(() => {
          return of(null);
        })
      );
    };
  }

  static emailEditAsyncValidator(assistantService: AssistantService, email: string, eventId: number) {
    return (control: AbstractControl) => {
      const value = control.value;
      return assistantService.validateEmailEdit(value, email, eventId).pipe(
        map(response => {
          if (!response.payload) {
            return null;
          } else {
            return { emailEditEditInvalid: true };
          }
        }),
        catchError(() => {
          return of(null);
        })
      );
    };
  }

  static phoneAsyncValidator(assistantService: AssistantService, eventId: number) {
    return (control: AbstractControl) => {
      const value = control.value;
      return assistantService.validatePhone(value, eventId).pipe(
        map(response => {
          if (!response.payload) {
            return null;
          } else {
            return { phoneInvalid: true };
          }
        }),
        catchError(() => {
          return of(null);
        })
      );
    };
  }

  static phoneEditAsyncValidator(assistantService: AssistantService, phone: string, eventId: number) {
    return (control: AbstractControl) => {
      const value = control.value;
      return assistantService.validatePhoneEdit(value, phone, eventId).pipe(
        map(response => {
          if (!response.payload) {
            return null;
          } else {
            return { phoneEditInvalid: true };
          }
        }),
        catchError(() => {
          return of(null);
        })
      );
    };
  }
}