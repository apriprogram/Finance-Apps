"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronDown,
  Eye,
  FileText,
  Moon,
  Plus,
  ReceiptText,
  Send,
  Sun,
  WalletCards,
} from "lucide-react";

import { getMonthlyExpense, getMonthlyIncome, getTotalBalance } from "@/lib/calculations";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/lib/use-click-outside";
import { useFinanceStore } from "./use-finance-store";

type DashboardV2Props = {
  onAdd: () => void;
  onTransactions: () => void;
  onNavigate: (view: "debt" | "reports") => void;
  language?: "id" | "en";
};

const periods = ["Hari", "Minggu", "Bulan", "Tahun"] as const;
const englishPeriods: Record<(typeof periods)[number], string> = { Hari: "Day", Minggu: "Week", Bulan: "Month", Tahun: "Year" };
const englishDataLabels: Record<string, string> = { Makanan: "Food", Belanja: "Shopping", Hiburan: "Entertainment", Transportasi: "Transportation", Tagihan: "Bills", Kesehatan: "Health", Pendidikan: "Education", Lainnya: "Other", Gaji: "Salary", Bisnis: "Business", Tabungan: "Savings", Hadiah: "Gift", "Gaji Bulanan": "Monthly Salary", "Belanja Bulanan": "Monthly Shopping", "Makan Siang": "Lunch", "Pulsa Internet": "Mobile Data", Kopi: "Coffee", "Transfer ke Tabungan": "Transfer to Savings", "Tabungan BCA": "BCA Savings" };
const englishMonths: Record<string, string> = { "Agustus 2026": "August 2026", "September 2026": "September 2026", "Oktober 2026": "October 2026" };

