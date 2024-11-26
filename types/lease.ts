export interface Lease {
  id: number;
  carModel: string;
  msrp: number;
  negotiatedPrice: number;
  residualValue: number;
  moneyFactor: number;
  leaseTerm: number;
  downPayment: number;
  taxRate: number;
  fees: number;
  acquisitionFee: number;
  expectedInsurance: number;
  totalCost: number;
  monthlyPayment: number;
  totalMonthlyPayment: number;
  depreciationCost: number;
  financeCharges: number;
  totalTaxes: number;
  adjustedCapCost: number;
  apr: number;
} 
