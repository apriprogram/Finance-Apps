import type { ReactNode } from "react";
import { useCallback, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronDown, Eye, Plus, WalletCards, X } from "lucide-react";
import { useFinanceStore } from "./use-finance-store";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/lib/use-click-outside";

const tabs = [{ key: "saldo", id: "Saldo", en: "Balance" }, { key: "tabungan", id: "Tabungan", en: "Savings" }, { key: "tagihan", id: "Tagihan", en: "Bills" }, { key: "utang", id: "Utang", en: "Debt" }];

export function WalletScreen({ language = "id" }: { language?: "id" | "en" }) {
  const isEnglish = language === "en";
  const walletName = (name: string) => isEnglish && name === "Tabungan BCA" ? "BCA Savings" : name;
  const { wallets } = useFinanceStore();
  const [activeTab, setActiveTab] = useState("saldo");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState("Semua buku");
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const bookPickerRef = useRef<HTMLDivElement>(null);
  const closeBookPicker = useCallback(() => setIsBookOpen(false), []);
  useClickOutside(bookPickerRef, isBookOpen, closeBookPicker);
  const totalBalance = wallets.reduce((acc, wallet) => acc + wallet.currentBalance, 0);

  return (
    <>
      <div className="animate-page h-full min-w-0 w-full overflow-x-hidden overflow-y-auto px-4 pb-28 pt-5 sm:px-6 md:px-8 md:pb-8 md:pt-7">
        <div className="mx-auto max-w-[1180px]">
          <header className="flex items-center justify-between gap-3">
            <h1 className="text-xl font-semibold tracking-[-0.025em] text-slate-900 dark:text-white md:text-2xl">{isEnglish ? "My wallets" : "Dompet saya"}</h1>
            <div ref={bookPickerRef} className="relative">
              <button onClick={() => setIsBookOpen((value) => !value)} aria-expanded={isBookOpen} className="glass-surface flex h-11 items-center gap-2 rounded-full px-4 text-[11px] font-medium text-[#40515b] dark:text-[#d8e8ec]">{isEnglish ? (selectedBook === "Semua buku" ? "All books" : "Main Book") : selectedBook} <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isBookOpen && "rotate-180")} /></button>
              {isBookOpen && <div className="glass-strong animate-card absolute right-0 top-12 z-20 w-40 rounded-[15px] p-1.5">{["Semua buku", "Buku Utama"].map((book) => <button key={book} onClick={() => { setSelectedBook(book); setIsBookOpen(false); }} className={cn("flex h-10 w-full items-center rounded-[10px] px-3 text-left text-[11px]", selectedBook === book ? "bg-slate-200 text-slate-900 dark:bg-white/10 dark:text-white" : "hover:bg-blue-50 dark:hover:bg-white/5")}>{isEnglish ? (book === "Semua buku" ? "All books" : "Main Book") : book}</button>)}</div>}
            </div>
          </header>

          <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn("h-10 shrink-0 rounded-full border px-5 text-[12px] font-medium transition-colors", isActive ? "border-slate-800 bg-slate-800 text-white dark:border-white/15 dark:bg-slate-600 dark:text-white" : "border-slate-200 bg-white text-[#667489] hover:border-blue-200 hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-[#aebbc1]")}>{isEnglish ? tab.en : tab.id}</button>
              );
            })}
          </div>

          {activeTab === "saldo" ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
              <section className="glass-surface relative overflow-hidden rounded-[22px] p-5 sm:p-6">
                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-medium text-[#647680] dark:text-[#cae6eb]">{isEnglish ? "Total balance" : "Total saldo"}</p>
                    <p className="mt-2 text-[27px] font-semibold tracking-[-0.045em] text-[#12242c] dark:text-white sm:text-[32px]">{isBalanceVisible ? formatCurrency(totalBalance) : "Rp ••••••••"}</p>
                  </div>
                  <button onClick={() => setIsBalanceVisible((value) => !value)} aria-label={isBalanceVisible ? "Sembunyikan saldo" : "Tampilkan saldo"} className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-600 dark:border-white/15 dark:bg-white/10 dark:text-blue-300"><Eye className="h-[17px] w-[17px]" /></button>
                </div>
                <div className="relative mt-8 flex items-center gap-2 text-[11px] font-medium text-[#526872] dark:text-[#d9edf1]"><WalletCards className="h-4 w-4" /> {wallets.length} {isEnglish ? "active wallets" : "dompet aktif"}</div>
              </section>

              <section className="glass-surface rounded-[22px] p-4 sm:p-5">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <h2 className="text-[15px] font-semibold tracking-[-0.02em]">{isEnglish ? "Wallet list" : "Daftar dompet"}</h2>
                    <p className="mt-0.5 text-[11px] text-[#75838c] dark:text-[#a7b6bd]">{isEnglish ? "Balance from each active account" : "Saldo dari setiap akun aktif"}</p>
                  </div>
                  <button onClick={() => setIsAddModalOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white" aria-label={isEnglish ? "Add wallet" : "Tambah dompet"}><Plus className="h-[18px] w-[18px]" /></button>
                </div>
                <div className="divide-y divide-slate-200/70 dark:divide-white/7">
                  {wallets.map((wallet) => (
                    <div key={wallet.id} className="flex items-center gap-3 py-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-blue-100 bg-white text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-blue-200"><WalletCards className="h-[18px] w-[18px]" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium">{walletName(wallet.name)}</p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-wide text-[#7c8990] dark:text-[#a7b6bd]">{wallet.type}</p>
                      </div>
                      <p className="shrink-0 text-[12px] font-semibold">{formatCurrency(wallet.currentBalance)}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="glass-surface mt-4 flex min-h-56 flex-col items-center justify-center rounded-[28px] p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-white text-blue-600 dark:bg-white/5 dark:text-blue-200"><WalletCards className="h-5 w-5" /></div>
              <h2 className="mt-4 text-[14px] font-semibold">{isEnglish ? tabs.find((tab) => tab.key === activeTab)?.en : tabs.find((tab) => tab.key === activeTab)?.id}</h2>
              <p className="mt-1 max-w-xs text-[11px] leading-5 text-[#75838c] dark:text-[#a7b6bd]">{isEnglish ? "No data is available in this section. Add new data to start monitoring your finances." : "Belum ada data pada bagian ini. Tambahkan data baru untuk mulai memantau keuangan."}</p>
            </div>
          )}
        </div>
      </div>

      <AddWalletModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} language={language} />
    </>
  );
}

function AddWalletModal({ open, onClose, language }: { open: boolean; onClose: () => void; language: "id" | "en" }) {
  const isEnglish = language === "en";
  const { addWallet } = useFinanceStore();
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [type, setType] = useState("tercatat");
  const [canBeNegative, setCanBeNegative] = useState(true);
  const [note, setNote] = useState("");
  const [book, setBook] = useState("Buku Utama");
  const [isBookOpen, setIsBookOpen] = useState(false);
  const bookPickerRef = useRef<HTMLDivElement>(null);
  const closeBookPicker = useCallback(() => setIsBookOpen(false), []);
  useClickOutside(bookPickerRef, isBookOpen, closeBookPicker);

  if (!open) return null;

  function saveWallet() {
    const parsedBalance = Number(balance || 0);
    if (!name.trim()) return;
    addWallet({ name: name.trim(), currentBalance: parsedBalance, type: type === "tercatat" ? "cash" : "savings" });
    setName("");
    setBalance("");
    setNote("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#132017]/28 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <div className="glass-strong flex max-h-[94dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-[30px] sm:rounded-[30px]">
        <header className="flex h-16 items-center justify-between border-b border-slate-200/70 px-4 sm:px-5 dark:border-white/7">
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/55" aria-label={isEnglish ? "Back" : "Kembali"}><ArrowLeft className="h-[18px] w-[18px]" /></button>
          <div className="text-center"><h2 className="text-[14px] font-semibold">{isEnglish ? "Add wallet" : "Tambah dompet"}</h2><p className="text-[10px] text-[#75838c] dark:text-[#a7b6bd]">{isEnglish ? "Create a new financial account" : "Buat akun keuangan baru"}</p></div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/55" aria-label={isEnglish ? "Close" : "Tutup"}><X className="h-[18px] w-[18px]" /></button>
        </header>

        <div className="overflow-y-auto px-4 py-5 sm:px-6">
          <FormField label={isEnglish ? "Wallet name" : "Nama dompet"}>
            <div className="flex h-12 items-center gap-3 rounded-[13px] border border-slate-200 bg-white px-3.5 focus-within:border-blue-600 dark:border-white/10 dark:bg-white/5">
              <WalletCards className="h-[18px] w-[18px] text-blue-600" />
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Uang tunai, BCA, GoPay" className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#9ca79e]" />
            </div>
          </FormField>

          <FormField label={isEnglish ? "Book" : "Buku"}>
            <div ref={bookPickerRef} className="relative">
              <button onClick={() => setIsBookOpen((value) => !value)} aria-expanded={isBookOpen} className="flex h-12 w-full items-center justify-between rounded-[15px] border border-slate-200 bg-white px-4 text-[13px] dark:border-white/10 dark:bg-white/5"><span>{isEnglish ? (book === "Buku Utama" ? "Main Book" : "Personal Book") : book}</span><ChevronDown className={cn("h-4 w-4 text-[#7d8a91] transition-transform", isBookOpen && "rotate-180")} /></button>
              {isBookOpen && <div className="glass-strong animate-card absolute left-0 right-0 top-14 z-20 rounded-[14px] p-1.5">{["Buku Utama", "Buku Pribadi"].map((item) => <button key={item} onClick={() => { setBook(item); setIsBookOpen(false); }} className={cn("flex h-10 w-full items-center rounded-[10px] px-3 text-left text-[11px]", book === item ? "bg-slate-200 text-slate-900 dark:bg-white/10 dark:text-white" : "hover:bg-blue-50 dark:hover:bg-white/5")}>{isEnglish ? (item === "Buku Utama" ? "Main Book" : "Personal Book") : item}</button>)}</div>}
            </div>
          </FormField>

          <FormField label={isEnglish ? "Opening balance" : "Saldo awal"}>
            <div className="flex h-12 items-center rounded-[13px] border border-slate-200 bg-white px-4 focus-within:border-blue-600 dark:border-white/10 dark:bg-white/5">
              <span className="mr-2 text-[12px] text-[#75838c]">Rp</span>
              <input value={balance} onChange={(event) => setBalance(event.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="0" className="min-w-0 flex-1 bg-transparent text-[13px] font-medium outline-none" />
            </div>
          </FormField>

          <FormField label={isEnglish ? "Wallet type" : "Jenis dompet"}>
            <div className="grid gap-2 sm:grid-cols-2">
              <WalletTypeOption active={type === "tercatat"} onClick={() => setType("tercatat")} title={isEnglish ? "Included in cash flow" : "Tercatat di arus kas"} description={isEnglish ? "Included in transaction reports." : "Masuk ke laporan transaksi."} />
              <WalletTypeOption active={type === "tidak"} onClick={() => setType("tidak")} title={isEnglish ? "Not recorded" : "Tidak tercatat"} description={isEnglish ? "For asset monitoring only." : "Hanya untuk pemantauan aset."} />
            </div>
          </FormField>

          <div className="mb-5 flex items-center justify-between rounded-[18px] border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
            <div className="pr-4"><p className="text-[12px] font-medium">{isEnglish ? "Allow negative balance" : "Saldo bisa minus"}</p><p className="mt-0.5 text-[10px] leading-4 text-[#75838c] dark:text-[#a7b6bd]">{isEnglish ? "Allow the balance to fall below zero." : "Izinkan saldo berada di bawah nol."}</p></div>
            <button onClick={() => setCanBeNegative(!canBeNegative)} className={cn("flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors", canBeNegative ? "bg-blue-600" : "bg-slate-300 dark:bg-white/15")} aria-label="Ubah pengaturan saldo minus"><span className={cn("h-5 w-5 rounded-full bg-white transition-transform", canBeNegative && "translate-x-5")} /></button>
          </div>

          <FormField label={isEnglish ? "Note (optional)" : "Catatan (opsional)"}>
            <input value={note} onChange={(event) => setNote(event.target.value)} placeholder={isEnglish ? "Add a note" : "Tambah catatan"} className="h-12 w-full rounded-[13px] border border-slate-200 bg-white px-4 text-[13px] outline-none placeholder:text-[#9ca5aa] focus:border-blue-600 dark:border-white/10 dark:bg-white/5" />
          </FormField>
        </div>

        <footer className="border-t border-slate-200/70 p-4 sm:px-6 dark:border-white/7"><button onClick={saveWallet} disabled={!name.trim()} className="flex h-12 w-full items-center justify-center gap-2 rounded-[13px] bg-blue-600 text-[13px] font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"><Check className="h-[17px] w-[17px]" /> {isEnglish ? "Save wallet" : "Simpan dompet"}</button></footer>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="mb-5 block"><span className="mb-2 block text-[11px] font-medium text-[#56655b] dark:text-[#bdc9bb]">{label}</span>{children}</label>;
}

function WalletTypeOption({ active, onClick, title, description }: { active: boolean; onClick: () => void; title: string; description: string }) {
  return (
    <button onClick={onClick} className={cn("flex items-start gap-3 rounded-[16px] border p-3.5 text-left transition-colors", active ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30" : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5")}>
      <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border", active ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300")}>{active && <Check className="h-3 w-3" />}</span>
      <span><span className="block text-[11px] font-medium">{title}</span><span className="mt-1 block text-[10px] leading-4 text-[#75838c] dark:text-[#a7b6bd]">{description}</span></span>
    </button>
  );
}
