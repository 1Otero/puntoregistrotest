import { IAccessPointUser } from "./access-point.model";
import { ITicket } from "./ticket.model";

export interface IUserAssistant {
    userId: number | null;
    clientId: number;
    loadListId: number | null;
    idTypeDoc: number;
    docId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    secondLastName: string;
    email: string;
    phoneNumber: string;
    birthday: number;
    gender: string;
    reviewedBy?: number | null;
    logdel: boolean;
    rh: string | null;
    eventId: number;
    city?: string | null;
    agreedToTermsOfUse: boolean | null;
    viewAccessPoint: string | null;
    register: boolean;
    registration: number;
    registerPoint: boolean;
    infoVariable: string;
    errorMessage: string | null;
    confirmAssist?: number;
    isSelect?: boolean;
    isOpen?: boolean;
}

export interface ITicketUser {
    ticket: ITicket;
    rol: string;
    isAssigned: number;
    userAssistant: IUserAssistant;
    meEntryDate: number;
    meExitDate: number;
}

export interface ITicketUserRegister {
    ticket: ITicket;
    rol: string;
    isAssigned: number;
    userAssistant: IUserAssistant;
    meEntryDate: number;
    meExitDate: number;
    isOpen?: boolean;
}

export interface IAssistantData {
    attendant: IUserAssistant;
    listTicketByUser: ITicketUser[];
    tipoAccion: string;
}

export interface IAssistantDataWithTickets {
    userAssistant: IUserAssistant;
    ticketsByUserWithRole: ITicketUser[];
    numVotos: number;
    accessPointUser: IAccessPointUser;
    isOpen?: boolean;
  }

export interface IAssistantDataRegister {
    attendant: IUserAssistant;
    listTicketByUserWithRol: ITicketUserRegister[];
    accessPointUser: IAccessPointUser;
}

export interface ITicketUserData {
    userAssistant: IUserAssistant;
    ticketsByUserWithRole: ITicketUserRegister[];
    isOpen?:boolean;
}
