import { IUserAdmin } from "./user-admin.model";

export interface IDocumentHistory {
    documentHistoryId: number;
    clientId: number;
    eventId: number;
    adminUserId: number;
    object: string;
    action: string;
    fileName: string;
    date: {
      nano: number;
      year: number;
      monthValue: number;
      dayOfMonth: number;
      hour: number;
      minute: number;
      second: number;
      month: string;
      dayOfWeek: string;
      dayOfYear: number;
      chronology: {
        id: string;
        calendarType: string;
      };
    };
    date2: number;
    rows: null | number;
    url: string;
    errors: number;
    errorsList: string;
    usersCreated: number;
    ticketsCreated: number;
    ticketUsersCreated: number;
    isSelect?: boolean;
    isOpen?: boolean;
  }
  
  export interface IDocumentHistoryError {
    keyError: string;
    message: string;
  }
  
  export interface IDocumentHistoryComplete {
    documentHistory: IDocumentHistory;
    documentHistoryErrorList: IDocumentHistoryError[];
    adminUser: IUserAdmin;
  }

  export interface IDocumentHistoryCreated{
    errors?: {
      keyError: string;
      message: string;
    }[];
    TicketUserscreated?: number;
    Ticketscreated?: number;
    Userscreated?: number;
    numColumns?: number;
  }

  export interface IDocumentHistoryCreatedByTickets{
    errors?: {
      keyError: string;
      message: string;
    }[];
    TicketsCreated?: number;
    TicketsUpdated?: number;
    numColumns?: number;
  }

  export interface IDocumentHistoryCreatedByUsers{
    errors?: {
      keyError: string;
      message: string;
    }[];
    UsersCreated?: number;
    UsersUpdated?: number;
    numColumns?: number;
  }

  export interface IDocumentHistoryCreatedByTicketUsers{
    errors?: {
      keyError: string;
      message: string;
    }[];
    TicketUsersCreated?: number;
    TicketUsersUpdated?: number;
    numColumns?: number;
  }

  