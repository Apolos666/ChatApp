import { memo } from "react";
import type { TypingIndicator as TypingIndicatorType } from "@/app/chat/(types)/typing";

interface TypingIndicatorProps {
  typingUsers: TypingIndicatorType[];
}

export const TypingIndicator = memo(({ typingUsers }: TypingIndicatorProps) => {
  if (typingUsers.length === 0) return null;

  return (
    <div className="w-full bg-slate-300 px-4">
      <div className="inline-flex rounded-t-xl bg-blue-100 dark:bg-blue-950/50 px-4 py-2">
        <span className="text-base text-blue-600 dark:text-blue-400">
          {typingUsers.length === 1 ? (
            <span className="flex items-center gap-1">
              <span className="font-medium">{typingUsers[0].userName}</span>
              <span className="animate-pulse">đang nhập...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span className="font-medium">{typingUsers.length} người</span>
              <span className="animate-pulse">đang nhập...</span>
            </span>
          )}
        </span>
      </div>
    </div>
  );
});

TypingIndicator.displayName = "TypingIndicator";
