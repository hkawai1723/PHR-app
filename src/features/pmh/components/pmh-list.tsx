"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetPMHList } from "@/features/pmh/api/use-get-pmh-list";
import { LoaderCircle } from "lucide-react";
import { PMHTableRow } from "./pmh-table-row";
import { PMHFormDialog } from "./pmh-form-dialog";

export const PMHList = () => {
  const { data: PMHList, isLoading } = useGetPMHList();

  // ローディング状態
  if (isLoading) {
    return (
      <div className="mt-4  rounded-2xl p-2">
        <LoaderCircle className="animate-spin mx-auto my-4" />
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mt-4 border-2 rounded-2xl p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Disease</TableHead>
            <TableHead className="text-center hidden lg:table-cell">
              Diagnosis Date
            </TableHead>
            <TableHead className="text-center hidden lg:table-cell">
              Primary Care Provider
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="text-center">
          {/* !!!CAUTION!!! 楽観的更新時などでidが存在しないときはランダムな値を割り振っています。詳細はuse-create-pmh.ts参照 */}
          {PMHList?.length ? (
            PMHList.map((record) => {
              return (
                <PMHTableRow
                  record={record}
                  key={record.id ? record.id : Math.random()}
                />
              );
            })
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3}>
                <PMHFormDialog
                  variant="outline"
                  className="w-full h-12 border-none shadow-none"
                >
                  Record medical history
                </PMHFormDialog>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
