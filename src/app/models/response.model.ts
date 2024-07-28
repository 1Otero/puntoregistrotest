export interface IReponseList<T>{
    status: 'success' | 'error';
    payload: Array<T>;
    errorMessage: {
        keyError: string;
        message: string;
    };
}

export interface IReponseObject<T>{
    status: 'success' | 'error';
    payload: T;
    errorMessage: {
        keyError: string;
        message: string;
    };
}