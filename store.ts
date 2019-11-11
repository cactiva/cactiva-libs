import { observable, observe, toJS } from "mobx";
import FastStorage from "react-native-fast-storage";

const storage = FastStorage;

export default (name: string, data: any) => {
  const initData = data;
  const vname = `store.${name}`;
  const sData = storage.getItem(vname);
  let obs = null;
  if (sData) {
    obs = observable(JSON.parse(sData));
  } else {
    obs = observable(initData);
  }

  observe(obs, () => {
    storage.setItem(vname, JSON.stringify(obs));
  });

  return obs;
};
