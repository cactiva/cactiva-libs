import api from "./api";
import session from "@src/stores/session";
const config = require("../../../settings.json");
interface QueryOptions {
  onError?: (e?: any) => void;
  payload?: any;
  headers?: any;
  auth?: boolean;
}
export const queryAll = async (q: string, options: QueryOptions = {}) => {
  const headers = {
    "content-type": "application/json",
    ...options.headers
  };

  if (options.auth !== false && session && session.jwt) {
    headers["Authorization"] = `Bearer ${session.jwt}`;
  }

  try {
    const res: any = await api({
      url: `${config.backend.protocol}://${config.backend.host}:${config.backend.port}/hasura/v1/graphql`,
      method: "post",
      headers,
      data: {
        query: q,
        payload: options.payload
      }
    });

    if (res && res.data) {
      return res.data;
    } else {
      return res;
    }
  } catch (e) {
    if (options && options.onError) {
      options.onError(e);
    }
    return false;
  }
};

export const querySingle = async (q: string, options: QueryOptions = {}) => {
  const res = await queryAll(q, options);
  if (res) {
    const table = Object.keys(res);
    if (table.length > 0 && res[table[0]] && res[table[0]].length > 0) {
      return res[table[0]][0];
    } else {
      return null;
    }
  }
  return res;
};
