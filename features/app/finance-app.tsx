"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  ArrowLeft,
  Bell,
  ClipboardList,
  BriefcaseBusiness,
  Bus,
  Camera,
  ChevronDown,
  CircleUserRound,
  Delete,
  Download,
  FileSpreadsheet,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  LayoutGrid,
  Landmark,
  Menu,
  Moon,
  MoreHorizontal,
  PieChart as PieChartIcon,
  PiggyBank,
  Plus,
  ReceiptText,
  Search,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  Store,
  Sun,
  Target,
  Upload,
  Utensils,
  Wallet,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Tabs } from "@/components/ui/tabs";
import { getBudgetUsage, getMonthlyExpense, getMonthlyIncome, getSavingsTotal, getTotalBalance } from "@/lib/calculations";
import { formatCurrency, formatDate, percent } from "@/lib/format";
import { reportPoints } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/lib/use-click-outside";
import { useFinanceStore } from "./use-finance-store";
import { DashboardV2 } from "./dashboard-v2";
import { WalletScreen } from "./wallet-screen";
import type { TransactionType } from "@/types/finance";

type View = "dashboard" | "transactions" | "budget" | "wallets" | "savings" | "debt" | "reports" | "export" | "receipt" | "settings";

const navItems: { value: View; label: string; icon: typeof Home }[] = [
  { value: "dashboard", label: "Dashboard", icon: Home },
  { value: "transactions", label: "Transaksi", icon: ReceiptText },
  { value: "wallets", label: "Dompet", icon: Wallet },
  { value: "savings", label: "Tabungan", icon: Target },
  { value: "settings", label: "Lainnya", icon: MoreHorizontal },
];

const iconMap: Record<string, any> = {
  WalletCards,
  BriefcaseBusiness,
  Utensils,
  ShoppingBag,
  Bus,
  HeartPulse,
  Gamepad2,
  Store,
  PiggyBank,
  Gift,
  LayoutGrid,
  GraduationCap,
  ReceiptText,
};

export function FinanceApp() {
  const [view, setView] = useState<View>("dashboard");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <main className="app-gradient-bg flex h-[100dvh] w-full overflow-hidden text-slate-950 dark:text-slate-50">
      <div className="grid h-full min-w-0 w-full flex-1 overflow-hidden bg-transparent md:grid-cols-[248px_minmax(0,1fr)]">
        <DesktopSidebar active={view} onChange={setView} />
        <section className="relative h-full min-h-0 min-w-0 overflow-hidden bg-transparent dark:bg-transparent">
          {view === "dashboard" && <DashboardV2 onAdd={() => setIsAddModalOpen(true)} onTransactions={() => setView("transactions")} onNavigate={setView} />}
          {view === "transactions" && <TransactionsScreen />}
          {view === "wallets" && <WalletScreen />}
          {view === "budget" && <BudgetScreen />}
          {view === "savings" && <SavingsScreen />}
          {view === "debt" && <DebtScreen />}
          {view === "reports" && <ReportsScreen />}
          {view === "export" && <ExportScreen />}
          {view === "receipt" && <ReceiptScreen />}
          {view === "settings" && <SettingsScreen onNavigate={setView} />}
          <MobileNav active={view} onChange={setView} onAdd={() => setIsAddModalOpen(true)} />
          <AddDataModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </section>
      </div>
    </main>
  );
}


function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("catat-keuangan-theme");
    const nextIsDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("catat-keuangan-theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <Button variant="ghost" size="icon" className="text-slate-700 hover:bg-slate-100 hover:text-blue-600 dark:text-white dark:hover:bg-white/10 dark:hover:text-blue-300" onClick={toggleTheme} aria-label={isDark ? "Aktifkan light mode" : "Aktifkan dark mode"}>
      {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </Button>
  );
}

function ScreenShell({ children, title, action, compactTitle = false, avatarLabel }: { children: ReactNode; title: string; action?: ReactNode; hideMenu?: boolean; compactTitle?: boolean; avatarLabel?: string }) {
  return (
    <div className="animate-page mx-auto h-full w-full max-w-[1180px] overflow-y-auto px-4 pb-28 pt-5 sm:px-6 md:px-8 md:py-7">
      <header className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
        <div className="flex items-center gap-3">
          <h1 className={cn(compactTitle ? "text-lg font-medium tracking-[-0.025em] md:text-xl" : "text-xl font-semibold tracking-[-0.035em] md:text-2xl", "text-slate-900 dark:text-slate-50")}>{title}</h1>
        </div>
        <div className="flex items-center gap-2 text-slate-700 [&_button]:text-slate-700 [&_button:hover]:bg-slate-100 [&_button:hover]:text-blue-600 dark:text-white dark:[&_button]:text-white dark:[&_button:hover]:bg-white/10 dark:[&_button:hover]:text-blue-300">
          {avatarLabel ? <><ThemeToggle /><img src="/images/profile-andi.png" alt={`Foto profil ${avatarLabel}`} className="h-10 w-10 rounded-full object-cover" /></> : <><ThemeToggle />{action}</>}
        </div>
      </header>
      {children}
    </div>
  );
}

