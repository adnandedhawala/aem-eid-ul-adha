import Airtable from "airtable";

const userBase = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base('appJRSy2D5uskffI2');
const fileBase = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base('app6OVAuKToFS8TQw');
const tokenBase = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base('appl71FVpl7YTG7Z9');

export const userTable = userBase("userList");
export const filesTable = fileBase("fileList");
export const tokensTable = tokenBase("tokens");