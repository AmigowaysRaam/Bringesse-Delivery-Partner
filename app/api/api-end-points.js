const BASE_URL = 'https://www.thundersgym.com/';
export const API_BASE_URL = `${BASE_URL}`;
/* ******  Authentication APIs Start ****** */
const APP_HOME_PAGE_API = {
  url: `${API_BASE_URL}app-home-page`,
  method: 'POST',
  responseDataKey: 'data',
};


export const API_REQUESTS = {
  APP_HOME_PAGE_API,
};