function DashboardScreen({ onNavigate }: { onNavigate: (view: View) => void }) {
  const { user, wallets, transactions, savingsGoals, budgets, categories } = useFinanceStore();
  const totalBalance = getTotalBalance(wallets);
  const income = getMonthlyIncome(transactions);
  const expense = getMonthlyExpense(transactions);
  const savings = getSavingsTotal(savingsGoals);
  const budgetUsage = getBudgetUsage(budgets);
  const assets = wallets.slice(0, 4);

  return (
    <ScreenShell
      title="Dashboard"
      action={
        <Button variant="ghost" size="icon" aria-label="Notifikasi">
          <Bell className="h-[18px] w-[18px]" />
        </Button>
      }
    >
      <section className="overflow-hidden rounded-xl border border-slate-900 bg-[#05070b] text-white">
        <div className="relative px-4 pb-5 pt-4 sm:px-6 sm:pt-5">
          <div className="flex items-center justify-between">
            <button className="inline-flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-2.5 text-[11px] font-semibold text-slate-100 transition-colors hover:bg-white/12">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
              Semua Wallet
            </button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="bg-white/8 text-white hover:bg-white/12 hover:text-white" aria-label="Cari">
                <Search className="h-4 w-4" />
              </Button>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-cyan-600 text-xs font-semibold">A</div>
            </div>
          </div>

          <div className="relative z-10 mt-8 text-center">
            <div className="inline-flex items-center gap-1 rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +12% bulan ini
            </div>
            <h2 className="mt-2 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{formatCurrency(totalBalance)}</h2>
            <p className="mt-2 text-xs font-medium text-slate-400">Halo, {user.name}. Kelola saldo dan aktivitas keuanganmu.</p>
          </div>

          <div className="relative mx-auto mt-6 h-28 max-w-md">
            <div className="absolute left-1/2 top-2 h-24 w-72 -translate-x-1/2 -rotate-6 rounded-xl border border-white/10 bg-[radial-gradient(circle_at_20%_10%,#60a5fa_0%,#312e81_42%,#111827_100%)] opacity-90" />
            <div className="absolute left-[56%] top-7 h-20 w-64 -translate-x-1/2 rotate-6 rounded-xl border border-white/10 bg-[#17264a] opacity-70" />
            <div className="absolute left-1/2 top-0 h-24 w-72 -translate-x-1/2 rounded-xl border border-white/15 bg-[#233e77] p-3">
              <div className="text-left text-[11px] font-semibold text-slate-200">Wallet Utama</div>
              <div className="mt-5 flex items-end justify-between text-left">
                <span className="text-base font-semibold tracking-[-0.02em]">{formatCurrency(wallets[0]?.currentBalance ?? 0)}</span>
                <span className="text-[10px] font-semibold text-cyan-300">+3.9%</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 -mb-12 mt-1 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <DashboardStatCard icon={WalletCards} label="Wallet Balance" value={formatCurrency(totalBalance)} />
            <DashboardStatCard icon={ArrowDownLeft} label="Pemasukan" value={formatCurrency(income)} />
            <DashboardStatCard icon={Target} label="Tabungan" value={formatCurrency(savings)} />
          </div>
        </div>

        <div className="mt-12 rounded-t-xl border-t border-white/10 bg-[#15161b] px-4 pb-5 pt-4 sm:px-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">Wallet Aktif</h3>
            <button onClick={() => onNavigate("transactions")} className="text-xs font-semibold text-cyan-300">Lihat transaksi</button>
          </div>
          <div className="grid gap-3">
            {assets.map((wallet, index) => (
              <DashboardAssetRow key={wallet.id} wallet={wallet} index={index} />
            ))}
          </div>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickAction icon={Plus} label="Tambah" />
        <QuickAction icon={ArrowLeftRight} label="Transfer" />
        <QuickAction icon={Upload} label="Scan" />
        <QuickAction icon={Download} label="Export" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Metric label="Pemasukan" value={formatCurrency(income)} tone="text-cyan-600" />
        <Metric label="Pengeluaran" value={formatCurrency(expense)} tone="text-rose-600" />
        <Metric label="Tabungan" value={formatCurrency(savings)} tone="text-cyan-700" />
      </div>

      <div className="mt-5 grid gap-3 xl:grid-cols-[1.45fr_0.9fr]">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-[-0.01em]">Ringkasan Bulan Ini</h2>
              <p className="text-[11px] text-slate-500">Pemasukan vs pengeluaran</p>
            </div>
            <span className="rounded-md bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-200">Jul 2026</span>
          </div>
          <MonthlyBars />
        </Card>

        <div className="grid gap-3">
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-[-0.01em]">Budget Bulanan</h2>
              <button onClick={() => onNavigate("budget")} className="text-xs font-semibold text-cyan-700">Kelola</button>
            </div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold">{formatCurrency(budgetUsage.spent)}</span>
              <span className="text-slate-500">{formatCurrency(budgetUsage.amount)}</span>
            </div>
            <Progress value={percent(budgetUsage.spent, budgetUsage.amount)} tone="green" />
          </Card>

          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-[-0.01em]">Transaksi Terbaru</h2>
              <button onClick={() => onNavigate("transactions")} className="text-xs font-semibold text-cyan-700">Lihat Semua</button>
            </div>
            <TransactionList transactions={transactions.slice(0, 4)} categories={categories} />
          </Card>
        </div>
      </div>
    </ScreenShell>
  );
}

function DashboardStatCard({ icon: Icon, label, value }: { icon: typeof WalletCards; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/70 p-3 backdrop-blur transition-colors duration-200 hover:bg-black/80">
      <Icon className="h-4 w-4 text-slate-300" />
      <p className="mt-4 text-[11px] font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-base font-semibold tracking-[-0.02em] text-white">{value}</p>
    </div>
  );
}

function DashboardAssetRow({ wallet, index }: { wallet: ReturnType<typeof useFinanceStore.getState>["wallets"][number]; index: number }) {
  const colors = ["bg-cyan-400", "bg-blue-500", "bg-sky-400", "bg-slate-400"];
  const code = wallet.name.split(" ")[0]?.slice(0, 4).toUpperCase() || "WLT";

  return (
    <div className="flex items-center gap-2.5 rounded-lg px-1 py-1.5 text-white transition-colors hover:bg-white/5">
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-[11px] font-semibold text-slate-950", colors[index % colors.length])}>{code.slice(0, 2)}</div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold">{wallet.name}</div>
        <div className="text-[11px] uppercase text-slate-500">{wallet.type}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold">{formatCurrency(wallet.currentBalance)}</div>
        <div className="text-[11px] text-slate-500">IDR</div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label }: { icon: typeof Plus; label: string }) {
  return (
    <button className="flex items-center gap-2.5 rounded-lg border border-border bg-white/55 p-2.5 text-left backdrop-blur-xl transition-colors duration-200 hover:bg-white/75 dark:bg-slate-950/45">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50/70 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-200">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">{label}</span>
    </button>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="finance-surface rounded-lg p-3 transition-colors duration-200 hover:bg-white/70">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className={cn("mt-1.5 truncate text-lg font-semibold tracking-[-0.02em]", tone)}>{value}</div>
    </div>
  );
}

function TransactionsScreen() {
  const { user, transactions, categories } = useFinanceStore();
  const [filter, setFilter] = useState<TransactionType | "all">("all");
  const filtered = filter === "all" ? transactions : transactions.filter((item) => item.type === filter);

  const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <ScreenShell title="Transaksi" hideMenu compactTitle avatarLabel={initials}>
      <TransactionPillTabs
        value={filter}
        onChange={setFilter}
        items={[
          { value: "all", label: "Semua" },
          { value: "income", label: "Pemasukan" },
          { value: "expense", label: "Pengeluaran" },
          { value: "transfer", label: "Transfer" },
        ]}
      />
      <div className="mt-4">
        <TransactionList transactions={filtered} categories={categories} />
      </div>
    </ScreenShell>
  );
}

