"use client";

import { useState, useEffect, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Papa, { type ParseResult } from "papaparse";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select";

type CSVRow = Record<string, string>;
type RequiredField = "amount" | "date" | "description";

type AmountMapping = {
  date?: string;
  description?: string;
  amount?: string | { debit: string; credit: string };
};

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  accounttype: z.enum(["Bank Account", "Savings Account", "Credit Card"], {
    errorMap: () => ({ message: "Select a valid Account Type" }),
  }),
  institution: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: "Institution must be blank or at least 2 characters.",
    }),
  starting_balance: z
    .number({
      required_error: "Starting balance is required",
      invalid_type_error: "Starting balance must be a number",
    })
    .refine((val) => Number.isFinite(val) && Number(val.toFixed(2)) === val, {
      message: "Starting balance must have at most two decimal places",
    }),
});

const fieldMappingSchema = z.object({
  date: z.string().min(1, "Date field is required"),
  description: z.string().min(1, "Description field is required"),
  amount: z.union([
    z.string().min(1, "Amount field is required"),
    z.object({
      debit: z.string().min(1),
      credit: z.string().min(1),
    }),
  ]),
});

export default function AddAccount() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      institution: "",
      accounttype: "Bank Account",
      starting_balance: 0.0,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    console.log(fieldMapping);

    console.log("data_headers: ", data_headers_ref.current);

    // try {
    //   const validatedMapping = fieldMappingSchema.parse(fieldMapping);
    //   console.log("✅ Form Values", values);
    //   console.log("✅ Valid Field Mapping", validatedMapping);
    // } catch (error) {
    //   if (error instanceof z.ZodError) {
    //     // You could show toast or log specific errors
    //     alert("❌ Field mapping is invalid: " + error.errors.map((e) => e.message).join(", "));
    //   } else {
    //     console.error("Unexpected error validating fieldMapping:", error);
    //   }
    // }
  }

  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<CSVRow[]>([]);
  const [hasHeader, setHasHeader] = useState(false);
  const [fieldMapping, setFieldMapping] = useState<AmountMapping>({});

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

  const handleFieldMappingChange = (field: RequiredField, column: string) => {
    setFieldMapping((prev) => {
      // Start with previous mapping
      const updated = { ...prev };

      // Remove this column from any other field
      (Object.keys(updated) as RequiredField[]).forEach((key) => {
        if (updated[key] === column && key !== field) {
          delete updated[key];
        }
      });

      // Update the selected field with the new column
      updated[field] = column;

      data_headers_ref.current[column] = field;
      // console.log("hi");

      return updated;
    });
  };

  const REQUIRED_FIELDS: { label: string; value: RequiredField }[] = [
    { value: "date", label: "Transaction Date" },
    { value: "description", label: "Transaction Description" },
    { value: "amount", label: "Transaction Amount" },
  ];

  // const data_headers: CSVRow = {};

  const data_headers_ref = useRef<CSVRow>({});

  return (
    <div className="w-full max-w-8xl mx-auto px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="min-w-lg max-w-lg p-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <FormLabel className="w-32 text-right">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
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
                <FormItem className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <FormLabel className="w-32 text-right">Account Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bank Account">Bank Account</SelectItem>
                          <SelectItem value="Savings Account">Savings Account</SelectItem>
                          <SelectItem value="Credit Card">Credit Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </div>
                  <FormMessage className="ml-32" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <FormLabel className="w-32 text-right">Institution</FormLabel>
                    <FormControl>
                      <Input placeholder="Megabux Bank" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage className="ml-32" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="starting_balance"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <FormLabel className="w-32 text-right">Starting Balance</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="ml-32" />
                </FormItem>
              )}
            />
          </Card>
          <Button type="submit">Submit</Button>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label htmlFor="csv-upload">
                  <Button type="button" asChild>
                    <span>Upload CSV</span>
                  </Button>
                </label>
                <input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
              </div>
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
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {hasHeader && !Array.isArray(data[0])
                            ? Object.keys(data[0]).map((key) => {
                                return (
                                  <TableHead key={key}>
                                    <Select
                                      onValueChange={(value) => handleFieldMappingChange(value as RequiredField, key)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Req Field"></SelectValue>
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {REQUIRED_FIELDS.map(({ value, label }) => (
                                            <SelectItem key={value} value={value}>
                                              {label}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                    <span>{key}</span>
                                  </TableHead>
                                );
                              })
                            : Array.isArray(data[0]) &&
                              data[0]?.map((_, index) => {
                                return (
                                  <TableHead key={index}>
                                    <Select
                                      onValueChange={(value) =>
                                        handleFieldMappingChange(value as RequiredField, `Field ${index + 1}`)
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Req Field"></SelectValue>
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {REQUIRED_FIELDS.map(({ value, label }) => (
                                            <SelectItem key={value} value={value}>
                                              {label}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                    <span>{`Field ${index + 1}`}</span>
                                  </TableHead>
                                );
                              })}
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {data.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
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
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
