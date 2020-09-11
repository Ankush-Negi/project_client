import axios from 'axios';

const apiCall = async (apiData, endPoint, method) => {
  const URL = process.env.REACT_APP_BASE_URL + endPoint;
  console.log('value of url', URL);
  console.log('value of apiData', apiData);
  try {
  const response = await axios({
      method,
      url: URL,
      ...apiData,
    });
  console.log('got response', response);
  const { data } = response;
  return await data;
  } catch(error) {
    return ({ message: error.message, status: 'error' });
  }
};
export default apiCall;
