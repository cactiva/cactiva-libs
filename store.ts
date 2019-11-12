import { observable, observe, toJS } from "mobx";
import { AsyncStorage } from "react-native";

const storage = AsyncStorage;

export default (name: string, data: any) => {
  const initData = data;
  const vname = `store.${name}`;
  const obs = observable(initData);
  setTimeout(async () => {
    const sData = await storage.getItem(vname);
    if (sData) {
      try {
        const data = JSON.parse(sData);
        for (let i in data) {
          obs[i] = data[i];
        }
      } catch (e) {}
    }
  });

  observe(obs, () => {
    storage.setItem(vname, JSON.stringify(obs));
  });

  return obs;
};
