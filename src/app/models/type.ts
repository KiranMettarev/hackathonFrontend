export type DocRequest = {
  customerId?: string;
  operatorCode?: string;
  panNumber?: string;
  clinetId?: string;
  otp?: string;
  mobileNumber?: string;
};

export enum BlockStatus {
  inProgress = "inProgress",
  accepted = "accepted",
  rejected = "rejected",
}