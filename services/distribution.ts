import { getApiUrl, getApplicationJsonHeader, handleResponse } from "@/utils";

export const getDistributionListBySubsectors = (data:any) => {
    return fetch(getApiUrl("distribution"), {
        method: "POST",
        headers: {
            ...getApplicationJsonHeader()
        },
        body: JSON.stringify({ data })
    }).then(handleResponse);
};

export const updateDistributionById = (data: any) => {
    return fetch(getApiUrl("distribution"), {
        method: "PUT",
        headers: {
            ...getApplicationJsonHeader()
        },
        body: JSON.stringify({ data })
    }).then(handleResponse);
};