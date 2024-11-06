import { useState, useEffect, useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useMessages } from './useMessages';
import { useMessageScroll } from './useMessageScroll';
import { getLocalStorageItem } from '@/utils/local-storage';
import { PersistedStateKey } from '@/data/persisted-keys';

export function useMessageListManager(roomId: number) {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const reduxMessages = useAppSelector((state) => state.messages.messages);

  const {
    data: queryData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(roomId);

  const {
    scrollContainerRef,
    shouldScrollToBottom,
    showScrollButton,
    scrollToBottom,
    debouncedScrollToBottom,
    handleScroll,
  } = useMessageScroll({
    onLoadMore: fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  });

  // Lấy current user ID
  useEffect(() => {
    const userIdStr = getLocalStorageItem(PersistedStateKey.MeId);
    if (userIdStr) {
      setCurrentUserId(parseInt(userIdStr, 10));
    }
  }, []);

  // Reset state khi đổi room
  useEffect(() => {
    setInitialLoadComplete(false);
    scrollToBottom();
  }, [roomId, scrollToBottom]);

  // Merge và sort messages
  const allMessages = useMemo(() => {
    const queryMessages = queryData?.pages.flatMap((page) => page.messages) ?? [];
    const filteredReduxMessages = reduxMessages.filter(
      (reduxMsg) =>
        reduxMsg.roomId === roomId &&
        !queryMessages.some((queryMsg) => queryMsg.id === reduxMsg.id)
    );
    
    return [...queryMessages, ...filteredReduxMessages]
      .sort((a, b) => a.id - b.id);
  }, [queryData, reduxMessages, roomId]);

  // Auto scroll xuống dưới khi có tin nhắn mới
  useEffect(() => {
    if (shouldScrollToBottom && initialLoadComplete) {
      debouncedScrollToBottom();
    }
  }, [allMessages, shouldScrollToBottom, initialLoadComplete, debouncedScrollToBottom]);

  // Initial scroll và set complete
  useEffect(() => {
    if (queryData?.pages.length === 1 && !initialLoadComplete) {
      setTimeout(() => {
        scrollToBottom();
        setInitialLoadComplete(true);
      }, 100);
    }
  }, [queryData?.pages, initialLoadComplete, scrollToBottom]);

  return {
    currentUserId,
    allMessages,
    isFetchingNextPage,
    showScrollButton,
    scrollContainerRef,
    handleScroll,
    scrollToBottom,
  };
}