import { observable, observe, toJS } from "mobx";
import { AsyncStorage } from "react-native";

const storage = AsyncStorage;

export default (name: string, data: any) => {
  const initData = data;
  const vname = `store.${name}`;
  const sData = storage.getItem(vname);
  let obs = observable(initData);
  sData
    .then(res => {
      let newData = JSON.parse(res);
      if (res) {
        for (let i in obs) {
          delete obs[i];
        }
        for (let i in newData) {
          obs[i] = newData[i];
        }
      } else {
        storage.setItem(vname, JSON.stringify(obs));
      }
    })
    .finally(() => {
      observe(obs, () => {
        storage.setItem(vname, JSON.stringify(obs));
      });
    });

  return obs;
};
