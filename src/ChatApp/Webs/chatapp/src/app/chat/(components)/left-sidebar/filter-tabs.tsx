import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const FilterTabs = () => {
  return (
    <div className="px-4 pb-4 border-b-3">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-2 gap-2">
          <TabsTrigger
            value="all"
            className="data-[state=active]:border-2 data-[state=active]:border-primary p-2"
          >
            Tất cả
          </TabsTrigger>
          <TabsTrigger
            value="unread"
            className="data-[state=active]:border-2 data-[state=active]:border-primary p-2"
          >
            Chưa đọc
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
