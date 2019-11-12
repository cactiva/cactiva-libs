import axios from "axios";
const config = require("../../../settings.json");
class Api {
  getUrl(url: string) {
    if (url.indexOf("http:") === 0) return url;

    return `http://${config.backend.host}:${config.backend.port}${
      url.indexOf("/") === 0 ? url : "/" + url
    }`;
  }

  async get(url: string, opt?: any) {
    try {
      const res = await axios.get(this.getUrl(url), opt);
      return res.data;
    } catch (e) {
      if (opt && opt.onError) opt.onError(e);
    }
  }
  async post(url: string, body?: any, opt?: any) {
    try {
      const res = await axios.post(this.getUrl(url), body, opt);
      return res.data;
    } catch (e) {
      if (opt && opt.onError) opt.onError(e);
    }
  }

  stream(url: string, options?: any) {
    const ws = new WebSocket(url);

    for (let i in options) {
      ws[i] = options[i];
    }
  }
}

export default new Api();
