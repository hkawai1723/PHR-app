import { PMHList } from "@/features/pmh/components/pmh-list";
import { PMHFormDialog } from "@/features/pmh/components/pmh-form-dialog";
import { Plus } from "lucide-react";

export const PMHScreen = () => {
  return (
    <div className="flex justify-center items-center h-scree">
      <div className="w-full m-8 p-8 md:w-[890px] bg-white">
        <div className="flex flex-row-reverse">
          <PMHFormDialog>
            <Plus />
          </PMHFormDialog>
        </div>
        <PMHList />
      </div>
    </div>
  );
};
