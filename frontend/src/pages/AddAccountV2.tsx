"use client";

import { DataTable } from "../components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { useCSVReader } from "react-papaparse";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = z.object({
  accountname: z.string().min(2, "Account Name is required"),
  balance: z.coerce.number(),
  configuration: z.record(z.string().nullable()).refine(
    (obj) => {
      // Count how many values are NOT null
      const nonNullCount = Object.values(obj).filter((v) => v !== null).length;
      return nonNullCount >= 3;
    },
    {
      message: "At least 3 configuration fields must be selected (non-null).",
    }
  ),
});

export default function AddAccountV2() {
  const { CSVReader } = useCSVReader();

  const [columns, setColumns] = useState<ColumnDef<any, any>[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [hasHeader, setHasHeaders] = useState<boolean>(true);
  const [parsedResults, setParsedResults] = useState<any>(null);
  const [configuration, setConfiguration] = useState<{ [key: string]: string | null } | undefined>();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      accountname: "",
      balance: 0,
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log("Validated form data:", data);
  };

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

  useEffect(() => {
    form.setValue("configuration", configuration || {});
  }, [configuration]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            onSubmit(data);
          })}
          className="mb-4 p-4 border rounded space-y-4"
        >
          <FormField
            control={form.control}
            name="accountname"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <FormLabel className="w-32 text-right">Account Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="shadcn" {...field} />
                  </FormControl>
                </div>
                <FormMessage className="ml-32" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="balance"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormLabel className="w-32">Balance Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Enter balance" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit Form</Button>
        </form>
      </Form>
      <CSVReader onUploadAccepted={csvRead}>
        {({ getRootProps, acceptedFile }: any) => (
          <>
            <div className="flex gap-2 max-w-xl">
              <Button onClick={() => console.log(configuration)}>Console Log Config</Button>
              <Button type="button" {...getRootProps()}>
                Browse file
              </Button>
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
    </>
  );
}
