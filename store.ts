import { observable, observe, toJS } from "mobx";
import { AsyncStorage } from "react-native";

const storage = AsyncStorage;

export default (name: string, data: any) => {
  const initData = data;
  // Object.keys(data).map(k => {
  //   initData[k] = observable(data[k]);
  // });
  const vname = `store.${name}`;
  const sData = storage.getItem(vname);
  let obs = observable(initData);
  sData
    .then(res => {
      if (res) {
        let newData = JSON.parse(res);
        for (let i in newData) {
          obs[i] = observable(newData[i]);
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

  return obs as any;
};
