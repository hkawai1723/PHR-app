"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetFamilyHistoryList } from "@/features/family-history/api/use-get-family-history-list";
import { LoaderCircle } from "lucide-react";
import { FamilyHistoryTableRow } from "./family-history-table-row";
import { FamilyHistoryFormDialog } from "./family-history-form-dialog";

export const FamilyHistoryList = () => {
  const { data: FamilyHistoryList, isLoading } = useGetFamilyHistoryList();

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
            <TableHead className="text-center">
              Relationship
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="text-center">
          {/* !!!CAUTION!!! 楽観的更新時などでidが存在しないときはランダムな値を割り振っています。詳細はuse-create-family-history.ts参照 */}
          {FamilyHistoryList?.length ? (
            FamilyHistoryList.map((record) => {
              return (
                <FamilyHistoryTableRow
                  record={record}
                  key={record.id ? record.id : Math.random()}
                />
              );
            })
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={2}>
                <FamilyHistoryFormDialog
                  variant="outline"
                  className="w-full h-12 border-none shadow-none"
                >
                  Record family history
                </FamilyHistoryFormDialog>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
