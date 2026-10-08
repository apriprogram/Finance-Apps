import type { Budget, SavingsGoal, Transaction, Wallet } from "@/types/finance";

export function getTotalBalance(wallets: Wallet[]) {
  return wallets.reduce((total, wallet) => total + wallet.currentBalance, 0);
}

export function getMonthlyIncome(transactions: Transaction[]) {
  return transactions.filter((item) => item.type === "income").reduce((total, item) => total + item.amount, 0);
}

export function getMonthlyExpense(transactions: Transaction[]) {
  return transactions.filter((item) => item.type === "expense").reduce((total, item) => total + item.amount, 0);
}

export function getSavingsTotal(goals: SavingsGoal[]) {
  return goals.reduce((total, goal) => total + goal.currentAmount, 0);
}

export function getBudgetUsage(budgets: Budget[]) {
  const amount = budgets.reduce((total, budget) => total + budget.amount, 0);
  const spent = budgets.reduce((total, budget) => total + budget.spentAmount, 0);
  return { amount, spent };
}
