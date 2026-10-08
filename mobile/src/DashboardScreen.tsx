import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useFinanceStore } from "./store";
import { colors, formatRupiah } from "./theme";

type Props = {
  onAdd: () => void;
};

const periods = ["Harian", "Mingguan", "Bulanan", "Tahunan"];

export function DashboardScreen({ onAdd }: Props) {
  const insets = useSafeAreaInsets();
  const wallets = useFinanceStore((state) => state.wallets);
  const transactions = useFinanceStore((state) => state.transactions);
  const activeWallet = wallets[0];
  const todayTransactions = transactions.filter((item) => item.date === "2026-07-11");
  const income = todayTransactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);
  const expense = todayTransactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable hitSlop={12}><MaterialCommunityIcons name="chevron-left" size={36} color={colors.text} /></Pressable>
        <Text style={styles.month}>Jul 2026</Text>
        <Pressable hitSlop={12}><MaterialCommunityIcons name="chevron-right" size={36} color={colors.text} /></Pressable>
        <View style={styles.topSpacer} />
        <MaterialCommunityIcons name="tray-arrow-down" size={28} color={colors.text} />
        <MaterialCommunityIcons name="calendar-month-outline" size={28} color={colors.text} />
        <MaterialCommunityIcons name="filter-variant" size={30} color={colors.text} />
      </View>

      <View style={styles.periodBar}>
        {periods.map((period, index) => (
          <View key={period} style={[styles.periodItem, index === 0 && styles.periodActive]}>
            <Text style={[styles.periodText, index === 0 && styles.periodActiveText]}>{period}</Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.label}>Total</Text>
              <Text style={styles.balance}>{formatRupiah(activeWallet?.balance ?? 0)}</Text>
            </View>
            <View style={styles.walletPill}>
              <Text style={styles.walletPillText}>{activeWallet?.name ?? "Buku Utama"}</Text>
              <MaterialCommunityIcons name="chevron-down" size={18} color={colors.text} />
            </View>
            <MaterialCommunityIcons name="tune-variant" size={27} color={colors.muted} />
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.stat}>
              <View style={[styles.statIcon, styles.incomeIcon]}>
                <MaterialCommunityIcons name="arrow-up" size={24} color={colors.income} />
              </View>
              <View>
                <Text style={styles.statLabel}>Pemasukan</Text>
                <Text style={[styles.statAmount, { color: colors.income }]}>{formatRupiah(income)}</Text>
              </View>
            </View>
            <View style={styles.stat}>
              <View style={[styles.statIcon, styles.expenseIcon]}>
                <MaterialCommunityIcons name="arrow-down" size={24} color={colors.expense} />
              </View>
              <View>
                <Text style={styles.statLabel}>Pengeluaran</Text>
                <Text style={[styles.statAmount, { color: colors.expense }]}>{formatRupiah(expense)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>Hari ini</Text>
          <View style={styles.dayTotals}>
            <Text style={styles.dayIncome}>+Rp {new Intl.NumberFormat("id-ID").format(income)}</Text>
            <Text style={styles.dayExpense}>-Rp {new Intl.NumberFormat("id-ID").format(expense)}</Text>
          </View>
        </View>

        {todayTransactions.map((transaction, index) => (
          <View key={transaction.id} style={styles.transactionRow}>
            <View style={styles.timeline}>
              {index < todayTransactions.length - 1 && <View style={styles.timelineLine} />}
              <View style={styles.timelineDot} />
            </View>
            <Text style={styles.transactionName}>{transaction.category}</Text>
            <Text style={[styles.transactionAmount, transaction.type === "income" ? styles.positive : styles.negative]}>
              {transaction.type === "income" ? "+" : "-"}{formatRupiah(transaction.amount)}
            </Text>
          </View>
        ))}
      </ScrollView>

      <Pressable onPress={onAdd} style={[styles.fab, { bottom: 82 + insets.bottom }]}>
        <MaterialCommunityIcons name="plus" size={42} color={colors.white} />
      </Pressable>

      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {[
          ["home", "Beranda"],
          ["wallet-outline", "Dompet"],
          ["chart-box-outline", "Laporan"],
          ["cog", "Pengaturan"],
        ].map(([icon, label], index) => (
          <View key={label} style={styles.navItem}>
            <MaterialCommunityIcons name={icon as never} size={28} color={index === 0 ? colors.white : colors.muted} />
            <Text style={[styles.navLabel, index === 0 && styles.navActive]}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  topBar: { height: 68, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: colors.surface },
  month: { color: colors.text, fontSize: 21, marginHorizontal: 2 },
  topSpacer: { flex: 1 },
  periodBar: { height: 72, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", justifyContent: "space-around", borderBottomWidth: 1, borderBottomColor: "#252527" },
  periodItem: { paddingVertical: 13, paddingHorizontal: 16, borderRadius: 28 },
  periodActive: { backgroundColor: "#ce373b" },
  periodText: { color: colors.text, fontSize: 17 },
  periodActiveText: { fontWeight: "700" },
  content: { padding: 16, paddingBottom: 190 },
  summaryCard: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, padding: 15 },
  summaryTop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  label: { color: colors.text, fontSize: 16 },
  balance: { color: colors.text, fontSize: 24, fontWeight: "800", marginTop: 4 },
  walletPill: { marginLeft: "auto", backgroundColor: "#c7373d", flexDirection: "row", alignItems: "center", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  walletPillText: { color: colors.text, fontSize: 14, fontWeight: "600" },
  summaryStats: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  stat: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  statIcon: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  incomeIcon: { backgroundColor: "#17331e" },
  expenseIcon: { backgroundColor: "#351c1e" },
  statLabel: { color: colors.text, fontSize: 14 },
  statAmount: { fontSize: 16, fontWeight: "700", marginTop: 4 },
  dayHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 16, marginBottom: 6 },
  dayTitle: { color: colors.muted, fontSize: 16 },
  dayTotals: { flexDirection: "row", gap: 14 },
  dayIncome: { color: "#c8c8cc", fontSize: 15 },
  dayExpense: { color: "#c8c8cc", fontSize: 15 },
  transactionRow: { minHeight: 48, flexDirection: "row", alignItems: "center" },
  timeline: { width: 32, height: 48, alignItems: "center", justifyContent: "center" },
  timelineLine: { position: "absolute", width: 2, backgroundColor: "#d9d9dc", top: 24, bottom: -24 },
  timelineDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.white },
  transactionName: { color: colors.text, fontSize: 18, flex: 1, marginLeft: 8 },
  transactionAmount: { fontSize: 17, fontWeight: "600" },
  positive: { color: colors.income },
  negative: { color: colors.expense },
  fab: { position: "absolute", right: 20, width: 66, height: 66, borderRadius: 20, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", elevation: 6 },
  bottomNav: { minHeight: 74, backgroundColor: colors.surface, borderTopColor: "#313134", borderTopWidth: 1, flexDirection: "row", justifyContent: "space-around", paddingTop: 12 },
  navItem: { alignItems: "center", minWidth: 72 },
  navLabel: { color: colors.muted, marginTop: 4, fontSize: 13 },
  navActive: { color: colors.white },
});
