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

  const options: any = { method: e.method };
  if (e.headers) {
    options.headers = e.headers;
  }
  if (e.data) {
    options.body = typeof e.data !== "string" ? JSON.stringify(e.data) : e.data;
  }

  if (onError) {
    return fetch(url, options).catch(onError);
  }
  return fetch(url, options);
};