function ModalTransactionTypeTabs({ value, onChange, items }: { value: TransactionType; onChange: (value: TransactionType) => void; items: { value: TransactionType; label: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-full bg-transparent">
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={cn(
              "h-11 rounded-full text-xs font-medium outline outline-1 outline-transparent transition-colors duration-200",
              isActive
                ? "bg-white text-cyan-700 dark:bg-cyan-700 dark:text-white dark:outline-cyan-400/30"
                : "text-slate-500 hover:bg-white/50 hover:text-slate-900 dark:text-cyan-200/85 dark:hover:bg-cyan-400/10 dark:hover:text-white",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
function TransactionTypeTabs({ value, onChange, items }: { value: TransactionType; onChange: (value: TransactionType) => void; items: { value: TransactionType; label: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-full border border-slate-900/5 bg-slate-950/90 p-1.5 backdrop-blur-2xl dark:border-cyan-400/20 dark:bg-cyan-950/20">
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={cn(
              "h-9 rounded-full text-xs font-medium outline outline-1 outline-transparent transition-colors duration-200",
              isActive
                ? "bg-[#303030] text-white outline-white/5 dark:bg-cyan-600 dark:text-white dark:outline-cyan-300/30"
                : "text-cyan-100/90 hover:bg-white/8 hover:text-white dark:text-cyan-200/85 dark:hover:bg-cyan-400/10 dark:hover:text-white",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
function TransactionPillTabs({ value, onChange, items }: { value: TransactionType | "all"; onChange: (value: TransactionType | "all") => void; items: { value: TransactionType | "all"; label: string }[] }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
      <div className="flex w-max items-center gap-3">
        {items.map((item) => {
          const isActive = item.value === value;
          return (
            <button
              key={item.value}
              onClick={() => onChange(item.value)}
              className={cn(
                "h-10 rounded-full px-5 text-[13px] font-medium outline outline-1 outline-transparent transition-colors duration-200",
                isActive
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "bg-white/50 text-slate-700 backdrop-blur-xl hover:bg-white/75 dark:bg-white/10 dark:text-slate-200",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
function TransactionList({ transactions, categories }: { transactions: ReturnType<typeof useFinanceStore.getState>["transactions"]; categories: ReturnType<typeof useFinanceStore.getState>["categories"] }) {
  return (
    <div className="grid gap-2.5">
      {transactions.map((transaction) => {
        const category = categories.find((item) => item.id === transaction.categoryId);
        const Icon = category ? iconMap[category.icon as keyof typeof iconMap] : ArrowLeftRight;
        const isIncome = transaction.type === "income";
        return (
          <div key={transaction.id} className="glass-surface flex items-center gap-3 rounded-[20px] p-3 transition-colors duration-200 hover:bg-white/70 dark:hover:bg-white/8">
            <div className="soft-shadow flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white text-blue-600 dark:bg-blue-950/40" style={{ color: category?.color }}>
              <Icon className="h-[18px] w-[18px]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium tracking-[-0.01em] text-slate-950 dark:text-slate-50">{transaction.title}</div>
              <div className="mt-0.5 truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">{transaction.description}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className={cn("money-value text-[13px] font-semibold tracking-[-0.01em]", isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
                {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
              </div>
              <div className="mt-0.5 text-[11px] font-medium text-slate-400">{formatDate(transaction.transactionDate)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BudgetScreen() {
  const { budgets, categories, addBudget } = useFinanceStore();
  const expenseCategories = categories.filter((category) => category.type === "expense");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(expenseCategories[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const usage = getBudgetUsage(budgets);

  function saveBudget() {
    const value = Number(amount);
    if (!categoryId || !value) return;
    addBudget(categoryId, value);
    setAmount("");
    setIsFormOpen(false);
  }

  return (
    <ScreenShell title="Budget Bulanan" action={<Button variant="ghost" size="icon" aria-label="Tambah" onClick={() => setIsFormOpen((value) => !value)}><Plus className={cn("h-[18px] w-[18px] transition-transform", isFormOpen && "rotate-45")} /></Button>}>
      {isFormOpen && <Card className="mb-4 grid gap-3">
        <Field label="Kategori"><Select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>{expenseCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select></Field>
        <Field label="Jumlah budget"><Input inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ""))} placeholder="Contoh: 1500000" /></Field>
        <div className="flex gap-2"><Button variant="secondary" className="flex-1" onClick={() => setIsFormOpen(false)}>Batal</Button><Button className="flex-1" onClick={saveBudget} disabled={!categoryId || !Number(amount)}>Simpan</Button></div>
      </Card>}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500">Total Budget</p>
            <p className="text-base font-semibold tracking-[-0.01em]">{formatCurrency(usage.amount)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-500">Terpakai</p>
            <p className="text-base font-semibold tracking-[-0.01em]">{formatCurrency(usage.spent)}</p>
          </div>
        </div>
        <Progress className="mt-4" value={percent(usage.spent, usage.amount)} />
        <p className="mt-2 text-right text-[11px] text-slate-500">{percent(usage.spent, usage.amount)}%</p>
      </Card>
      <div className="mt-4 grid gap-3">
        {budgets.map((budget) => {
          const category = categories.find((item) => item.id === budget.categoryId);
          const Icon = category ? iconMap[category.icon as keyof typeof iconMap] : PieChartIcon;
          return (
            <Card key={budget.id}>
              <div className="mb-3 flex items-center gap-3">
                <div className="soft-shadow flex h-10 w-10 items-center justify-center rounded-[14px] bg-white dark:bg-blue-950/40" style={{ color: category?.color }}>
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold">{category?.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {formatCurrency(budget.spentAmount)} / {formatCurrency(budget.amount)}
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">{percent(budget.spentAmount, budget.amount)}%</span>
              </div>
              <Progress value={percent(budget.spentAmount, budget.amount)} tone={percent(budget.spentAmount, budget.amount) > 85 ? "red" : "green"} />
            </Card>
          );
        })}
      </div>
    </ScreenShell>
  );
}

function SavingsScreen() {
  const { savingsGoals, wallets, addSavingsGoal } = useFinanceStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [walletId, setWalletId] = useState(wallets[0]?.id ?? "");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().slice(0, 10));
  const total = getSavingsTotal(savingsGoals);

  function saveGoal() {
    const value = Number(targetAmount);
    if (!name.trim() || !walletId || !value || !targetDate) return;
    addSavingsGoal({ name: name.trim(), walletId, targetAmount: value, targetDate: new Date(targetDate).toISOString() });
    setName("");
    setTargetAmount("");
    setIsFormOpen(false);
  }

  return (
    <ScreenShell title="Tabungan" action={<Button variant="ghost" size="icon" aria-label="Tambah" onClick={() => setIsFormOpen((value) => !value)}><Plus className={cn("h-[18px] w-[18px] transition-transform", isFormOpen && "rotate-45")} /></Button>}>
      {isFormOpen && <Card className="mb-4 grid gap-3">
        <Field label="Nama target"><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Dana darurat" /></Field>
        <Field label="Dompet"><Select value={walletId} onChange={(event) => setWalletId(event.target.value)}>{wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}</Select></Field>
        <div className="grid gap-3 sm:grid-cols-2"><Field label="Target dana"><Input inputMode="numeric" value={targetAmount} onChange={(event) => setTargetAmount(event.target.value.replace(/\D/g, ""))} placeholder="5000000" /></Field><Field label="Target tanggal"><Input type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} /></Field></div>
        <div className="flex gap-2"><Button variant="secondary" className="flex-1" onClick={() => setIsFormOpen(false)}>Batal</Button><Button className="flex-1" onClick={saveGoal} disabled={!name.trim() || !Number(targetAmount)}>Simpan</Button></div>
      </Card>}
      <div className="glass-surface relative overflow-hidden rounded-[22px] p-5 text-[#182131] dark:text-white sm:p-6">
        <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full border-[28px] border-white/20" />
        <p className="relative text-[11px] font-medium text-[#647680] dark:text-[#cae6eb]">Total tabungan</p>
        <p className="relative mt-2 text-[27px] font-semibold tracking-[-0.04em] sm:text-[32px]">{formatCurrency(total)}</p>
      </div>
      <div className="mt-4 grid gap-3">
        {savingsGoals.map((goal) => (
          <Card key={goal.id}>
            <div className="mb-3 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-200">
                <Target className="h-[18px] w-[18px]" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold">{goal.name}</div>
                <div className="text-[11px] text-slate-500">Target {formatCurrency(goal.targetAmount)}</div>
              </div>
              <div className="text-right text-[11px] text-slate-500">{formatDate(goal.targetDate)}</div>
            </div>
            <Progress value={percent(goal.currentAmount, goal.targetAmount)} />
            <div className="mt-2 text-[13px] font-semibold">{formatCurrency(goal.currentAmount)}</div>
          </Card>
        ))}
      </div>
    </ScreenShell>
  );
}

function DebtScreen() {
  const { debts, addDebt } = useFinanceStore();
  const [tab, setTab] = useState<"debt" | "receivable" | "all">("debt");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [personName, setPersonName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const filtered = tab === "all" ? debts : debts.filter((debt) => debt.type === tab);

  function saveDebt() {
    const value = Number(amount);
    if (!personName.trim() || !value || !dueDate) return;
    addDebt({ type: tab === "receivable" ? "receivable" : "debt", personName: personName.trim(), amount: value, dueDate: new Date(dueDate).toISOString(), note: personName.trim() });
    setPersonName("");
    setAmount("");
    setIsFormOpen(false);
  }

  return (
    <ScreenShell title="Hutang / Piutang">
      <Tabs value={tab} onChange={setTab} items={[{ value: "debt", label: "Hutang" }, { value: "receivable", label: "Piutang" }, { value: "all", label: "Semua" }]} />
      {isFormOpen && <Card className="mt-4 grid gap-3">
        <Field label="Nama"><Input value={personName} onChange={(event) => setPersonName(event.target.value)} placeholder="Nama orang atau pihak" /></Field>
        <div className="grid gap-3 sm:grid-cols-2"><Field label="Jumlah"><Input inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value.replace(/\D/g, ""))} placeholder="500000" /></Field><Field label="Jatuh tempo"><Input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></Field></div>
        <div className="flex gap-2"><Button variant="secondary" className="flex-1" onClick={() => setIsFormOpen(false)}>Batal</Button><Button className="flex-1" onClick={saveDebt} disabled={!personName.trim() || !Number(amount)}>Simpan</Button></div>
      </Card>}
      <div className="mt-4 grid gap-3">
        {filtered.map((debt) => (
          <Card key={debt.id}>
            <div className="flex items-center gap-3">
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", debt.type === "debt" ? "bg-slate-100 text-slate-600" : "bg-blue-50 text-blue-600")}>{debt.type === "debt" ? <ArrowUpRight className="h-[18px] w-[18px]" /> : <ArrowDownLeft className="h-[18px] w-[18px]" />}</div>
              <div className="flex-1"><div className="text-[13px] font-semibold">{debt.note}</div><div className="text-[11px] text-slate-500">Jatuh tempo: {formatDate(debt.dueDate)}</div></div>
              <div className="text-right"><div className={cn("money-value text-[13px] font-semibold", debt.type === "debt" ? "text-slate-700" : "text-blue-600")}>{formatCurrency(debt.remainingAmount)}</div><div className={cn("text-[11px] font-semibold", debt.status === "overdue" ? "text-rose-500" : "text-amber-600")}>{debt.status === "overdue" ? "Belum Lunas" : "Aktif"}</div></div>
            </div>
          </Card>
        ))}
      </div>
      <Button className="mt-5 w-full" onClick={() => setIsFormOpen((value) => !value)}><Plus className="h-4 w-4" />{isFormOpen ? "Tutup Form" : "Tambah Hutang / Piutang"}</Button>
    </ScreenShell>
  );
}

function ReportsScreen() {
  const { transactions, categories } = useFinanceStore();
  const [reportTab, setReportTab] = useState<"summary" | "income" | "expense">("summary");
  const expense = getMonthlyExpense(transactions);
  const income = getMonthlyIncome(transactions);
  const net = income - expense;
  const expenseRatio = percent(expense, income);
  const reportPalette = ["#2563eb", "#3b82f6", "#60a5fa", "#64748b", "#1d4ed8", "#93c5fd"];
  const pieData = categories
    .filter((category) => category.type === "expense")
    .map((category, index) => ({
      name: category.name,
      value: transactions.filter((transaction) => transaction.categoryId === category.id).reduce((total, transaction) => total + transaction.amount, 0),
      color: reportPalette[index % reportPalette.length],
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <ScreenShell title="Laporan">
      <Tabs
        value={reportTab}
        onChange={setReportTab}
        items={[
          { value: "summary", label: "Ringkasan" },
          { value: "income", label: "Pemasukan" },
          { value: "expense", label: "Pengeluaran" },
        ]}
      />

      <section key={reportTab} className="animate-page mt-4 grid gap-4">
        <div className="glass-surface relative overflow-hidden rounded-[22px] p-5 sm:p-6">
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8793a5] dark:text-[#c6d2e2]">Arus kas bersih</p>
                <p className="money-value mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[#182131] sm:text-[36px] dark:text-white">{formatCurrency(net)}</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-600 dark:border-white/10 dark:bg-white/10 dark:text-white"><PieChartIcon className="h-5 w-5" /></span>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-2.5 sm:max-w-md">
              <ReportMetric icon={ArrowDownLeft} label="Pemasukan" value={formatCurrency(income)} tone="cyan" />
              <ReportMetric icon={ArrowUpRight} label="Pengeluaran" value={formatCurrency(expense)} tone="slate" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
          <Card className="overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="type-card-title">Tren bulanan</h2>
                <p className="type-caption mt-1 text-slate-500">Perbandingan pemasukan dan pengeluaran</p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-medium text-blue-600 dark:bg-blue-950/40 dark:text-blue-200">6 bulan</span>
            </div>
            <ReportTrendChart />
          </Card>

          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="type-card-title">Statistik pengeluaran</h2>
                <p className="type-caption mt-1 text-slate-500">Progres setiap kategori bulan ini</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-medium text-slate-600 dark:bg-white/5 dark:text-slate-300">{expenseRatio}% terpakai</span>
            </div>
            <div className="mt-5 grid gap-5">
              {pieData.slice(0, 4).map((item) => {
                const share = Math.round((item.value / (expense || 1)) * 100);
                return (
                  <div key={item.name} className="min-w-0">
                    <div className="mb-2 flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-slate-800 dark:text-white">{item.name}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">Bagian dari total pengeluaran</p>
                      </div>
                      <p className="money-value shrink-0 text-[16px] font-semibold tracking-[-0.02em]">{formatCurrency(item.value)}</p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${Math.min(share, 100)}%`, backgroundColor: item.color }} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>0%</span>
                      <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />{share}%</span>
                    </div>
                  </div>
                );
              })}
              {pieData.length === 0 && <p className="py-8 text-center text-[12px] text-slate-500">Belum ada pengeluaran pada periode ini.</p>}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <ReportSummaryCard label="Rasio pengeluaran" value={`${expenseRatio}%`} note="dari total pemasukan" delay="stagger-1" />
          <ReportSummaryCard label="Sisa bulan ini" value={formatCurrency(net)} note="setelah pengeluaran" delay="stagger-2" />
          <ReportSummaryCard label="Transaksi" value={`${transactions.length}`} note="aktivitas tercatat" delay="stagger-3" className="col-span-2 sm:col-span-1" />
        </div>
      </section>
    </ScreenShell>
  );
}

function ExportScreen() {
  const { transactions, budgets, debts, categories } = useFinanceStore();
  const [format, setFormat] = useState<"excel" | "pdf">("excel");
  const [selectedData, setSelectedData] = useState<Record<string, boolean>>({ Transaksi: true, Budget: true, "Hutang / Piutang": true, Ringkasan: false });

  function exportReport() {
    if (format === "pdf") {
      window.print();
      return;
    }
    const sections: string[] = [];
    const csvRow = (values: (string | number)[]) => values.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",");
    if (selectedData.Transaksi) {
      sections.push("TRANSAKSI", csvRow(["Tanggal", "Judul", "Jenis", "Jumlah", "Deskripsi"]), ...transactions.map((item) => csvRow([item.transactionDate, item.title, item.type, item.amount, item.description ?? ""])));
    }
    if (selectedData.Budget) {
      sections.push("", "BUDGET", csvRow(["Kategori", "Jumlah", "Terpakai"]), ...budgets.map((item) => csvRow([categories.find((category) => category.id === item.categoryId)?.name ?? "-", item.amount, item.spentAmount])));
    }
    if (selectedData["Hutang / Piutang"]) {
      sections.push("", "HUTANG / PIUTANG", csvRow(["Nama", "Jenis", "Jumlah", "Sisa", "Jatuh tempo"]), ...debts.map((item) => csvRow([item.personName, item.type, item.amount, item.remainingAmount, item.dueDate])));
    }
    if (selectedData.Ringkasan) {
      sections.push("", "RINGKASAN", csvRow(["Jumlah transaksi", "Jumlah budget", "Jumlah hutang/piutang"]), csvRow([transactions.length, budgets.length, debts.length]));
    }
    const blob = new Blob([sections.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "laporan-keuangan.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ScreenShell title="Export Laporan">
      <p className="mb-3 text-[13px] text-slate-500">Pilih periode dan format file untuk mengunduh laporan keuangan.</p>
      <Card className="grid gap-3">
        <Field label="Periode">
          <Input value="01 Jul 2026 - 31 Jul 2026" readOnly />
        </Field>
        <Field label="Format File">
          <Select value={format} onChange={(event) => setFormat(event.target.value as "excel" | "pdf")}>
            <option value="excel">Excel (.xlsx)</option>
            <option value="pdf">PDF (.pdf)</option>
          </Select>
        </Field>
        <Field label="Jenis Data">
          <div className="grid gap-2 text-[13px] text-slate-700">
            {["Transaksi", "Budget", "Hutang / Piutang", "Ringkasan"].map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input type="checkbox" checked={selectedData[item]} onChange={(event) => setSelectedData((current) => ({ ...current, [item]: event.target.checked }))} className="h-4 w-4 accent-blue-600" />
                {item}
              </label>
            ))}
          </div>
        </Field>
        <Button onClick={exportReport} disabled={!Object.values(selectedData).some(Boolean)}>
          <Download className="h-4 w-4" />
          Export Sekarang
        </Button>
      </Card>
    </ScreenShell>
  );
}

function ReceiptScreen() {
  const { receiptScans, confirmReceipt } = useFinanceStore();
  const [uploadedFile, setUploadedFile] = useState("");
  const latest = receiptScans[0];

  return (
    <ScreenShell title="Scan Struk">
      <div className="glass-surface rounded-[24px] border-dashed p-6 text-center sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-200">
          <Camera className="h-5 w-5" />
        </div>
        <p className="mt-3 text-[13px] font-semibold">Ambil foto struk</p>
        <p className="text-[11px] text-slate-500">atau pilih dari galeri</p>
        <label className="mt-4 inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-700 transition-colors hover:border-blue-200 hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
          <Upload className="h-4 w-4" />
          {uploadedFile || "Upload Foto"}
          <input type="file" accept="image/*" className="sr-only" onChange={(event) => setUploadedFile(event.target.files?.[0]?.name ?? "")} />
        </label>
      </div>
      <Card className="mt-5">
        <h2 className="mb-3 text-sm font-semibold tracking-[-0.01em]">Hasil Deteksi</h2>
        <SummaryRow label="Merchant" value={latest?.merchantName ?? "Alfamart"} />
        <SummaryRow label="Tanggal" value={latest ? formatDate(latest.detectedDate) : "10 Jul 2026"} />
        <SummaryRow label="Total" value={formatCurrency(latest?.detectedAmount ?? 56500)} />
        <Button
          className="mt-4 w-full"
          onClick={() =>
            confirmReceipt({
              id: "draft",
              userId: "user-andi",
              merchantName: latest?.merchantName ?? "Alfamart",
              detectedAmount: latest?.detectedAmount ?? 56500,
              detectedDate: latest?.detectedDate ?? new Date().toISOString(),
              status: "confirmed",
            })
          }
        >
          Simpan sebagai Transaksi
        </Button>
      </Card>
    </ScreenShell>
  );
}

function SettingsScreen({ onNavigate }: { onNavigate: (view: View) => void }) {
  const { resetLocalDatabase } = useFinanceStore();
  const routes: { view: View; label: string; icon: typeof Wallet }[] = [
    { view: "budget", label: "Budget Bulanan", icon: PieChartIcon },
    { view: "savings", label: "Tabungan", icon: Target },
    { view: "debt", label: "Hutang / Piutang", icon: Landmark },
    { view: "reports", label: "Laporan & Grafik", icon: PieChartIcon },
    { view: "export", label: "Export Data", icon: FileSpreadsheet },
    { view: "receipt", label: "Scan Struk OCR", icon: Camera },
  ];

  return (
    <ScreenShell title="Lainnya">
      <div className="grid gap-3">
        {routes.map((route) => (
          <button key={route.view} onClick={() => onNavigate(route.view)} className="glass-surface flex items-center gap-3 rounded-[20px] p-3 text-left transition-colors duration-200 hover:bg-white/72 dark:hover:bg-white/8">
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-200">
              <route.icon className="h-[18px] w-[18px]" />
            </div>
            <span className="text-[13px] font-medium">{route.label}</span>
          </button>
        ))}
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <WalletCards className="h-[18px] w-[18px]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold">Database Lokal</div>
              <div className="text-[11px] text-slate-500">Aktif di browser untuk mode localhost</div>
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600">Online</span>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-200">
              <Settings className="h-[18px] w-[18px]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold">Pengaturan Aplikasi</div>
              <div className="text-[11px] text-slate-500">Profil, keamanan, dan preferensi</div>
            </div>
          </div>
          <Button className="mt-4 w-full" variant="secondary" onClick={resetLocalDatabase}>Reset Data Lokal</Button>
        </Card>
      </div>
    </ScreenShell>
  );
}

function MonthlyBars() {
  const width = 520;
  const height = 190;
  const padding = 28;
  const max = Math.max(...reportPoints.flatMap((point) => [point.income, point.expense]));
  const toPoint = (value: number, index: number) => {
    const x = padding + (index * (width - padding * 2)) / (reportPoints.length - 1);
    const y = height - padding - (value / max) * (height - padding * 2);
    return [x, y] as const;
  };
  const incomePoints = reportPoints.map((point, index) => toPoint(point.income, index));
  const expensePoints = reportPoints.map((point, index) => toPoint(point.expense, index));
  const polyline = (points: readonly (readonly [number, number])[]) => points.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <div className="mt-3 overflow-hidden rounded-lg bg-cyan-50/55 p-3 dark:bg-slate-950/35">
      <svg viewBox={[0, 0, width, height].join(" ")} className="h-44 w-full" role="img" aria-label="Grafik pemasukan dan pengeluaran bulanan">
        {[0, 1, 2, 3].map((line) => {
          const y = padding + (line * (height - padding * 2)) / 3;
          return <line key={line} x1={padding} x2={width - padding} y1={y} y2={y} stroke="currentColor" className="text-cyan-100 dark:text-slate-800" strokeWidth="1" />;
        })}
        <polyline points={polyline(expensePoints)} fill="none" stroke="#fb7185" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={polyline(incomePoints)} fill="none" stroke="#10aecb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {incomePoints.map(([x, y], index) => (
          <circle key={reportPoints[index].label} cx={x} cy={y} r="5" fill="#ffffff" stroke="#10aecb" strokeWidth="3" />
        ))}
        {reportPoints.map((point, index) => {
          const [x] = toPoint(point.income, index);
          return <text key={point.label} x={x} y={height - 4} textAnchor="middle" className="fill-slate-400 text-[10px] font-semibold">{point.label}</text>;
        })}
      </svg>
      <div className="mt-2 flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-cyan-600" /> Pemasukan</span>
        <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> Pengeluaran</span>
      </div>
    </div>
  );
}

function DonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  let offset = 25;

  return (
    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label="Diagram distribusi pengeluaran per kategori">
      <circle cx="60" cy="60" r="38" fill="none" stroke="#edf2f4" strokeWidth="16" />
      {data.map((item, index) => {
        const length = (item.value / total) * 100;
        const circle = (
          <circle
            key={item.name}
            cx="60"
            cy="60"
            r="38"
            fill="none"
            stroke={item.color}
            strokeDasharray={`${length} ${100 - length}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            strokeWidth="16"
            pathLength="100"
            className="chart-segment"
            style={{ animationDelay: `${index * 90}ms` }}
          />
        );
        offset += length;
        return circle;
      })}
      <circle cx="60" cy="60" r="25" fill="rgba(255,255,255,.96)" />
    </svg>
  );
}

function ReportTrendChart() {
  const width = 560;
  const height = 210;
  const paddingX = 24;
  const paddingTop = 26;
  const paddingBottom = 30;
  const max = Math.max(...reportPoints.flatMap((point) => [point.income, point.expense]), 1);
  const point = (value: number, index: number) => {
    const x = paddingX + (index * (width - paddingX * 2)) / Math.max(1, reportPoints.length - 1);
    const y = height - paddingBottom - (value / max) * (height - paddingTop - paddingBottom);
    return [x, y] as const;
  };
  const incomePoints = reportPoints.map((item, index) => point(item.income, index));
  const expensePoints = reportPoints.map((item, index) => point(item.expense, index));
  const list = (points: readonly (readonly [number, number])[]) => points.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `${paddingX},${height - paddingBottom} ${list(incomePoints)} ${width - paddingX},${height - paddingBottom}`;

  return (
    <div className="mt-4 overflow-hidden rounded-[16px] border border-slate-100 bg-slate-50/80 p-2 dark:border-white/5 dark:bg-white/[.03]">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[190px] w-full" role="img" aria-label="Grafik tren pemasukan dan pengeluaran enam bulan">
        <defs>
          <linearGradient id="incomeArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((line) => {
          const y = paddingTop + (line * (height - paddingTop - paddingBottom)) / 3;
          return <line key={line} x1={paddingX} x2={width - paddingX} y1={y} y2={y} stroke="#dfeaec" strokeDasharray="4 7" />;
        })}
        <polygon points={area} fill="url(#incomeArea)" className="chart-area" />
        <polyline points={list(expensePoints)} fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 7" />
        <polyline points={list(incomePoints)} fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="chart-line" />
        {incomePoints.map(([x, y], index) => <circle key={reportPoints[index].label} cx={x} cy={y} r="4.5" fill="#fff" stroke="#16a34a" strokeWidth="3" className="chart-point" style={{ animationDelay: `${350 + index * 70}ms` }} />)}
        {reportPoints.map((item, index) => <text key={item.label} x={incomePoints[index][0]} y={height - 8} textAnchor="middle" className="fill-slate-400 text-[10px] font-medium">{item.label}</text>)}
      </svg>
      <div className="flex items-center gap-4 px-2 pb-2 text-[10px] font-medium text-slate-500">
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-600" />Pemasukan</span>
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-rose-600" />Pengeluaran</span>
      </div>
    </div>
  );
}

function ReportMetric({ icon: Icon, label, value, tone }: { icon: typeof ArrowDownLeft; label: string; value: string; tone: "cyan" | "slate" }) {
  return (
    <div className="liquid-panel rounded-[16px] p-3.5 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-2">
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", tone === "cyan" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400")}><Icon className="h-4 w-4" /></span>
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-300">{label}</span>
      </div>
      <p className="money-value mt-3 truncate text-[13px] font-semibold tracking-[-0.01em] sm:text-[14px]">{value}</p>
    </div>
  );
}

function ReportSummaryCard({ label, value, note, delay, className }: { label: string; value: string; note: string; delay: string; className?: string }) {
  return (
    <div className={cn("motion-pop glass-surface rounded-[18px] p-4 dark:border-white/10 dark:bg-white/5", delay, className)}>
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className="money-value mt-2 truncate text-[20px] font-semibold tracking-[-0.025em]">{value}</p>
      <p className="mt-1 text-[10px] text-slate-400">{note}</p>
    </div>
  );
}

function SummaryRow({ label, value, tone = "text-slate-950" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200/70 py-3 last:border-b-0 dark:border-white/7">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={cn("text-sm font-semibold", tone)}>{value}</span>
    </div>
  );
}

function AddDataModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { wallets, categories, addTransaction } = useFinanceStore();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [walletId, setWalletId] = useState(wallets[0]?.id ?? "");
  const [categoryId, setCategoryId] = useState("");
  const [note, setNote] = useState("");
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().slice(0, 10));
  const [isWalletPickerOpen, setIsWalletPickerOpen] = useState(false);
  const walletPickerRef = useRef<HTMLDivElement>(null);
  const closeWalletPicker = useCallback(() => setIsWalletPickerOpen(false), []);
  useClickOutside(walletPickerRef, isWalletPickerOpen, closeWalletPicker);

  const filteredCategories = categories.filter((c) => c.type === type);

  useEffect(() => {
    // Select first category by default when type changes
    const first = categories.find((c) => c.type === type);
    if (first) setCategoryId(first.id);
  }, [type, categories]);

  // Handle closing modal
  useEffect(() => {
    if (!open) {
      setAmount("");
      setNote("");
      setIsWalletPickerOpen(false);
    }
  }, [open]);

  if (!open) return null;

  function submit() {
    const parsedAmount = Number(amount);
    if (!parsedAmount || !walletId || !categoryId) return;
    addTransaction({
      type,
      amount: parsedAmount,
      title: categories.find((c) => c.id === categoryId)?.name || "New Transaction",
      walletId,
      categoryId,
      description: note,
      transactionDate: new Date(transactionDate).toISOString(),
    });
    setAmount("");
    setNote("");
    onClose();
  }

  function handleNumpad(key: string) {
    if (key === "delete") {
      setAmount((prev) => prev.slice(0, -1));
    } else {
      if (amount === "" && key === "000") return;
      if (amount === "" && key === "0") return;
      if (amount.length > 12) return;
      setAmount((prev) => prev + key);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/58 p-0">
      <div className="animate-sheet flex h-auto max-h-[calc(100dvh-56px)] w-full max-w-xl flex-col overflow-hidden rounded-t-[30px] border border-b-0 border-black/10 bg-[#f7f7f7] text-[#201a2b] dark:border-white/10 dark:bg-[#111214] dark:text-[#f5f1fb] sm:max-h-[calc(100dvh-72px)]">
        <header className="flex min-h-[72px] items-center justify-between border-b border-black/8 bg-white px-4 dark:border-white/7 dark:bg-[#151619]">
          <button onClick={onClose} className="liquid-button flex h-10 w-10 items-center justify-center rounded-full" aria-label="Tutup transaksi"><ArrowLeft className="h-[18px] w-[18px]" /></button>
          <div className="text-center">
            <p className="text-[12px] font-semibold">Tambah transaksi</p>
            <input type="date" value={transactionDate} onChange={(event) => setTransactionDate(event.target.value)} className="mt-1 h-8 rounded-full border border-black/10 bg-slate-100 px-3 text-[10px] font-medium text-slate-700 outline-none transition-colors hover:bg-slate-200 focus:border-black dark:border-white/10 dark:bg-white/7 dark:text-slate-200" />
          </div>
          <span className="h-10 w-10" aria-hidden="true" />
        </header>

        <div className="px-4 pt-4 sm:px-6">
          <div className="liquid-panel flex rounded-[17px] p-1.5">
            <button onClick={() => setType("expense")} className={cn("h-10 flex-1 rounded-[12px] text-[12px] font-medium transition-colors", type === "expense" ? "bg-rose-600 text-white" : "text-[#665f73] dark:text-[#cbc4d5]")}>Pengeluaran</button>
            <button onClick={() => setType("income")} className={cn("h-10 flex-1 rounded-[12px] text-[12px] font-medium transition-colors", type === "income" ? "bg-emerald-600 text-white" : "text-[#75838c] dark:text-[#aebbc1]")}>Pemasukan</button>
          </div>
        </div>

        <div className="liquid-panel mx-4 mt-3 flex justify-center rounded-[22px] px-4 py-5 sm:mx-6">
          <div className="text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#756d82]">Jumlah transaksi</p>
            <h1 className="money-value mt-1 break-all text-center text-[30px] font-semibold tracking-[-0.035em] sm:text-[36px]">Rp {amount ? formatCurrency(Number(amount)).replace('Rp', '').trim() : "0"}</h1>
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto px-4 pb-2 pt-3 sm:px-6">
          <div ref={walletPickerRef} className="relative">
            <button onClick={() => setIsWalletPickerOpen((value) => !value)} aria-expanded={isWalletPickerOpen} className="liquid-panel flex h-12 w-full items-center justify-between rounded-[16px] px-4 text-[12px] font-medium">
              <span className="flex items-center gap-3"><Wallet className="h-[18px] w-[18px] text-black dark:text-white" />{wallets.find((w) => w.id === walletId)?.name || "Pilih dompet"}</span>
              <ChevronDown className={cn("h-4 w-4 text-[#75838c] transition-transform", isWalletPickerOpen && "rotate-180")} />
            </button>
            {isWalletPickerOpen && <div className="glass-strong animate-card absolute left-0 right-0 top-14 z-30 rounded-[15px] p-1.5">{wallets.map((wallet) => <button key={wallet.id} onClick={() => { setWalletId(wallet.id); setIsWalletPickerOpen(false); }} className={cn("flex h-10 w-full items-center rounded-[10px] px-3 text-left text-[11px]", walletId === wallet.id ? "bg-blue-600 text-white" : "hover:bg-blue-50 dark:hover:bg-white/5")}>{wallet.name}</button>)}</div>}
          </div>

          <div className="liquid-panel mt-3 grid grid-cols-4 gap-x-2 gap-y-4 rounded-[22px] p-4">
            {filteredCategories.map((cat) => {
              const Icon = iconMap[cat.icon as keyof typeof iconMap] || LayoutGrid;
              const isSelected = categoryId === cat.id;
              return (
                <button key={cat.id} onClick={() => setCategoryId(cat.id)} className="flex min-w-0 flex-col items-center gap-2">
                  <span className={cn("flex h-11 w-11 items-center justify-center rounded-[14px] border transition-colors", isSelected ? type === "income" ? "border-emerald-600 bg-emerald-600 text-white" : "border-rose-600 bg-rose-600 text-white" : "border-black/10 bg-white text-[#665f73] dark:border-white/10 dark:bg-white/5 dark:text-[#c7bfce]")}><Icon className="h-[18px] w-[18px]" /></span>
                  <span className={cn("w-full truncate text-[10px]", isSelected ? type === "income" ? "font-medium text-emerald-600 dark:text-emerald-400" : "font-medium text-rose-600 dark:text-rose-400" : "text-[#75838c] dark:text-[#a7b6bd]")}>{cat.name}</span>
                </button>
              );
            })}
          </div>

          <div className="liquid-panel mt-3 flex h-12 items-center justify-between rounded-[16px] px-4">
            <div className="flex w-full items-center gap-3"><Camera className="h-[18px] w-[18px] shrink-0 text-black dark:text-white" /><input value={note} onChange={(e) => setNote(e.target.value.slice(0, 80))} placeholder="Tambah catatan" className="w-full bg-transparent text-[12px] outline-none placeholder:text-[#96a1a7]" /></div>
            <span className="ml-2 shrink-0 text-[9px] text-[#8a968c]">{note.length}/80</span>
          </div>
        </div>

        <footer className="border-t border-black/8 bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-2 sm:px-6 dark:border-white/7 dark:bg-[#151619]">
          <div className="grid grid-cols-3 gap-1.5">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "000", "0"].map((num) => <button key={num} onClick={() => handleNumpad(num)} className="liquid-button flex h-10 items-center justify-center rounded-[13px] text-[16px] font-medium active:bg-blue-100">{num}</button>)}
            <button onClick={() => handleNumpad("delete")} className="liquid-button flex h-10 items-center justify-center rounded-[13px] active:bg-blue-100"><Delete className="h-5 w-5" /></button>
          </div>
          <button onClick={submit} className={cn("mt-3 h-12 w-full rounded-[14px] text-[13px] font-semibold text-white transition-transform active:scale-[.99]", type === "expense" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700")}>Simpan transaksi</button>
        </footer>
      </div>
    </div>
  );
}

function MobileNav({ active, onChange, onAdd }: { active: View; onChange: (view: View) => void; onAdd: () => void }) {
  const mobileItems: { value: View; label: string; icon: typeof Home }[] = [
    { value: "dashboard", label: "Home", icon: Home },
    { value: "wallets", label: "Dompet", icon: Wallet },
    { value: "reports", label: "Laporan", icon: PieChartIcon },
    { value: "settings", label: "Pengaturan", icon: Settings },
  ];

  return (
    <nav className="pointer-events-none absolute bottom-[max(20px,env(safe-area-inset-bottom))] left-1/2 z-30 -translate-x-1/2 md:hidden">
      <div className="menu-shadow pointer-events-auto grid h-[72px] w-[calc(100vw-24px)] max-w-[420px] grid-cols-5 items-center rounded-full border border-white/90 bg-white/82 px-2 text-black backdrop-blur-[32px] backdrop-saturate-150 dark:border-white/10 dark:bg-[#17181a]/92 dark:text-white">
        {mobileItems.slice(0, 2).map((item) => (
          <MobileNavButton key={item.value} item={item} active={active} onChange={onChange} />
        ))}
        <button onClick={onAdd} aria-label="Tambah data" className="relative flex h-[72px] min-w-0 -translate-y-4 items-center justify-center rounded-full transition-transform active:scale-95">
          <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black"><Plus className="h-7 w-7 stroke-[1.8]" /></span>
          <span className="sr-only">Tambah</span>
        </button>
        {mobileItems.slice(2).map((item) => (
          <MobileNavButton key={item.value} item={item} active={active} onChange={onChange} />
        ))}
      </div>
    </nav>
  );
}

function MobileNavButton({ item, active, onChange }: { item: { value: View; label: string; icon: typeof Home }; active: View; onChange: (view: View) => void }) {
  const isActive = active === item.value;
  return (
    <button
      onClick={() => onChange(item.value)}
      aria-label={item.label}
      className={cn(
        "flex h-[58px] min-w-0 flex-col items-center justify-center gap-1 rounded-full border transition-colors duration-200",
        isActive ? "border-slate-600/30 bg-slate-700/85 text-white backdrop-blur-xl dark:border-white/15 dark:bg-slate-500/28 dark:text-white" : "border-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-white/55 dark:hover:bg-white/5 dark:hover:text-white/80",
      )}
    >
      <item.icon className={cn("h-[19px] w-[19px] shrink-0", isActive ? "stroke-[2.5]" : "stroke-[1.9]")} />
      <span className="max-w-full truncate text-[10px] font-medium leading-none">{item.label}</span>
    </button>
  );
}
function DesktopSidebar({ active, onChange }: { active: View; onChange: (view: View) => void }) {
  const items: { value: View; label: string; icon: typeof Home }[] = [
    { value: "dashboard", label: "Dashboard", icon: Home },
    { value: "transactions", label: "Transaksi", icon: ReceiptText },
    { value: "wallets", label: "Dompet", icon: Wallet },
    { value: "savings", label: "Tabungan", icon: Target },
    { value: "debt", label: "Hutang / Piutang", icon: Landmark },
    { value: "reports", label: "Laporan", icon: PieChartIcon },
    { value: "export", label: "Export", icon: FileSpreadsheet },
    { value: "receipt", label: "Scan Struk", icon: Camera },
  ];

  return (
    <aside className="z-10 hidden h-full border-r border-slate-200/70 bg-white/92 p-4 backdrop-blur-2xl dark:border-white/7 dark:bg-[#111b20]/92 md:block lg:p-5">
      <div className="mb-7 flex items-center gap-3 px-2 py-2">
        <div className="float-shadow flex h-11 w-11 items-center justify-center rounded-[15px] bg-blue-600 text-white dark:bg-blue-600">
          <Wallet className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[15px] font-semibold tracking-[-0.02em]">Catat Keuangan</div>
          <div className="mt-0.5 text-[10px] font-medium text-slate-500">Finansial lebih tenang</div>
        </div>
      </div>
      <div className="grid gap-1.5">
        {items.map((item) => (
          <button key={item.value} onClick={() => onChange(item.value)} className={cn("flex h-11 items-center gap-3 rounded-[14px] border px-3 text-left text-[12px] font-medium transition-colors", active === item.value ? "soft-shadow border-slate-300 bg-slate-200 text-slate-800 dark:border-white/10 dark:bg-white/10 dark:text-white" : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5") }>
            <item.icon className="h-[17px] w-[17px]" />
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}




































