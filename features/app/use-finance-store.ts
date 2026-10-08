"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { budgets, categories, debts, receiptScans, savingsGoals, transactions, user, wallets } from "@/lib/mock-data";
import type { Budget, Category, Debt, ReceiptScan, SavingsGoal, Transaction, User, Wallet } from "@/types/finance";

type NewTransaction = Pick<Transaction, "type" | "amount" | "title" | "walletId" | "categoryId" | "description" | "transactionDate">;
type NewWallet = Pick<Wallet, "name" | "type" | "currentBalance">;
type NewSavingsGoal = Pick<SavingsGoal, "name" | "walletId" | "targetAmount" | "targetDate">;
type NewDebt = Pick<Debt, "type" | "personName" | "amount" | "dueDate" | "note">;

type FinanceState = {
  user: User;
  wallets: Wallet[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  debts: Debt[];
  receiptScans: ReceiptScan[];
  updateUser: (updates: Pick<User, "name" | "avatarUrl">) => void;
  addTransaction: (transaction: NewTransaction) => void;
  addWallet: (wallet: NewWallet) => void;
  addBudget: (categoryId: string, amount: number) => void;
  addSavingsGoal: (goal: NewSavingsGoal) => void;
  addDebt: (debt: NewDebt) => void;
  confirmReceipt: (receipt: ReceiptScan) => void;
  resetLocalDatabase: () => void;
};

const initialState = {
  user,
  wallets,
  categories,
  transactions,
  budgets,
  savingsGoals,
  debts,
  receiptScans,
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      ...initialState,
      updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
      addTransaction: (transaction) =>
        set((state) => {
          const newTransaction: Transaction = {
            ...transaction,
            id: crypto.randomUUID(),
            userId: state.user.id,
          };

          const wallets = state.wallets.map((wallet) => {
            if (wallet.id !== transaction.walletId) return wallet;
            const delta = transaction.type === "income" ? transaction.amount : -transaction.amount;
            return { ...wallet, currentBalance: wallet.currentBalance + delta };
          });

          const budgets = state.budgets.map((budget) => {
            if (transaction.type !== "expense" || budget.categoryId !== transaction.categoryId) return budget;
            return { ...budget, spentAmount: budget.spentAmount + transaction.amount };
          });

          return {
            transactions: [newTransaction, ...state.transactions],
            wallets,
            budgets,
          };
        }),
      addWallet: (wallet) =>
        set((state) => ({
          wallets: [
            ...state.wallets,
            { ...wallet, id: crypto.randomUUID(), userId: state.user.id, color: "#10aecb" },
          ],
        })),
      addBudget: (categoryId, amount) =>
        set((state) => ({
          budgets: [
            ...state.budgets,
            { id: crypto.randomUUID(), userId: state.user.id, categoryId, month: new Date().getMonth() + 1, year: new Date().getFullYear(), amount, spentAmount: 0 },
          ],
        })),
      addSavingsGoal: (goal) =>
        set((state) => ({
          savingsGoals: [
            ...state.savingsGoals,
            { ...goal, id: crypto.randomUUID(), userId: state.user.id, currentAmount: 0, status: "active" },
          ],
        })),
      addDebt: (debt) =>
        set((state) => ({
          debts: [
            ...state.debts,
            { ...debt, id: crypto.randomUUID(), userId: state.user.id, remainingAmount: debt.amount, status: "active" },
          ],
        })),
      confirmReceipt: (receipt) =>
        set((state) => ({
          receiptScans: [{ ...receipt, id: crypto.randomUUID(), userId: state.user.id, status: "confirmed" }, ...state.receiptScans],
        })),
      resetLocalDatabase: () => set(initialState),
    }),
    {
      name: "catat-keuangan-local-db",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        wallets: state.wallets,
        categories: state.categories,
        transactions: state.transactions,
        budgets: state.budgets,
        savingsGoals: state.savingsGoals,
        debts: state.debts,
        receiptScans: state.receiptScans,
      }),
    },
  ),
);
