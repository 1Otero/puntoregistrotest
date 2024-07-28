export interface IAccessPointCreate {
    eventId: number;
    userId: number;
    clientId: number;
    ticketIds: number[];
}

export interface IAccessPointUser {
    accessPointUserId: number;
    tokenStatus: number;
    groupTicket: null | any;
    role: string;
    userId: number;
    eventId: number;
    logdel: boolean;
    absent: boolean;
    status: number;
}

export interface IAccesPointTicket {
    accessPointTicketId: number;
    accessPointUserId: number;
    ticketId: number;
    coefficient: number;
    units: number;
    entryDate: number;
    exitDate: number;
    absent: boolean;
    ticketUserId: number;
    status: number;
    logdel: boolean;
}

export interface IAccessPointTicketData{
    key1: string;
    key2: string;
    lastName: string;
    document: string;
    name: string;
    typeDocument: number;
    status: boolean;
}

export interface IAuditoria {
    key1: string;
    name: string;
    key2: string;
    action: string;
    eventId: number;
    auditPuntoRegistro: number;
    adminUserId: number;
    nameUserAssistant: string;
    description: string;
}