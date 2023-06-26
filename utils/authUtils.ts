export const saveAuthToken = (token:string) => {
    localStorage.setItem("adha_user", token);
  };
  
  export const getAuthToken = () => {
    return localStorage.getItem("adha_user");
  };
  
  export const clearAuthToken = () => {
    localStorage.removeItem("adha_user");
  };
  
  export const getAuthHeader = () => {
    const accessToken = localStorage.getItem("adha_user");
    return { authorization: accessToken };
  };
  
  export const getApplicationJsonHeader = () => ({
    "Content-Type": "application/json"
  });