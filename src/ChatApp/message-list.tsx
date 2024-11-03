import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

const MessageList: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);
  const [hasNextPage, setHasNextPage] = React.useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = React.useState(false);
  const [queryData, setQueryData] = React.useState({ pages: [] });
  const [allMessages, setAllMessages] = React.useState([]);

  useEffect(() => {
    console.log({
      inView,
      hasNextPage,
      isFetchingNextPage,
      pagesLength: queryData?.pages.length,
      messagesCount: allMessages.length
    });

    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log('🚀 Fetching next page...');
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const fetchNextPage = async () => {
    setIsFetchingNextPage(true);
    // Fetch next page logic here
    setIsFetchingNextPage(false);
  };

  return (
    <div ref={ref} className="h-4 w-full">
      {console.log('Ref element rendered')}
      {isFetchingNextPage && (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default MessageList; 