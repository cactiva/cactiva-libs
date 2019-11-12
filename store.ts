import { observable, observe, toJS } from "mobx";
import { AsyncStorage } from "react-native";

const storage = AsyncStorage;

export default (name: string, data: any) => {
  const initData = data;
  const vname = `store.${name}`;
  const sData = storage.getItem(vname);
  let obs = observable(initData);
  sData.then(res => {
    if (res) obs = observable(JSON.parse(res));
  });

  observe(obs, () => {
    storage.setItem(vname, JSON.stringify(obs));
  });

  return obs;
};
