import { IOptionQuestion } from "./option-question.model";

export interface ISlide {
    slideId: number;
    eventId: number;
    order: number;
    weight: number;
    slideTypeId: number;
    status: number;
}

export interface ISlideConfig {
    id: number;
    slideId: number;
    eventId: number;
    imageId: number;
    typeQuestion: string;
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
    showIntegers: number;
    roundingResult: number;
    showWeightVote: number;
    seeResults: number;
    revote: boolean;
    manualTime: number;
    manualTimeType: number;
    initialTime: any | null;
    finalTime: any | null;
    finalTime2: number;
    timeType: number;
    questionlimit: number;
}

export interface IResultSlide {
    slide: ISlide;
    config: ISlideConfig;
    options: IOptionQuestion[];
}

export interface IGetSlide {
    result: IResultSlide[];
}

export interface IAnswerOption {
    answerOptionSlideId: number;
    Total: number;
    Tittle: string;
    units: number;
    decimals: number;
    image: string;
}

export interface IAnswerSlide {
    TittleSlide: string;
    decimals: number;
    AnswerSlideId: number;
    totalTickets: number;
    abstentionList: string;
    votedDecimal: number;
    AnswerOptionSlide: IAnswerOption[];
    units: number;
    creationDate: number;
    votedUnit: number;
}

export interface IAnswerData {
    Slide: number;
    AnswerSlide: IAnswerSlide;
}

export interface IAnswerPayloadData {
    payload: IAnswerData[];
}

export interface IAddVote {
    eventId: number;
    confQuestionId: number;
    accessTicketId: number[];
    accessPointUserId: number;
    optionId: number[];
    description: string;
    responseFrom: number;
    revote: boolean;
  }

  export interface ISlideOptions {
    imageId: string;
    description: string;
    optionQuestionId: number;
    correctAnswer: number;
    selected?: boolean;
  }

  export interface ITicketData {
    key1: string;
    key2: string;
    questionVoted: boolean;
    accessPointTicketId: number;
    ticketDescription: string;
    groupValidation: string;
    selectedOptions?: ISlideOptions[];
    order?: string;
    isVoted?: boolean;
    description?: string;
    show?:boolean;
  }

  export interface TicketsValidations{
    TicketsValidations: ITicketData[];
  }

  export interface ISlideValidationData {
    ListSlidesValidations: ISlideValidation[] | IResult;
  }

  export interface ISlideValidation {
    slideImage: number;
    slideId: number;
    allowChangeVote: boolean;
    QuestionSlide: TicketsValidations;
    slideOptions: ISlideOptions[];
    selectedOptions?: ISlideOptions[];
    isVoted?: boolean;
    description?: string;
    slideTitle: string;
    confQuestionId: number;
    typeSlide: string;
    revote: boolean;
  }

  export interface IResult {
    result: string;
  }

  export interface IAnswerUserResult {
    answer: IAnswerData;
    configSlide: ISlideConfig;
    showResult: boolean;
    slide: IResultSlide;
  }

  export interface ICreateSlideQuantity {
    slide: ISlide;
    id: number;
    cantidad: number
  }

  export interface ICreateSlideOptions {
    slide: ISlide;
    id: number;
    options: string[];
  }

  export interface ISlideQuantity {
    id: number;
    cantidad: number
  }

  export interface ISlideAfirmations {
    id: number;
    options: string[];
  }