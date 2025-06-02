// src/DemoPage.tsx
import { useEffect, useState } from "react";
import { columns, type Payment } from "./columns";
import { DataTable } from "./data-table";

export default function DemoPage() {
  const [data, setData] = useState<Payment[]>([]);

  useEffect(() => {
    async function getData() {
      const result: Payment[] = [
        {
          id: "728ed52f",
          amount: 100,
          status: "pending",
          email: "m@example.com",
        },
        // Add more rows if needed
      ];
      setData(result);
    }

    getData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
