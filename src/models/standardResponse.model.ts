export type StandardResponse<T> = {
    status: number;
    message?: string;
    data?: T;
};
