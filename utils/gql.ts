import api from "./api";
import session from "@src/stores/session";
const config = require("../../../settings.json");
interface QueryOptions {
  onError?: (e?: any) => void;
  payload?: any;
  headers?: any;
  auth?: boolean;
}
export const query = async (q: string, options: QueryOptions = {}) => {
  const headers = {
    "content-type": "application/json",
    ...options.headers
  };

  if (session && session.jwt) {
    headers["Authorization"] = `Bearer ${session.jwt}`;
  }

  try {
    const res = await api({
      url: `${config.backend.protocol}://${config.backend.host}:${config.backend.port}/hasura/v1/graphql`,
      method: "post",
      data: {
        query: q,
        payload: options.payload
      }
    });

    console.log(res);
  } catch (e) {
    if (options && options.onError) {
      options.onError(e);
    }
    return false;
  }
};
