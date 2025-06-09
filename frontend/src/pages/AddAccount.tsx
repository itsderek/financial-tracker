"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
