export type BillState = {
  electricityBill: ElectricityBillDetails;
};
export type PanState = {
  pan: PanDetails;
};
export type AdharState = {
  aadhar: AadhaarDetails;
};

export type PanDetails = {
  panNumber: string;
  fullName: string;
  maskedAadhaar: string;
  address: string;
  gender: string;
  birthDate: string;
  aadhaarLinked: boolean;
};

export type AadhaarDetails = {
  adhaarNumber: string;
  birthDate: string;
  fullName: string;
  gender: string;
  profileImage: string;
  address: string;
};
export type ElectricityBillDetails = {
  customerId: string;
  operatorCode: string;
  state: string;
  fullName: string;
  address: string;
  id: string | null;
  amount: string;
};

export type ElectricityProvider = {
  electricityBoardName: string;
  electricityProvider: string;
  code: string;
};