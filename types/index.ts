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

export type ResponseData = {
    data: any | string | any[]
}

export type UserDetails = {
    "itsId": string,
    "zone": string[],
    "assignedArea": string[],
    "id": string[],
}