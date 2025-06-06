import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { useEffect, useState } from "react";
import { SelectTester, InsertTester } from "@/components/database-tester";
import Papa, { type ParseResult } from "papaparse";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type CSVRow = Record<string, string>;

function TransactionImporter() {
  const [file, setFile] = useState<File | null>(null);
  const [hasHeader, setHasHeader] = useState(true);
  const [data, setData] = useState<CSVRow[]>([]);

  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   Papa.parse(file, {
  //     header: true,
  //     skipEmptyLines: true,
  //     complete: (results: ParseResult<CSVRow>) => {
  //       setData(results.data);
  //       console.log("Parsed CSV data: ", results.data);
  //     },
  //     error: (err) => {
  //       console.error("Error parsing CSV: ", err);
  //     },
  //   });
  // };

  const parseCSV = (csvFile: File, header: boolean) => {
    Papa.parse(csvFile, {
      header,
      skipEmptyLines: true,
      complete: (results: ParseResult<CSVRow>) => {
        setData(results.data);
        console.log(results.data);
      },
      error: (error) => {
        console.error("CSV parse error: ", error);
      },
    });
  };

  useEffect(() => {
    if (file) {
      parseCSV(file, hasHeader);
    }
  }, [file, hasHeader]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle></ModeToggle>

      <h1>Import Transactions</h1>

      <SelectTester></SelectTester>
      <InsertTester></InsertTester>

      <input type="file" accept=".csv" onChange={handleFileChange} />

      {/* <Table>
            <TableCaption>CSV Transactions</TableCaption>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row["Account ID"]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table> */}

      <div>
        {data.length > 0 ? (
          <div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="headerrow"
                checked={hasHeader}
                onCheckedChange={(checked) => {
                  console.log(!!checked);
                  setHasHeader(!!checked);
                }}
              />
              <Label htmlFor="headerrow">CSV has header row</Label>
            </div>
            <Table>
              {hasHeader && !Array.isArray(data[0]) && (
                <TableHeader>
                  <TableRow>
                    {Object.keys(data[0]).map((key) => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
              )}

              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.isArray(row)
                      ? row.map((cell, cellIndex) => <TableCell key={cellIndex}>{cell}</TableCell>)
                      : Object.values(row).map((val, i) => <TableCell key={i}>{val}</TableCell>)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>{" "}
          </div>
        ) : (
          <p>No data to display</p>
        )}
      </div>
    </ThemeProvider>
  );
}

export default TransactionImporter;
