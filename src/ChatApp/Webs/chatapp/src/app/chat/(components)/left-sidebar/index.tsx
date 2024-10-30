import { SearchBar } from "./search-bar";
import { FilterTabs } from "./filter-tabs";
import { ConversationCard } from "./conversation-card";
import type { Conversation } from "../types";

const conversations: Conversation[] = [
  // ... copy data từ file gốc
];

export const LeftSidebar = () => {
  return (
    <div className="sticky top-0 h-svh border-r-3">
      <SearchBar />
      <FilterTabs />
      <div className="overflow-y-auto h-[calc(100vh-120px)] custom-scrollbar p-3 space-y-2">
        {conversations.map((conversation) => (
          <ConversationCard key={conversation.id} conversation={conversation} />
        ))}
      </div>
    </div>
  );
};