export function DashboardV2({ onAdd, onTransactions, onNavigate, language = "id" }: DashboardV2Props) {
  const { user, wallets, transactions, categories } = useFinanceStore();
  const [period, setPeriod] = useState<(typeof periods)[number]>("Bulan");
  const [isDark, setIsDark] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Oktober 2026");
  const [selectedWalletId, setSelectedWalletId] = useState("all");
  const notificationRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLDivElement>(null);
  const closeNotifications = useCallback(() => setIsNotificationsOpen(false), []);
  const closePeriod = useCallback(() => setIsPeriodOpen(false), []);
  const closeWallet = useCallback(() => setIsWalletOpen(false), []);
  useClickOutside(notificationRef, isNotificationsOpen, closeNotifications);
  useClickOutside(periodRef, isPeriodOpen, closePeriod);
  useClickOutside(walletRef, isWalletOpen, closeWallet);
  const totalBalance = getTotalBalance(wallets);
  const income = getMonthlyIncome(transactions);
  const expense = getMonthlyExpense(transactions);
  const selectedWallet = wallets.find((wallet) => wallet.id === selectedWalletId);
  const displayedBalance = selectedWallet?.currentBalance ?? totalBalance;
  const recent = useMemo(() => transactions.slice(0, 6), [transactions]);
  const isEnglish = language === "en";

  useEffect(() => {
    const saved = localStorage.getItem("catat-keuangan-theme");
    const dark = saved ? saved === "dark" : false;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("catat-keuangan-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <div className="dashboard-v2 h-full min-w-0 overflow-x-hidden overflow-y-auto pb-28 text-[#182131] dark:text-[#eff4fb] md:pb-8">
      <header className="relative z-20 w-full min-w-0 bg-transparent px-4 text-[#171717] dark:text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex h-[74px] w-full min-w-0 max-w-[1180px] items-center gap-3">
          <img src={user.avatarUrl || "/images/profile-andi.png"} alt={`${isEnglish ? "Profile photo" : "Foto profil"} ${user.name}`} className="h-11 w-11 shrink-0 rounded-full object-cover" />
          <div className="min-w-0 max-w-[180px] sm:max-w-none"><h1 className="truncate text-[15px] font-semibold leading-5 tracking-[-0.01em]">{user.name}</h1></div>
          <div className="flex-1" />
          <div className="hidden sm:block">
            <button onClick={toggleTheme} aria-label={isDark ? (isEnglish ? "Enable light mode" : "Aktifkan mode terang") : (isEnglish ? "Enable dark mode" : "Aktifkan mode gelap")} className="dashboard-icon-button">
              {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>
          </div>
          <div ref={notificationRef} className="relative">
            <button onClick={() => { setIsNotificationsOpen((value) => !value); setIsPeriodOpen(false); setIsWalletOpen(false); }} aria-label="Notifikasi" aria-expanded={isNotificationsOpen} className="dashboard-icon-button liquid-button relative text-slate-700 dark:text-white">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500 ring-2 ring-white/70 motion-breathe" />
            </button>
            {isNotificationsOpen && (
              <div className="glass-strong animate-card absolute right-0 top-12 z-40 w-72 rounded-[18px] p-3 text-left">
                <p className="text-[12px] font-semibold">{isEnglish ? "Notifications" : "Notifikasi"}</p>
                <p className="mt-2 rounded-[12px] bg-blue-50 p-3 text-[11px] leading-4 text-slate-600 dark:bg-blue-950/30 dark:text-slate-300">{isEnglish ? "This month's financial summary has been updated." : "Ringkasan keuangan bulan ini sudah diperbarui."}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full min-w-0 max-w-[1180px] px-4 py-4 sm:px-6 lg:px-8 lg:py-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-normal leading-4 text-slate-500 dark:text-slate-400">{isEnglish ? "Financial summary" : "Ringkasan keuangan"}</p>
            <h2 className="mt-0.5 text-[21px] font-semibold leading-7 tracking-[-0.02em] text-[#171717] sm:text-[24px] dark:text-white">{isEnglish ? englishMonths[selectedMonth] : selectedMonth}</h2>
          </div>
          <div ref={periodRef} className="relative">
            <button onClick={() => { setIsPeriodOpen((value) => !value); setIsNotificationsOpen(false); setIsWalletOpen(false); }} aria-expanded={isPeriodOpen} className="liquid-button inline-flex h-11 items-center gap-2 rounded-full border-black/10 bg-white/72 px-3.5 text-[12px] font-medium text-[#242424] dark:text-white">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden xs:inline">{isEnglish ? "Period" : "Periode"}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isPeriodOpen && "rotate-180")} />
            </button>
            {isPeriodOpen && (
              <div className="glass-strong animate-card absolute right-0 top-12 z-30 w-44 rounded-[16px] p-1.5">
                {["Agustus 2026", "September 2026", "Oktober 2026"].map((month) => (
                  <button key={month} onClick={() => { setSelectedMonth(month); setIsPeriodOpen(false); }} className={cn("flex h-10 w-full items-center rounded-[10px] px-3 text-left text-[11px] transition-colors", selectedMonth === month ? "bg-slate-200 text-slate-900 dark:bg-white/12 dark:text-white" : "hover:bg-slate-100 dark:hover:bg-white/5")}>{isEnglish ? englishMonths[month] : month}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
          {periods.map((item) => (
            <button
              key={item}
              onClick={() => setPeriod(item)}
              className={cn(
                "h-10 min-w-[74px] rounded-full border px-4 text-[12px] font-medium transition-colors",
                period === item
                  ? "liquid-button liquid-button-primary"
                  : "liquid-button border-white/65 bg-white/54 text-[#5d5570] hover:text-blue-600 dark:text-[#ded7e8]",
              )}
            >
              {isEnglish ? englishPeriods[item] : item}
            </button>
          ))}
        </div>

        <div className="grid w-full min-w-0 gap-4 lg:grid-cols-[minmax(0,1.16fr)_minmax(0,.84fr)]">
          <section className="animate-card glass-surface relative min-w-0 max-w-full overflow-hidden rounded-[22px] p-5 sm:p-6">

            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium leading-4 text-[#758398] dark:text-[#c7d5e8]">{isEnglish ? "Available balance" : "Saldo tersedia"}</p>
                <p className="money-value mt-3 break-words text-[29px] font-semibold leading-9 tracking-[-0.03em] text-[#182131] sm:text-[36px] dark:text-white">{isBalanceVisible ? formatCurrency(displayedBalance) : "Rp ••••••••"}</p>
              </div>
              <button onClick={() => setIsBalanceVisible((value) => !value)} aria-label={isBalanceVisible ? "Sembunyikan saldo" : "Tampilkan saldo"} className="liquid-button flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-blue-600 dark:text-blue-400">
                <Eye className="h-[17px] w-[17px]" />
              </button>
            </div>

            <div ref={walletRef} className="relative mt-4 w-fit">
              <button onClick={() => { setIsWalletOpen((value) => !value); setIsNotificationsOpen(false); setIsPeriodOpen(false); }} aria-expanded={isWalletOpen} className="liquid-button relative inline-flex h-9 items-center gap-2 rounded-full px-3 text-[11px] font-medium text-[#526176] dark:text-[#e4edf8]">
                <WalletCards className="h-4 w-4" /> {selectedWallet ? (isEnglish ? (englishDataLabels[selectedWallet.name] ?? selectedWallet.name) : selectedWallet.name) : (isEnglish ? "All wallets" : "Semua dompet")} <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isWalletOpen && "rotate-180")} />
              </button>
              {isWalletOpen && (
                <div className="glass-strong animate-card absolute left-0 top-11 z-30 w-52 rounded-[16px] p-1.5">
                  {[{ id: "all", name: isEnglish ? "All wallets" : "Semua dompet" }, ...wallets].map((wallet) => (
                    <button key={wallet.id} onClick={() => { setSelectedWalletId(wallet.id); setIsWalletOpen(false); }} className={cn("flex h-10 w-full items-center rounded-[10px] px-3 text-left text-[11px] transition-colors", selectedWalletId === wallet.id ? "bg-blue-600 text-white" : "hover:bg-blue-50 dark:hover:bg-white/5")}>{isEnglish ? (englishDataLabels[wallet.name] ?? wallet.name) : wallet.name}</button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative mt-7 grid min-w-0 grid-cols-[repeat(2,minmax(0,1fr))] gap-2.5">
              <BalanceStat icon={ArrowDownLeft} label={isEnglish ? "Income" : "Pemasukan"} value={formatCurrency(income)} tone="positive" delay="stagger-1" />
              <BalanceStat icon={ArrowUpRight} label={isEnglish ? "Expense" : "Pengeluaran"} value={formatCurrency(expense)} tone="negative" delay="stagger-2" />
            </div>
          </section>

          <section className="glass-surface min-w-0 max-w-full rounded-[22px] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="type-card-title">{isEnglish ? "Quick access" : "Akses cepat"}</h3>
                <p className="type-caption mt-0.5 text-[#758398] dark:text-[#a7b6bd]">{isEnglish ? "Manage your money more easily" : "Kelola uangmu lebih praktis"}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-medium text-slate-700 dark:bg-white/7 dark:text-slate-200">{isEnglish ? "4 menus" : "4 menu"}</span>
            </div>
            <div className="mt-4 grid min-w-0 grid-cols-[repeat(4,minmax(0,1fr))] gap-1.5 sm:gap-2 lg:grid-cols-2">
              <QuickAction icon={Plus} label={isEnglish ? "Add" : "Tambah"} onClick={onAdd} primary delay="stagger-1" />
              <QuickAction icon={Send} label="Transfer" onClick={onAdd} delay="stagger-2" />
              <QuickAction icon={ReceiptText} label={isEnglish ? "Bills" : "Tagihan"} onClick={() => onNavigate("debt")} delay="stagger-3" />
              <QuickAction icon={FileText} label={isEnglish ? "Reports" : "Laporan"} onClick={() => onNavigate("reports")} delay="stagger-4" />
            </div>
          </section>
        </div>

        <section className="glass-surface mt-4 min-w-0 max-w-full rounded-[22px] p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <h3 className="type-card-title">{isEnglish ? "Recent activity" : "Aktivitas terbaru"}</h3>
              <p className="type-caption mt-0.5 text-[#758398] dark:text-[#a7b6bd]">{isEnglish ? "Latest transactions from all wallets" : "Transaksi paling baru dari semua dompet"}</p>
            </div>
            <button onClick={onTransactions} className="h-9 shrink-0 rounded-full px-3 text-[11px] font-medium text-black transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-white/5">{isEnglish ? "See all" : "Lihat semua"}</button>
          </div>

          <div className="divide-y divide-slate-200/70 dark:divide-white/7">
            {recent.map((transaction, index) => {
              const category = categories.find((item) => item.id === transaction.categoryId);
              const isIncome = transaction.type === "income";
              return (
                <button key={transaction.id} onClick={onTransactions} style={{ animationDelay: `${index * 45}ms` }} className="motion-pop group flex w-full items-center gap-3 py-3.5 text-left transition-transform hover:translate-x-1">
                  <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border", isIncome ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800/60 dark:bg-emerald-950/35 dark:text-emerald-400" : "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-400") }>
                    {isIncome ? <ArrowDownLeft className="h-[18px] w-[18px]" /> : <ArrowUpRight className="h-[18px] w-[18px]" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium group-hover:text-black dark:group-hover:text-white">{isEnglish ? (englishDataLabels[transaction.title] ?? transaction.title) : transaction.title}</span>
                    <span className="mt-0.5 block truncate text-[11px] text-[#77858d] dark:text-[#a7b6bd]">{isEnglish ? (englishDataLabels[category?.name ?? ""] ?? "Transaction") : (category?.name ?? "Transaksi")} · {formatDate(transaction.transactionDate, language)}</span>
                  </span>
                  <span className={cn("money-value shrink-0 text-right text-[12px] font-semibold", isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>{isIncome ? "+" : "−"}{formatCurrency(transaction.amount)}</span>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function BalanceStat({ icon: Icon, label, value, tone, delay }: { icon: typeof ArrowDownLeft; label: string; value: string; tone: "positive" | "negative"; delay: string }) {
  return (
    <div className={cn("motion-pop min-w-0 rounded-[16px] border p-3.5 backdrop-blur-xl dark:bg-white/5", tone === "positive" ? "border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-900/50" : "border-rose-200/80 bg-rose-50/70 dark:border-rose-900/50", delay)}>
      <div className="flex items-center gap-2">
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", tone === "positive" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400")}><Icon className="h-4 w-4" /></span>
        <span className="text-[11px] font-medium text-[#667489] dark:text-[#c1d0d5]">{label}</span>
      </div>
      <p className={cn("money-value mt-3 truncate text-[14px] font-semibold tracking-[-0.01em] sm:text-[15px]", tone === "positive" ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400")}>{value}</p>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick, primary = false, delay }: { icon: typeof Plus; label: string; onClick?: () => void; primary?: boolean; delay: string }) {
  return (
    <button onClick={onClick} className={cn("motion-pop group flex min-w-0 flex-col items-center gap-2 rounded-[16px] px-1 py-3 text-center transition-colors hover:bg-slate-100/70 dark:hover:bg-white/5 lg:flex-row lg:px-3 lg:text-left", delay)}>
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform group-active:scale-95", primary ? "liquid-button quick-add-dark" : "text-slate-800 dark:text-slate-100")}>
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="truncate text-[11px] font-medium text-[#526176] dark:text-[#c0ccd1] sm:text-[12px]">{label}</span>
    </button>
  );
}
