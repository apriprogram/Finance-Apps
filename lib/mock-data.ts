import type { Budget, Category, Debt, ReceiptScan, ReportPoint, SavingsGoal, Transaction, User, Wallet } from "@/types/finance";

export const user: User = {
  id: "user-andi",
  name: "Andi",
  email: "andi@catatkeuangan.id",
  currency: "IDR",
};

export const wallets: Wallet[] = [
  { id: "wallet-bca", userId: user.id, name: "BCA Salary", type: "bank", currentBalance: 14250000, color: "#2563eb" },
  { id: "wallet-cash", userId: user.id, name: "Cash", type: "cash", currentBalance: 1750000, color: "#16a34a" },
  { id: "wallet-gopay", userId: user.id, name: "GoPay", type: "ewallet", currentBalance: 1250000, color: "#0891b2" },
  { id: "wallet-saving", userId: user.id, name: "Tabungan BCA", type: "savings", currentBalance: 7500000, color: "#1d4ed8" },
];

export const categories: Category[] = [
  { id: "cat-salary", userId: user.id, name: "Gaji", type: "income", icon: "WalletCards", color: "#16a34a", isDefault: true },
  { id: "cat-business", userId: user.id, name: "Bisnis", type: "income", icon: "Store", color: "#0ea5e9" },
  { id: "cat-project", userId: user.id, name: "Freelance", type: "income", icon: "BriefcaseBusiness", color: "#059669" },
  { id: "cat-savings", userId: user.id, name: "Tabungan", type: "income", icon: "PiggyBank", color: "#3b82f6" },
  { id: "cat-gift", userId: user.id, name: "Hadiah", type: "income", icon: "Gift", color: "#ec4899" },
  { id: "cat-other-inc", userId: user.id, name: "Lainnya", type: "income", icon: "LayoutGrid", color: "#64748b" },
  { id: "cat-food", userId: user.id, name: "Makanan", type: "expense", icon: "Utensils", color: "#f97316", isDefault: true },
  { id: "cat-shop", userId: user.id, name: "Belanja", type: "expense", icon: "ShoppingBag", color: "#ef4444" },
  { id: "cat-entertain", userId: user.id, name: "Hiburan", type: "expense", icon: "Gamepad2", color: "#2563eb" },
  { id: "cat-transport", userId: user.id, name: "Transportasi", type: "expense", icon: "Bus", color: "#2563eb" },
  { id: "cat-bill", userId: user.id, name: "Tagihan", type: "expense", icon: "ReceiptText", color: "#eab308" },
  { id: "cat-health", userId: user.id, name: "Kesehatan", type: "expense", icon: "HeartPulse", color: "#dc2626" },
  { id: "cat-edu", userId: user.id, name: "Pendidikan", type: "expense", icon: "GraduationCap", color: "#14b8a6" },
  { id: "cat-other-exp", userId: user.id, name: "Lainnya", type: "expense", icon: "LayoutGrid", color: "#64748b" },
];

export const transactions: Transaction[] = [
  { id: "trx-1", userId: user.id, walletId: "wallet-bca", categoryId: "cat-salary", type: "income", amount: 8000000, title: "Gaji Bulanan", description: "Income - BCA", transactionDate: "2026-07-10" },
  { id: "trx-2", userId: user.id, walletId: "wallet-cash", categoryId: "cat-shop", type: "expense", amount: 450000, title: "Belanja Bulanan", description: "Expense - Superindo", transactionDate: "2026-07-10" },
  { id: "trx-3", userId: user.id, walletId: "wallet-gopay", categoryId: "cat-food", type: "expense", amount: 45000, title: "Makan Siang", description: "Expense - GoFood", transactionDate: "2026-07-09" },
  { id: "trx-4", userId: user.id, walletId: "wallet-bca", categoryId: "cat-project", type: "income", amount: 2500000, title: "Freelance Project", description: "Income - BRI", transactionDate: "2026-07-08" },
  { id: "trx-5", userId: user.id, walletId: "wallet-gopay", categoryId: "cat-transport", type: "expense", amount: 25000, title: "Transportasi", description: "Expense - Grab", transactionDate: "2026-07-08" },
  { id: "trx-6", userId: user.id, walletId: "wallet-bca", categoryId: "cat-entertain", type: "expense", amount: 75000, title: "Pulsa Internet", description: "Expense - Telkomsel", transactionDate: "2026-07-06" },
  { id: "trx-7", userId: user.id, walletId: "wallet-cash", categoryId: "cat-food", type: "expense", amount: 38000, title: "Kopi", description: "Expense - Starbucks", transactionDate: "2026-07-05" },
  { id: "trx-8", userId: user.id, walletId: "wallet-bca", categoryId: "cat-salary", type: "transfer", amount: 1000000, title: "Transfer ke Tabungan", description: "Transfer - Tabungan", transactionDate: "2026-07-03" },
];

