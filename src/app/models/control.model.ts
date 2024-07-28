import { IUserAssistant } from "./assistant.model";

export interface IControl {
    idControl: number;
    keyControl: number;
    type: string;
    barCode: string;
    maker: string;
    model: string;
    purchaseDate: Date;
    batteryChangeDate: Date;
    lastEvent: string;
    lastUser: number;
    lastAssistant: number;
    description: string;
    physicalState: string;
    status: number;
}

export interface IControlUser{
    control: IControl,
    user: IUserAssistant,
}