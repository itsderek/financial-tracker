"use client";

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  configFile: { [key: string]: string | null } | undefined;
  onConfigChange: (key: string, val: string | null) => void;
}

const REQUIRED_FIELDS: { label: string; value: string }[] = [
  { value: "Transaction Date", label: "Transaction Date" },
  { value: "Transaction Description", label: "Transaction Description" },
  { value: "Transaction Amount", label: "Transaction Amount" },
];

export function DataTable<TData, TValue>({ columns, data, configFile, onConfigChange }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    <Select
                      key={configFile?.[header.id] === null ? `clear-${header.id}` : header.id}
                      value={configFile?.[header.id] ?? undefined}
                      onValueChange={(value) => onConfigChange(header.id, value === "clear" ? null : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose req field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {configFile?.[header.id] !== null ? (
                            <SelectItem key="clear" value="clear">
                              Clear
                            </SelectItem>
                          ) : null}
                          {REQUIRED_FIELDS.map((val) => (
                            <SelectItem key={val.value} value={val.value}>
                              {val.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
