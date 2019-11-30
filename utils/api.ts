import axios from "axios";
const config = require("../../../settings.json");

export default (e: any) => {
  let url = e.url;
  if (e.url.indexOf("http") !== 0) {
    url = `${config.backend.protocol}://${config.backend.host}:${config.backend.port}${e.url}`;
  }
  let onError = null;
  if (e.onError) {
    onError = e.onError;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios({ ...e, url });
      if (res.status >= 200 && res.status < 300) {
        resolve(res.data);
      } else {
        onError(res.data);
      }
    } catch (e) {
      if (onError) {
        onError(e.response.data);
      }
    }
  });
};
