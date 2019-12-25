import axios from "axios";

const URL = process.env.REACT_APP_CLOUD_FUNCTION_URL;

export default async (fn, data, options) => {
  const res = await axios.post(`${URL}/${fn}`, data, options);
  return res.data;
};
