export interface ITicket {
  ticketId: number;
  eventId: number;
  clientId: number;
  groupId: string;
  loadListId: number;
  key1: string;
  key2: string;
  description: string;
  coefficient: number;
  units: number;
  voteOfflineId: number | null;
  logdel: boolean;
  available: boolean;
  register: number;
  token: number;
  numControl: number;
  status: number;
  isSelect?: boolean;
  isOpen?: boolean;
}

export interface IUserAssistant {
  userId: number;
  modifiedUserId: number | null;
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
  reviewedBy: number | null;
  active: boolean;
  token: string | null;
  idInfoVariable: any | null;
  rh: any | null;
  eventId: number;
  city: any | null;
  agreedToTermsOfUse: any | null;
  viewAccessPoint: any | null;
  autoRegistration: boolean;
  register: boolean;
  registration: number;
  registerPoint: boolean;
  errorMessage: string | null;
  descriptChanges: any | null;
  confirmAssist: number;
}

export interface ITicketUser {
  userAssistant: IUserAssistant;
  rol: string;
}

export interface ITicketData {
  ticket: ITicket;
  ticketUsersByTicketWithRol: ITicketUser[];
}

export interface ITicketDataUser {
  ticket: ITicket;
  rol: string;
  isAssigned: number;
}

