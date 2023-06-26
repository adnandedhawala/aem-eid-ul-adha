import { clearAuthToken, getApiUrl, getApplicationJsonHeader, handleResponse } from "@/utils";

export const login = (loginInfo:any) => {
    return fetch(getApiUrl("login"), {
        method: "POST",
        headers: {
            ...getApplicationJsonHeader()
        },
        body: JSON.stringify({ data: loginInfo })
    }).then(handleResponse);
};

export const verifyUser = (token:any) => {
    return fetch(getApiUrl("verify"), {
        method: "POST",
        headers: {
            ...getApplicationJsonHeader()
        },
        body: JSON.stringify({ data: {token} })
    }).then(handleResponse);
};

export const logout = () => {
    clearAuthToken();
};