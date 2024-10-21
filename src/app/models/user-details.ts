export type StringOrNull = string | null;

export type UserDetails = {
  id?: number;
  email?: string;
};
export type Token = {
  accessToken: string;
  refreshToken: string;
};
export type LoginForm = {
  mobileNumber: string;
};

export type UserInfo = {
  bankId: StringOrNull;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  role: string;
};

export type CallBackEvent = {
  type: string;
};

export type UserModel = UserInfo & {
  fullName: string;
  initials: string;
};
