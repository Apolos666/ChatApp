"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const TokenInput = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = () => {
    // Lưu token và userId vào localStorage
    localStorage.setItem("chat_token", token);
    localStorage.setItem("chat_user_id", userId);
    setIsVisible(false);

    // Chuyển hướng đến trang chat
    router.push("/chat");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background p-6 rounded-lg shadow-lg w-[400px] space-y-4 border-2">
        <h2 className="text-xl font-semibold">Nhập thông tin đăng nhập</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="token" className="text-sm font-medium">
              Token
            </label>
            <Input
              id="token"
              type="text"
              placeholder="Nhập token của bạn"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="userId" className="text-sm font-medium">
              User ID
            </label>
            <Input
              id="userId"
              type="number"
              placeholder="Nhập User ID của bạn"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!token.trim() || !userId.trim()}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
};
