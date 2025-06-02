import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";
import { SelectTester, InsertTester } from "@/components/database-tester";

function TransactionImporter() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle></ModeToggle>

      <h1>Import Transactions</h1>

      <SelectTester></SelectTester>
      <InsertTester></InsertTester>
    </ThemeProvider>
  );
}

export default TransactionImporter;
