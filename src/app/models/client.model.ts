export interface IClient {
    clientId: number;
    name: string;
    nit: string;
    creationDate: any;
    creationDateFormat?: Date;
    modifiedUserId: number;
    vottingTypeId: number;
    url: string;
    isSelect?: boolean;
    isOpen?: boolean;
}

export interface IClientCreate {
    clientId: number;
    name: string;
    nit: string;
    modifiedUserId: number;
    vottingTypeId: number;
    url: string;
}