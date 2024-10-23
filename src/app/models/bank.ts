
import { AadhaarDetails, ElectricityBillDetails, PanDetails } from "./kyc";

export type StateType = FileState &
  BillState &
  PanState &
  AdharState &
  BankState &
  ItrState;

export type BillFileState = FileState & BillState;
export type PanFileState = FileState & PanState;
export type AdharFileState = FileState & AdharState;
export type BankFileState = FileState & BankState;
export type FileState = {
  file: File;
};
export type BillState = {
  electricityBill: ElectricityBillDetails;
};
export type PanState = {
  pan: PanDetails;
};
export type AdharState = {
  aadhar: AadhaarDetails;
};
export type File = {
  ext: string;
  id: string;
  name: string;
};
export type BlockFileId = {
  blockId: string;
  fileId: string;
  blockState?: FileState;
};

export type BankState = {
  analysis: Analysis;
};

export enum DataFetchingStatus {
  pending = "pending",
  ready = "ready",
}
export enum ConsentStatus {
  requested = "requested",
  accepted = "accepted",
  rejected = "rejected",
}
export type Analysis = {
  id: string;
  status: BankStatementAnalysisStatus;
  statement?: Statement[];
  consentHandleId?: string;
  url?: string;
  dataFetchingStatus?: DataFetchingStatus;
  consentStatus?: ConsentStatus;
  sqsStatus?: string;
  // fileId?: UUID;
};
export enum BankStatementAnalysisStatus {
  requested = "requested",
  processing = "processing",
  processed = "processed",
  rejected = "rejected",
  pending = "pending",
}
export type Emi = {
  totalEmifromLastMonth: number | null;
  numberOfEmiPaidInLastMonth: number | null;
  averageMonthlyEmiInLast6Months: number | null;
};
export type Salary = {
  lastSalary: number | null;
  averageSalaryInLast3Months: number | null;
  numberOfSalariesInLast6Months: number | null;
};
export type Bussiness = {
  totalCredit: number | null;
  averageCreditInLast3Months: number | null;
  numberOfCreditsInLastMonth: number | null;
};
export type Statement = {
  emi: Emi;
  salary: Salary;
  monthly: MonthlyData[];
  bankName: string;
  business: Bussiness;
  accountNumber: string;
  monthlySummary: MonthlyChartData[];
  top10Creditors: TopTransections[];
  top10Debtors: TopTransections[];
  accountHolderDetails: AccountHolderDetails;
  monthalyEOD: MonthlyEOD[];
  insights: Insights;
};
export type Insights = {
  authenticityCheck: boolean;
  inwardBouncesCount: number;
  negativeBalanceCheck: boolean;
  outwardBouncesCount: number;
  regularIncomeCheck: boolean;
};
export type MonthlyEOD = {
  month: string;
  maxMonthlyBalance: string;
  minMonthlyBalance: string;
  averageMonthlyBalance: string;
};
export type OverviewAvarage = {
  openingBalance: string;
  closingBalance: string;
  avarageCredit: string;
  avarageDebit: string;
  avarageBalance: string;
};
export type AccountHolderDetails = {
  period: string;
  bankName: string;
  currency: string;
  accountNo: string;
  clientName: string;
  accountType: string;
  openingBalance?: string;
  closingBalance?: string;
};
export type TopTransections = {
  date: string;
  name: string;
  amount: string;
  total: string;
};
export type MonthlyData = {
  month: string;
  totalIncome: number;
  totalExpense: number;
  totalInvestment: number | null;
};
export type ChartData = {
  data: number[];
  label: string;
  color: string;
  strokeColor: string;
};

export type MonthlyChartData = {
  month: string;
  totalCreditAmount: number;
  totalDebitAmount: number;
  averageMonthlyBalance: number;
};

//ITR Types
export enum ItrAnalysisStatus {
  requested = "requested",
  processing = "processing",
  processed = "processed",
}

export type ItrState = {
  analysis: ItrAnalysis;
};

export type ItrAnalysis = {
  id: string;
  status: ItrAnalysisStatus;
  itrAnalysis: Itr;
  panNumber: string;
};
export type NumberOrString = string | number | null;

export type Itr = {
  totals: Totals;
  fillingDate: NumberOrString;
  capitalGains: CapitalGains;
  panNumber: string;
  year: NumberOrString;
};

export type Totals = {
  totalIncome: NumberOrString;
  totalTaxPaid: NumberOrString;
  totalShortTermGain: NumberOrString;
  totalLongTermGain: NumberOrString;
  totalTaxableIncome: NumberOrString;
  totalIncomeFromSalary: NumberOrString;
  totalIncomeFromOtherSources: NumberOrString;
};

export type CapitalGains = {
  shortTermCapitalGains: ShortTermCapitalGains[];
  longTermCapitalGains: LongTermCapitalGains[];
  incomeFromOtherSources: IncomeFromOtherSources[];
};

export type ShortTermCapitalGains = {
  year?: NumberOrString;
  shortTermGainsOnImmovableProperty?: NumberOrString;
  shortTermGainsFromSlumpSale?: NumberOrString;
  shortTermGainsOnEquitySharesOrEquityOrientedMF?: NumberOrString;
  forAnNRIButNotFIIStrongGainsOnSaleOfSharesOrDebenturesOfAnIndianCompany?: NumberOrString;
  forAnNRIAndFIIStrongGainsOnSaleOfSecurities?: NumberOrString;
  shortTermGainsOnOtherAssets?: NumberOrString;
};

export type LongTermCapitalGains = {
  year?: NumberOrString;
  longTermGainsOnImmovableProperty?: NumberOrString;
  longTermGainsFromSlumpSale?: NumberOrString;
  longTermGainsOnBondsOrDebentures?: NumberOrString;
  longTermGainsFromSaleOfListedSecurities?: NumberOrString;
  longTermGainsOnEquitySharesOrEquityOrientedFunds?: NumberOrString;
  forAnNRILongTermGainsOnSaleOfSharesOrDebenturesOfAnIndianCompany?: NumberOrString;
  forAnNRILongTermGainsOnSaleOfUnlistedSecurities?: NumberOrString;
  forAnNRILongTermGainsOnEquitySharesOrEquityOrientedFunds?: NumberOrString;
  forAnNRILongTermGainsOnSaleOfForeignExchangeAssets?: NumberOrString;
  longTermGainsOnOtherAssets?: NumberOrString;
};

export type IncomeFromOtherSources = {
  year: NumberOrString;
  incomeFromOtherSources: NumberOrString;
  incomeFromDividends?: NumberOrString;
  incomeFromInterest?: NumberOrString;
  rentalIncomeFromMachineryPlantsBuildingsEtc?: NumberOrString;
  incomeFromImmovablePropertyWithoutConsideration?: NumberOrString;
  anyOtherIncome?: NumberOrString;
  incomeChargeableAtSpecialRatesLotteriesPuzzlesOwningRaceHorsesEtc?: NumberOrString;
  adjustmentsUnderSection5758And59?: NumberOrString;
  incomeChargeableAtNormalRates: NumberOrString;
};

export type SkipKeys = {
  year: NumberOrString;
};
