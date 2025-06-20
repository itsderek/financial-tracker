import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";

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
        const response = await axios.get<Account[]>("http://localhost:8000/api/get-accounts");
        setAccounts(response.data); // Axios parses JSON automatically
      } catch (error) {
        const err = error as AxiosError;
        // Axios includes status info in the error response
        if (err.response) {
          console.error("Failed to fetch accounts:", err.response.status);
        } else {
          console.error("Error fetching accounts:", err.message);
        }
      }
    };

    fetchAccounts();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Available Accounts</h1>

      <div className="grid grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="max-w-sm min-w-2xs">
            <CardHeader>
              <CardTitle>{account.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/import-transactions")}>+</Button>
            </CardContent>
          </Card>
        ))}
        <Card className="max-w-sm min-w-2xs">
          <CardHeader>
            <CardTitle>Add Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/add-account")}>+</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default AccountCards;
