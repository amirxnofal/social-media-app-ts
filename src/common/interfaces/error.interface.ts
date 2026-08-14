export interface IAError {
    status: number;
    message: string;
    cause?: unknown;
}
