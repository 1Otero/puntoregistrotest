import { ITicket } from "./ticket.model";

export interface ISlideAnswer {
    slideId: number;
    eventId: number;
    order: number;
    weight: number;
    slideTypeId: number;
    status: number;
}

export interface IConfSlideAnswer {
    id: number;
    slideId: number;
    eventId: number;
    imageId: number;
    typeQuestion: string;
    openingClosing: any;
    title: string;
    groupVote: string;
    allowChangeVote: number;
    showQuorum: number;
    showVoted: number;
    showWhithoutVote: number;
    dataQuorum: number;
    roundingQuorum: number;
    graphicsResults: string;
    showUser: number;
    showDecimals: number;
    roundingResult: number;
    showWeightVote: number;
    seeResults: number;
    revote: boolean;
    manualTime: number;
    manualTimeType: number;
    initialTime: any;
    finalTime: any;
    finalTime2: any;
    timeType: number;
}

export interface IOptionQuestionAnser {
    optionQuestionId: number;
    eventId: number;
    slideId: number;
    order: number;
    weight: number;
    descriptionOption: string;
    imageId: string;
    correctResult: number;
    pointsForAnswer: number;
    sumOfUsers: number;
    symOfIntegers: number;
    sumOfDecimals: number;
    status: number;
}

export interface ITicketAnswer {
    accessPointTicketId: number;
    accessPointUserId: number;
    ticketId: number;
    coefficient: number | null;
    units: number | null;
    entryDate: number;
    exitDate: number | null;
    active: boolean;
    absent: boolean;
    ticketUserId: number;
}

export interface IAnswer {
    nameSlide: string;
    slide: ISlideAnswer;
    confQuestion: IConfSlideAnswer;
    opcionElegida: number;
    orderSlide: number;
    opElegir: IOptionQuestionAnser[];
    listAccespointAccessPointTickets: ITicket;
}

export interface IResult {
    answer: {
        accessPointTicketId: number;
        keys: string;
    };
    options: number[];
}

export interface ICombinedData {
    description: string;
    optionId: number;
}

export interface IListOpcionesAElegir {
    description: string;
    optionId: number;
}

export interface IListTickets {
    keys: string;
    accessPointTicketId: number;
}

export interface IAnswerInfo {
    nameSlide: string;
    slideId: number;
    setListAccessPointTicketIdsByAnswer: number[];
    slidee: any;
    confQuestion: any;
    opcionElegida: any;
    orderSlide: number;
    listOpcionesAElegir: IListOpcionesAElegir[];
    listTickets: IListTickets[];
    opElegir: any;
    listAccespointAccessPointTickets: any[];
    slide: any;
    listDescriptionAnswerByAccessPointTicket: string[];
    listOptionIdByAccessPointTicket: number[];
    result?: IResult[];
}