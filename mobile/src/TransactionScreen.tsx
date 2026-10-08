import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TransactionType, useFinanceStore } from "./store";
import { colors, formatAmountInput } from "./theme";

type Props = { onBack: () => void };

const expenseCategories = [
  ["Makanan", "silverware-fork-knife"], ["Belanja", "shopping-outline"],
  ["Hiburan", "party-popper"], ["Transportasi", "bus"],
  ["Tagihan", "receipt-text-outline"], ["Kesehatan", "medical-bag"],
  ["Pendidikan", "school-outline"], ["Lainnya", "shape-outline"],
] as const;

const incomeCategories = [
  ["Gaji", "cash"], ["Bisnis", "storefront-outline"], ["Freelance", "laptop"],
  ["Tabungan", "wallet-outline"], ["Hadiah", "gift-outline"], ["Lainnya", "shape-outline"],
] as const;

const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "000", "0", "backspace"];

export function TransactionScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const wallets = useFinanceStore((state) => state.wallets);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [walletIndex, setWalletIndex] = useState(0);
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const categories = useMemo(() => type === "expense" ? expenseCategories : incomeCategories, [type]);

  const changeType = (nextType: TransactionType) => { setType(nextType); setCategory(""); };
  const pressKey = (key: string) => {
    if (key === "backspace") return setAmount((current) => current.slice(0, -1));
    setAmount((current) => `${current}${key}`.replace(/^0+/, "").slice(0, 12));
  };
  const save = () => {
    const numericAmount = Number(amount);
    const wallet = wallets[walletIndex];
    if (!numericAmount) return Alert.alert("Nominal belum diisi", "Masukkan jumlah transaksi terlebih dahulu.");
    if (!category) return Alert.alert("Kategori belum dipilih", "Pilih salah satu kategori transaksi.");
    if (!wallet) return Alert.alert("Dompet belum tersedia", "Tambahkan dompet sebelum menyimpan transaksi.");
    addTransaction({ type, amount: numericAmount, category, walletId: wallet.id, note: note.trim(), date: "2026-07-11" });
    onBack();
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12}><MaterialCommunityIcons name="arrow-left" size={30} color={colors.text} /></Pressable>
        <Text style={styles.date}>11 Jul 2026</Text><MaterialCommunityIcons name="chevron-down" size={22} color={colors.text} />
        <View style={styles.headerSpacer} /><MaterialCommunityIcons name="tune-variant" size={29} color={colors.text} />
      </View>
      <View style={styles.tabsWrap}>
        <Pressable onPress={() => changeType("expense")} style={[styles.tab, type === "expense" && styles.expenseTab]}><Text style={styles.tabText}>Pengeluaran</Text></Pressable>
        <Pressable onPress={() => changeType("income")} style={[styles.tab, type === "income" && styles.incomeTab]}><Text style={styles.tabText}>Pemasukan</Text></Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        <Text style={styles.amount}>Rp {formatAmountInput(amount)}</Text><View style={styles.divider} />
        <Pressable onPress={() => setWalletIndex((current) => (current + 1) % Math.max(wallets.length, 1))} style={styles.inputBox}>
          <MaterialCommunityIcons name="wallet-outline" size={27} color="#c9c9cc" />
          <Text style={styles.inputText}>{wallets[walletIndex]?.name ?? "Pilih dompet"}</Text>
          <MaterialCommunityIcons name="chevron-down" size={24} color="#77777c" />
        </Pressable>
        <View style={styles.categories}>
          {categories.map(([label, icon]) => {
            const selected = category === label;
            return <Pressable key={label} onPress={() => setCategory(label)} style={styles.categoryItem}>
              <View style={[styles.categoryIcon, selected && (type === "income" ? styles.categoryIncome : styles.categoryExpense)]}>
                <MaterialCommunityIcons name={icon} size={29} color={selected ? colors.white : "#c8c8cb"} />
              </View>
              <Text style={[styles.categoryLabel, selected && styles.categorySelectedText]}>{label}</Text>
            </Pressable>;
          })}
        </View>
        <View style={styles.noteBox}>
          <MaterialCommunityIcons name="note-edit-outline" size={26} color="#c9c9cc" />
          <TextInput value={note} onChangeText={(value) => setNote(value.slice(0, 80))} placeholder="Tambah catatan" placeholderTextColor="#a4a4aa" style={styles.noteInput} maxLength={80} />
          <Text style={styles.counter}>{note.length}/80</Text>
        </View>
      </ScrollView>
      <View style={[styles.keypadPanel, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.keypad}>{keypad.map((key) => <Pressable key={key} onPress={() => pressKey(key)} style={styles.key}>
          {key === "backspace" ? <MaterialCommunityIcons name="backspace-outline" size={29} color={colors.text} /> : <Text style={styles.keyText}>{key}</Text>}
        </Pressable>)}</View>
        <Pressable onPress={save} style={styles.saveButton}><Text style={styles.saveText}>Simpan</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { height: 68, paddingHorizontal: 20, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center" },
  date: { color: colors.text, fontSize: 20, marginLeft: "auto" }, headerSpacer: { flex: 1 },
  tabsWrap: { height: 78, padding: 14, flexDirection: "row", backgroundColor: colors.surface, borderBottomColor: "#252527", borderBottomWidth: 1 },
  tab: { flex: 1, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#303032" },
  expenseTab: { backgroundColor: colors.primaryDark }, incomeTab: { backgroundColor: colors.incomeDark },
  tabText: { color: colors.text, fontSize: 18, fontWeight: "600" },
  form: { paddingHorizontal: 16, paddingTop: 22, paddingBottom: 320 },
  amount: { color: colors.text, fontSize: 40, textAlign: "center" },
  divider: { height: 1, backgroundColor: "#343437", marginHorizontal: 18, marginTop: 16, marginBottom: 18 },
  inputBox: { height: 58, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", paddingHorizontal: 15, gap: 12 },
  inputText: { color: "#b8b8bd", fontSize: 17, flex: 1 },
  categories: { flexDirection: "row", flexWrap: "wrap", marginTop: 22, rowGap: 18 },
  categoryItem: { width: "25%", alignItems: "center" }, categoryIcon: { width: 48, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  categoryExpense: { backgroundColor: colors.primaryDark }, categoryIncome: { backgroundColor: colors.incomeDark },
  categoryLabel: { color: "#d0d0d3", fontSize: 13, marginTop: 5, textAlign: "center" }, categorySelectedText: { color: colors.white, fontWeight: "700" },
  noteBox: { height: 58, marginTop: 24, borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", paddingHorizontal: 15 },
  noteInput: { flex: 1, color: colors.text, fontSize: 16, marginLeft: 10 }, counter: { color: colors.muted, fontSize: 14 },
  keypadPanel: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "#101011", borderTopWidth: 1, borderTopColor: "#252527", paddingTop: 10, paddingHorizontal: 12 },
  keypad: { flexDirection: "row", flexWrap: "wrap" }, key: { width: "33.333%", height: 52, alignItems: "center", justifyContent: "center" },
  keyText: { color: colors.text, fontSize: 28, fontWeight: "300" },
  saveButton: { height: 52, backgroundColor: colors.primary, borderRadius: 28, alignItems: "center", justifyContent: "center", marginTop: 6 },
  saveText: { color: colors.white, fontSize: 18, fontWeight: "700" },
});
