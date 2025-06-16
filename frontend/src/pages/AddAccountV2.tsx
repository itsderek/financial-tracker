"use client";

import { DataTable } from "../components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCSVReader } from "react-papaparse";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AccountType {
  id: number;
  name: string;
}

const schema = z.object({
  accountname: z.string().min(2, "Account Name is required"),
  accounttype: z.number(),
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
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [columns, setColumns] = useState<ColumnDef<any, any>[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [hasHeader, setHasHeaders] = useState<boolean>(true);
  const [parsedResults, setParsedResults] = useState<any>(null);
  const [configuration, setConfiguration] = useState<{ [key: string]: string | null } | undefined>();

  useEffect(() => {
    const fetchAccountTypes = async () => {
      try {
        const response = await axios.get<AccountType[]>("http://localhost:8000/get-account-types");
        setAccountTypes(response.data);
      } catch (error) {
        console.error("Error fetching account types:", error);
      }
    };

    fetchAccountTypes();
  }, []);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      accountname: "",
      accounttype: 0,
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
      <Card className="min-w-lg max-w-lg p-4">
        <Form {...form}>
          <form
            id="mainForm"
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
              name="accounttype"
              render={({ field }) => (
                <div className="flex items-center gap-1">
                  <FormLabel className="w-32 text-right">Account Type</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value?.toString() || ""}
                    defaultValue={field.value?.toString() || ""}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select Account Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Account Types</SelectLabel>
                        {accountTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
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
          </form>
        </Form>
      </Card>
      <Button className="m-5" type="submit" form="mainForm">
        Submit Form
      </Button>
      <Card className="min-w-lg p-4">
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
      </Card>
    </>
  );
}
