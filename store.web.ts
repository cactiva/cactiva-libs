import { observable, observe, toJS } from "mobx";

const storage = localStorage;

export default (name: string, data: any) => {
  const initData = data;
  const vname = `store.${name}`;
  const obs = observable(initData);
  setTimeout(async () => {
    const sjson = await storage.getItem(vname);
    if (sjson) {
      const sdata = JSON.parse(sjson);
      Object.keys(sdata).map(s => {
        console.log(s);
      });
    }
  });
  observe(obs, () => {
    storage.setItem(vname, JSON.stringify(obs));
  });

  return obs;
};
