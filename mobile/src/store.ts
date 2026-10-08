import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TransactionType = "expense" | "income";

export type Wallet = {
  id: string;
  name: string;
  balance: number;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  walletId: string;
  note: string;
  date: string;
};

type NewTransaction = Omit<Transaction, "id">;

type FinanceState = {
  wallets: Wallet[];
  transactions: Transaction[];
  addTransaction: (transaction: NewTransaction) => void;
};

const initialWallets: Wallet[] = [
  { id: "main", name: "Buku Utama", balance: 5_677_000 },
  { id: "cash", name: "Tunai", balance: 1_250_000 },
  { id: "bank", name: "Rekening Bank", balance: 4_427_000 },
];

const initialTransactions: Transaction[] = [
  { id: "sample-1", type: "expense", amount: 100_000, category: "Belanja", walletId: "main", note: "", date: "2026-07-11" },
  { id: "sample-2", type: "expense", amount: 40_000, category: "Makanan", walletId: "main", note: "", date: "2026-07-11" },
  { id: "sample-3", type: "income", amount: 50_000, category: "Lainnya", walletId: "main", note: "", date: "2026-07-11" },
  { id: "sample-4", type: "expense", amount: 200_000, category: "Belanja", walletId: "main", note: "", date: "2026-07-11" },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      wallets: initialWallets,
      transactions: initialTransactions,
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            {
              ...transaction,
              id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            },
            ...state.transactions,
          ],
          wallets: state.wallets.map((wallet) =>
            wallet.id === transaction.walletId
              ? {
                  ...wallet,
                  balance:
                    wallet.balance +
                    (transaction.type === "income" ? transaction.amount : -transaction.amount),
                }
              : wallet,
          ),
        })),
    }),
    {
      name: "catat-keuangan-mobile-db",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
