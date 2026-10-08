export type TransactionType = "income" | "expense" | "transfer";
export type WalletType = "cash" | "bank" | "ewallet" | "savings";
export type DebtType = "debt" | "receivable";
export type DebtStatus = "active" | "paid" | "overdue";

export type User = {
  id: string;
  name: string;
  email: string;
  currency: "IDR";
};

export type Wallet = {
  id: string;
  userId: string;
  name: string;
  type: WalletType;
  currentBalance: number;
  color: string;
};

export type Category = {
  id: string;
  userId: string;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
  isDefault?: boolean;
};

export type Transaction = {
  id: string;
  userId: string;
  walletId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  title: string;
  description?: string;
  transactionDate: string;
  receiptScanId?: string;
};

export type Budget = {
  id: string;
  userId: string;
  categoryId: string;
  month: number;
  year: number;
  amount: number;
  spentAmount: number;
};

export type SavingsGoal = {
  id: string;
  userId: string;
  walletId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: "active" | "completed" | "cancelled";
};

export type Debt = {
  id: string;
  userId: string;
  type: DebtType;
  personName: string;
  amount: number;
  remainingAmount: number;
  dueDate: string;
  status: DebtStatus;
  note?: string;
};

export type ReceiptScan = {
  id: string;
  userId: string;
  merchantName: string;
  detectedAmount: number;
  detectedDate: string;
  status: "pending" | "processed" | "failed" | "confirmed";
};

export type ReportPoint = {
  label: string;
  income: number;
  expense: number;
};
