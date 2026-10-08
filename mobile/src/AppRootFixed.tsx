import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { DashboardScreen } from "./DashboardScreen";
import { TransactionScreen } from "./TransactionScreen";

export default function AppRootFixed() {
  const [screen, setScreen] = useState<"dashboard" | "transaction">("dashboard");

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {screen === "dashboard" ? (
        <DashboardScreen onAdd={() => setScreen("transaction")} />
      ) : (
        <TransactionScreen onBack={() => setScreen("dashboard")} />
      )}
    </SafeAreaProvider>
  );
}
