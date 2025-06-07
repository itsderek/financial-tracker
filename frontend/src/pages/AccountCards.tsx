import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Account {
  id: number;
  name: string;
}

function AccountCards() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("http://localhost:8000/get-accounts");
        if (response.ok) {
          const data = await response.json();
          setAccounts(data);
        } else {
          console.error("Failed to fetch accounts:", response.status);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
      <h1 className="text-2xl font-bold mb-4">Available Accounts</h1>

      <div className="grid gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="max-w-sm">
            <CardHeader>
              <CardTitle>{account.name}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Add Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate("/import-transactions")}>+</Button>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

export default AccountCards;
