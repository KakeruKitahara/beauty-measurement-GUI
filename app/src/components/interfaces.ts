export type Profile = {
  name: string;
  sex: string;
};

export type Morphing = {
  type: string;
  path: string;
  name: string;
};

export type Result = {
  type: string;
  name: string;
  ans: number;
  comment: string;
};

export type Data = {
  profile: Profile;
  results: Result[];
};