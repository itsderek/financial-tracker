"use client";

import { DataTable } from "../components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useCSVReader } from "react-papaparse";

export default function AddAccountV2() {
  const { CSVReader } = useCSVReader();

  const [columns, setColumns] = useState<ColumnDef<any, any>[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [hasHeader, setHasHeaders] = useState<boolean>(true);
  const [parsedResults, setParsedResults] = useState<any>(null);
  const [configuration, setConfiguration] = useState<{ [key: string]: string | null } | undefined>();

  const csvRead = (results: any, hasHeaders: boolean) => {
    setParsedResults(results);

    let headers: string[] = [];
    let rows: string[][] = [];

    if (hasHeaders) {
      headers = results.data[0] as string[];
      rows = results.data.slice(1);
    } else {
      rows = results.data as string[][];
      const columnCount = rows[0]?.length || 0;
      headers = Array.from({ length: columnCount }, (_, index) => `Column${index + 1}`);
    }

    const columns = headers.map((header: string) => ({
      accessorKey: header,
      header,
    }));

    const data = rows.map((row: any[]) => {
      const obj: Record<string, any> = {};
      row.forEach((value, index) => {
        obj[headers[index]] = value;
      });
      return obj;
    });

    setColumns(columns);
    setData(data);

    const config = columns.reduce((acc, val) => {
      acc[val.header] = null;
      return acc;
    }, {} as { [key: string]: string | null });

    setConfiguration(config);
  };

  const handleSetHasHeaders = () => {
    const newHasHeaders = !hasHeader;
    setHasHeaders(newHasHeaders);

    if (parsedResults) {
      csvRead(parsedResults, newHasHeaders);
    }
  };

  const handleSetConfiguration = (key: string, val: string | null) => {
    setConfiguration((prev) => {
      if (!prev) return prev;

      // Create a new copy of the config
      const newConfig: { [key: string]: string | null } = {};

      for (const k in prev) {
        // Remove the selected value from other keys
        if (k !== key && prev[k] === val) {
          newConfig[k] = null;
        } else {
          newConfig[k] = prev[k];
        }
      }

      // Set the new value for this key
      newConfig[key] = val;

      return newConfig;
    });
  };

  return (
    <CSVReader onUploadAccepted={csvRead}>
      {({ getRootProps, acceptedFile, getRemoveFileProps }: any) => (
        <>
          <div className="flex gap-2">
            <Button type="button" onClick={() => console.log(hasHeader)}>
              hasHeader Value
            </Button>
            <Button onClick={() => console.log(configuration)}>print config</Button>
            <Button type="button" {...getRootProps()}>
              Browse file
            </Button>

            <Button {...getRemoveFileProps()}>Remove</Button>
          </div>
          <div>
            {acceptedFile && (
              <Card className="p-4">
                <div className="flex gap-2">
                  <Label>Has Headers</Label>
                  <Checkbox checked={hasHeader} onCheckedChange={handleSetHasHeaders} />
                </div>
                <CardContent>
                  {
                    <DataTable
                      columns={columns}
                      data={data}
                      configFile={configuration}
                      onConfigChange={handleSetConfiguration}
                    />
                  }
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </CSVReader>
  );
}
