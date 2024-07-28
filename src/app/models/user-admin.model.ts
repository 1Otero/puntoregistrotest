export interface IUserAdmin {
  adminUserId: number;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  country: string;
  city: string;
  createDate: Date;
  modifiedDate: Date;
  modifiedUserId: number;
  idRol: number[];
}

export interface IUserAdminCreate extends IUserAdmin {
}

export interface IUserLogin {
  userId: number;
  idTypeDoc: number;
  docId: string;
  clientId: number;
  token: string;
  name: string;
  lastname: string;
  eventId: number;
  email: string;
}

export interface IUserAssistantCreate {
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
  birthday: Date | null;
  gender: string | null;
  active: boolean;
  token: string | null;
  rh: string | null;
  eventId: number;
  city: string | null;
  agreedToTermsOfUse: number | null;
  viewAccessPoint: boolean;
  preRegistration: boolean;
  register: boolean;
  registration: number | null;
  registerPoint: boolean;
  errorMessage: string | null;
  descriptChange: string | null;
  confirmAssist: number | null;
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
  birthday: Date | null;
  gender: string | null;
  active: boolean;
  token: string | null;
  rh: string | null;
  eventId: number;
  city: string | null;
  agreedToTermsOfUse: boolean | null;
  viewAccessPoint: boolean;
  preRegistration: boolean;
  register: boolean;
  registration: string | null;
  registerPoint: boolean;
  errorMessage: string | null;
  descriptChange: string | null;
  confirmAssist: boolean | null;
  enabled: boolean;
  password: string | null;
  accountNonLocked: boolean;
  authorities: string[] | null;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  username: string | null;
}

export interface IUserAssistantLogin {
  exist: IUserAssistant | string;
  accessPointUser?: any | null;
  token?: string;
}

export interface IUserData {
  docId: string;
  idTypeDoc: number;
}
