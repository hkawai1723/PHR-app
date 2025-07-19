import React from 'react';
import { FamilyHistoryFormDialog } from './family-history-form-dialog';
import { FamilyHistoryList } from './family-history-list';
import { Plus } from 'lucide-react';

export const PMHScreen = () => {
  return (
    <div className="flex justify-center items-center h-scree">
      <div className="w-full m-8 p-8 md:w-[890px] bg-white">
        <div className="flex flex-row-reverse">
          <FamilyHistoryFormDialog>
            <Plus />
          </FamilyHistoryFormDialog>
        </div>
        <FamilyHistoryList />
      </div>
    </div>
  );
};
