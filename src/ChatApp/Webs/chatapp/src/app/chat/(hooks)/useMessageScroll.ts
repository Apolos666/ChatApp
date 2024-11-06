import { useCallback, useRef, useState } from 'react';
import { debounce } from 'lodash';

interface UseMessageScrollProps {
  onLoadMore: () => Promise<any>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function useMessageScroll({ 
  onLoadMore, 
  hasNextPage, 
  isFetchingNextPage 
}: UseMessageScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const canFetchMoreRef = useRef(true);

  const scrollToBottom = useCallback((smooth = false) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      setShouldScrollToBottom(true);
    }
  }, []);

  const debouncedScrollToBottom = useCallback(
    debounce(scrollToBottom, 300),
    []
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Kiểm tra có ở gần bottom không
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
    setShouldScrollToBottom(isNearBottom);

    // Hiển thị nút scroll to bottom
    const scrollThreshold = 500;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > scrollThreshold);

    // Xử lý load more
    const isNearTop = scrollTop < 100;
    if (
      isNearTop && 
      hasNextPage && 
      !isFetchingNextPage && 
      canFetchMoreRef.current
    ) {
      canFetchMoreRef.current = false;
      
      const previousScrollHeight = scrollHeight;
      const previousScrollTop = scrollTop;

      onLoadMore().finally(() => {
        requestAnimationFrame(() => {
          if (scrollContainerRef.current) {
            const newScrollHeight = scrollContainerRef.current.scrollHeight;
            const heightDifference = newScrollHeight - previousScrollHeight;
            scrollContainerRef.current.scrollTop = previousScrollTop + heightDifference;
          }
          setTimeout(() => {
            canFetchMoreRef.current = true;
          }, 500);
        });
      });
    }
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  return {
    scrollContainerRef,
    shouldScrollToBottom,
    showScrollButton,
    scrollToBottom,
    debouncedScrollToBottom,
    handleScroll
  };
}