import axios from "axios";
import session from "@src/stores/session";
const config = require("../../../settings.json");
interface QueryOptions {
  onError?: (e?: any) => void;
  headers?: any;
}
export const query = async (
  q: string,
  payload?: any,
  options: QueryOptions = {}
) => {
  const headers = {
    "content-type": "application/json",
    ...options.headers
  };

  if (session && session.jwt) {
    headers["Authorization"] = `Bearer ${session.jwt}`;
  }
  
  try {
    const res = await axios.post(
      `http://${config.backend.host}:${config.backend.port}/hasura/v1/graphql`,
      {
        query: q,
        payload
      },
      {
        headers
      }
    );

    return res.data.data;
  } catch (e) {
    if (options && options.onError) {
      options.onError(e);
    }
    return false;
  }
};
