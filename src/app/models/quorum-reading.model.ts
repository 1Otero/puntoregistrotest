export interface IQuorumReading {
    quorumReadingId: number;
    eventId: number;
    coefficient: number;
    units: number;
    date: number;
    status: number;
    logdel: number;
}

export interface IQuorumReadingUser {
    key1: string;
    key2: string;
    accessPointUserName: string;
    coefficient: number;
    units: number;
    status: number;
    logdel: number;
}

export interface IQuorumReadingByUser {
    quorumReading: IQuorumReading,
    listQuorumReadings: IQuorumReadingUser[];
}