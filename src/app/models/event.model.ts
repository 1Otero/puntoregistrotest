import { IUserAssistant } from "./assistant.model";
import { RequestStatus } from "./request-status.model";
import { ITicket } from "./ticket.model";

export interface IEvent {
  eventId: number;
  modifiedUserId: number;
  clientId: number;
  name: string;
  status: number;
  type: any;
  date: number;
  date2: number;
  imageId: number;
  folderDocumentId: number;
  phone: string;
  whatsapp: string;
  email: string;
  urlEvent: string;
  labelUrl: string;
  dateStartPreregistration: number;
  dateEndPreregistration: number;
  timezone: string;
  def: string;
  active: boolean;
  dateStartEvent: number;
  dateEndEvent: number;
  selectEvent: boolean;
  vottingTypeId: number;
  dataBase: boolean;
  preregistration: boolean;
  registrationPoint: boolean;
  app: boolean;
  videoCall: boolean;
  typeEvent: number;
  freeEvent: number;
  codEvent: number;
  isSelect?: boolean;
  isOpen?: boolean;
}

export interface ICreateEvent {
  clientId: number;
  name: string;
  dateStartEvent: string;
  dateEndEvent: string;
}

export interface IUpdateEvent extends ICreateEvent {
  eventId: number;
}

export interface IInfoQuorum {
  userAssistant: IUserAssistant,
  ticket: ITicket[];
}

export interface IConfig {
  configRegistrationPointId: number;
  eventId: number;
  isPublic: number;
  deviceType: number;
  vottingType: number;
  email: number;
  phone: number;
  print: number;
  showInfoClient: number;
  nominal: number;
  coefficient: number;
  units: number;
}

export interface IEventConfig {
  configRegistrationPoint: IConfig;
  event: IEvent;
}

export interface InfoEvent {
  apoderadosEnEvento: number;
  ticketsEnEvento: number;
  personasEnEvento: number;
}

export interface IAssingControl {
  success: string[];
  error: string[];
}

export interface IAssingControlChange {
  Success: string;
  Error: string;
}

export interface IConfigRegistrationPoint {
  configId: number;
  creationDate: number;
  eventId: number;
  finalTime2: number;
  habeasDataId: number;
  name: string;
  type: string;
  value: string;
  dataType: number;
}

export interface IClientRoles {
  clientRoleId: number;
  modifiedUserId: number;
  clientId: number;
  name: string;
  description: string;
  status: boolean;
  varKey: string;
}

export interface IDataQuorum {
  coeficiente: number;
  totalAccessPointTicket: number;
  totalCoefficienteByTicket: number;
  totalTickets: number;
}

export interface IQuorum {
  quorumId: number;
  eventId: number;
  date: number;
  type: number;
  coefficient: number;
  units: number;
}

export interface IQuorumCreate {
  eventId: number;
  type: number;
}

export interface IQuorumByTime {
  hora: any[];
  media_hora: any[];
  minuto: any[];
}

export interface IAdminChart{
  exit: number;
  entry: number;
  adminUserId: number;
  name: string;
  eventId: number;
}