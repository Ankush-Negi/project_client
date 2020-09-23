import axios from 'axios';

const apiCall = async (apiData, endPoint, method) => {
  const URL = process.env.REACT_APP_BASE_URL + endPoint;
  try {
  const response = await axios({
      method,
      url: URL,
      ...apiData,
    });
  const { data } = response;
  return await data;
  } catch(error) {
    return ({ message: error.message, status: 'error' });
  }
};
export default apiCall;
