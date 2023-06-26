import { getApiUrl, getApplicationJsonHeader, handleResponse } from "@/utils";

export const getTokensList = () => {
    return fetch(getApiUrl("tokens"), {
        method: "GET",
        headers: {
            ...getApplicationJsonHeader()
        },
    }).then(handleResponse);
};

export const updateTokenById = (data: any) => {
    return fetch(getApiUrl("tokens"), {
        method: "PUT",
        headers: {
            ...getApplicationJsonHeader()
        },
        body: JSON.stringify({ data })
    }).then(handleResponse);
};