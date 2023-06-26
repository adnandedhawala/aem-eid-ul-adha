const isValidJSON = (inputString:string):boolean => {
  try {
    JSON.parse(inputString);
    return true;
  } catch {
    return false;
  }
};

export const handleResponse = (response:any) => {
  return response.text().then((text:any) => {
    const data = isValidJSON(text) ? JSON.parse(text) : text;
    if (!response.ok) {
      throw data;
    }
    return data;
  });
};

