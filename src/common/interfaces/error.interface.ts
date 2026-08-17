export interface IAppError {
    status: number;
    message: string;
    cause?: unknown;
}