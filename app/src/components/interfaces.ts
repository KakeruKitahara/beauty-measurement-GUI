export type Profile = {
  name: string;
  sex: string;
};

export type Morphing = {
  type: string;
  path: string;
  no: number;
};

export type Result = {
  type: string;
  no: number;
  ans: number;
  comment: string;
};

export type Data = {
  profile: Profile;
  results: Result[];
};

export const sort_func = (a: Result, b: Result) => {
  if (a.type > b.type) return 1;
  if (a.type < b.type) return -1;
  if (a.no > b.no) return -1;
  if (a.no < b.no) return 1;
  return 0;
};