export const budgets: Budget[] = [
  { id: "budget-food", userId: user.id, categoryId: "cat-food", month: 7, year: 2026, amount: 2000000, spentAmount: 1200000 },
  { id: "budget-transport", userId: user.id, categoryId: "cat-transport", month: 7, year: 2026, amount: 800000, spentAmount: 450000 },
  { id: "budget-shop", userId: user.id, categoryId: "cat-shop", month: 7, year: 2026, amount: 1500000, spentAmount: 1000000 },
  { id: "budget-entertain", userId: user.id, categoryId: "cat-entertain", month: 7, year: 2026, amount: 500000, spentAmount: 200000 },
  { id: "budget-health", userId: user.id, categoryId: "cat-health", month: 7, year: 2026, amount: 700000, spentAmount: 300000 },
];

export const savingsGoals: SavingsGoal[] = [
  { id: "goal-emergency", userId: user.id, walletId: "wallet-saving", name: "Dana Darurat", targetAmount: 10000000, currentAmount: 3500000, targetDate: "2026-12-31", status: "active" },
  { id: "goal-japan", userId: user.id, walletId: "wallet-saving", name: "Liburan Jepang", targetAmount: 15000000, currentAmount: 2000000, targetDate: "2027-06-30", status: "active" },
  { id: "goal-laptop", userId: user.id, walletId: "wallet-saving", name: "Beli Laptop", targetAmount: 12000000, currentAmount: 1000000, targetDate: "2026-12-31", status: "active" },
];

export const debts: Debt[] = [
  { id: "debt-andi", userId: user.id, type: "debt", personName: "Andi", amount: 2000000, remainingAmount: 2000000, dueDate: "2026-07-30", status: "active", note: "Hutang ke Andi" },
  { id: "debt-budi", userId: user.id, type: "debt", personName: "Budi", amount: 1500000, remainingAmount: 1500000, dueDate: "2026-07-15", status: "overdue", note: "Hutang ke Budi" },
  { id: "recv-sari", userId: user.id, type: "receivable", personName: "Sari", amount: 1200000, remainingAmount: 1200000, dueDate: "2026-07-20", status: "active", note: "Piutang dari Sari" },
  { id: "recv-dika", userId: user.id, type: "receivable", personName: "Dika", amount: 600000, remainingAmount: 600000, dueDate: "2026-07-10", status: "overdue", note: "Piutang dari Dika" },
];

export const receiptScans: ReceiptScan[] = [
  { id: "scan-1", userId: user.id, merchantName: "Alfamart", detectedAmount: 56500, detectedDate: "2026-07-10", status: "processed" },
];

export const reportPoints: ReportPoint[] = [
  { label: "1 Jul", income: 2800000, expense: 1200000 },
  { label: "7 Jul", income: 6500000, expense: 2500000 },
  { label: "14 Jul", income: 7300000, expense: 3600000 },
  { label: "21 Jul", income: 4800000, expense: 4100000 },
  { label: "28 Jul", income: 6100000, expense: 2900000 },
];
