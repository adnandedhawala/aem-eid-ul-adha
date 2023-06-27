export enum ZONE {
    TOKEN = "Token",
    DABBA = "Dabba",
    NOT_DABBA = "Not Dabba",
}

export enum TOKEN_COUNTER {
    ZABIHAT = "Zabihat",
    GOSH = "Gosh",
    PAYA = "Paya",
}

export enum DISTRIBUTION_STATUS {
    TO_BE_DISPATCHED = "To Be Dispatched",
    DISPATCHED = "Dispatched",
    COLLECTED = "Collected",
    RETURNED = "Returned",
}

export type ResponseData = {
    data: any | string | any[]
}

export type UserDetails = {
    "itsId": string,
    "name": string,
    "zone": string[],
    "assignedArea": string[],
    "id": string[],
}