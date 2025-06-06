import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { useEffect, useState } from "react";
import { SelectTester, InsertTester } from "@/components/database-tester";
import Papa, { type ParseResult } from "papaparse";
import { Button } from "@/components/ui/button";

import { IconLoader } from "@tabler/icons-react";

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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type CSVRow = Record<string, string>;

function TransactionImporter() {
  const [file, setFile] = useState<File | null>(null);
  const [hasHeader, setHasHeader] = useState(true);
  const [data, setData] = useState<CSVRow[]>([]);
  const [importing, setImporting] = useState(false);

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

      <div>
        {data.length > 0 ? (
          <div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="headerrow"
                checked={hasHeader}
                onCheckedChange={(checked) => {
                  setHasHeader(!!checked);
                }}
              />
              <Label htmlFor="headerrow">CSV has header row</Label>
              <Button onClick={() => setImporting(true)}>Import Transactions to Database</Button>
            </div>
            <Table>
              {/* {hasHeader && !Array.isArray(data[0]) && ( */}
              <TableHeader>
                <TableRow>
                  {importing ? <TableHead>Import Status</TableHead> : null}

                  {hasHeader && !Array.isArray(data[0])
                    ? Object.keys(data[0]).map((key) => <TableHead key={key}>{key}</TableHead>)
                    : Array.isArray(data[0]) &&
                      data[0]?.map((_, index) => <TableHead key={index}>{`Field ${index + 1}`}</TableHead>)}

                  {/* {Object.keys(data[0]).map((key) => (
                      <TableHead key={key}>{key}</TableHead>
                    ))} */}
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {importing && (
                      <TableCell>
                        <IconLoader stroke={2} />
                      </TableCell>
                    )}
                    {Array.isArray(row)
                      ? row.map((cell, cellIndex) => (
                          <TableCell className="max-w-[200px] truncate whitespace-nowrap" key={cellIndex}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>{cell}</span>
                              </TooltipTrigger>
                              <TooltipContent>{cell}</TooltipContent>
                            </Tooltip>
                          </TableCell>
                        ))
                      : Object.values(row).map((val, i) => (
                          <TableCell className="max-w-[200px] truncate whitespace-nowrap" key={i}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>{val}</span>
                              </TooltipTrigger>
                              <TooltipContent>{val}</TooltipContent>
                            </Tooltip>
                          </TableCell>
                        ))}
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
