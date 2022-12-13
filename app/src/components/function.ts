import { Result, Morphing } from "./interfaces";

export const rest_num: number = 2; // 休憩総数
export const rest_time: number = 10; // 休憩時間（分）

export const sortFunc = (a: Result, b: Result) => {
  if (a.type > b.type) return 1;
  if (a.type < b.type) return -1;
  if (a.name > b.name) return -1;
  if (a.name < b.name) return 1;
  return 0;
};

export const randSort = (morphing: Morphing[]) => {
  for (let i = morphing.length - 1; 0 < i; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    [morphing[i], morphing[r]] = [morphing[r], morphing[i]];
  }
};

export const RestPositioning = (jlen: number, rnum: number) => {
  const radix = Math.floor(jlen / (rnum + 1));
  const plus_element = jlen % (rnum + 1);
  return [radix, plus_element];
};
