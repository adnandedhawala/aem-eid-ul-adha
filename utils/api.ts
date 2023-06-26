import get from "lodash/get";

const prefix =
  (process.env.NEXT_PUBLIC_ROOT_API_URL || "http://localhost:3000") +
  "/api/";

const API = {
  login: "/login",
  verify: "/verify",
  reciepts: "/reciepts",
};

export const getApiUrl = (urlName:string) => prefix + get(API, urlName);
