import * as React from "react";
import {
  Search,
  Users,
  Video,
  ImagePlus,
  ChevronDown,
  LogOut,
  Send,
  Users2,
  CircleUserRound,
  UserRoundPlus,
  MessageCircleMore,
  FileVideo,
  Pin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarGroup,
  SidebarSeparator,
  SidebarRail,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const conversations = [
  {
    id: 1,
    name: "The family is to Love",
    lastMessage: "Jonas: Hello, something ...",
    unread: true,
    avatar: "/avatars/group1.jpg",
    selected: true,
  },
  {
    id: 2,
    name: "Nhóm lập trình Android",
    lastMessage: "Trần Hoàng: Chào anh",
    unread: false,
  },
  {
    id: 3,
    name: "Nhóm lập trình iOS",
    lastMessage: "Lê Văn: Xin chào",
    unread: false,
  },
  {
    id: 4,
    name: "Nhóm lập trình Web",
    lastMessage: "Nguyễn Thị: Có ai online không?",
    unread: false,
  },
  {
    id: 5,
    name: "Nhóm DevOps",
    lastMessage: "Phạm Văn: Cập nhật mới",
    unread: false,
  },
  {
    id: 5,
    name: "Nhóm DevOps",
    lastMessage: "Phạm Văn: Cập nhật mới",
    unread: false,
  },
  {
    id: 5,
    name: "Nhóm DevOps",
    lastMessage: "Phạm Văn: Cập nhật mới",
    unread: false,
  },
  {
    id: 5,
    name: "Nhóm DevOps",
    lastMessage: "Phạm Văn: Cập nhật mới",
    unread: false,
  },
  {
    id: 5,
    name: "Nhóm DevOps",
    lastMessage: "Phạm Văn: Cập nhật mới",
    unread: false,
  },
  {
    id: 5,
    name: "Nhóm DevOps",
    lastMessage: "Phạm Văn: Cập nhật mới",
    unread: false,
  },
  {
    id: 5,
    name: "Nhóm DevOps",
    lastMessage: "Phạm Văn: Cập nhật mới",
    unread: false,
  },
  {
    id: 5,
    name: "Nhóm DevOps",
    lastMessage: "Phạm Văn: Cập nhật mới",
    unread: false,
  },
  {
    id: 5,
    name: "Nhóm DevOps",
    lastMessage: "Phạm Văn: Cập nhật mới",
    unread: false,
  },
  {
    id: 5,
    name: "Nhóm DevOps",
    lastMessage: "Phạm Văn: Cập nhật mới",
    unread: false,
  },
  {
    id: 5,
    name: "Nhóm DevOps",
    lastMessage: "Phạm Văn: Cập nhật mới",
    unread: false,
  },
];

const messages = [
  { id: 1, sender: "Jonas", content: "Hello, something ...", time: "21:00" },
  { id: 2, sender: "Toàn", content: "That's good idea", time: "21:05" },
  { id: 3, sender: "Jonas", content: "Hello, something ...", time: "21:10" },
  { id: 3, sender: "Jonas", content: "Hello, something ...", time: "21:10" },
  { id: 3, sender: "Jonas", content: "Hello, something ...", time: "21:10" },
  { id: 3, sender: "Jonas", content: "Hello, something ...", time: "21:10" },
  { id: 3, sender: "Jonas", content: "Hello, something ...", time: "21:10" },
  { id: 3, sender: "Jonas", content: "Hello, something ...", time: "21:10" },
];

export default function ChatInterface() {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <LeftSidebar />
      <MainChatArea />
      <RightSidebar />
    </SidebarProvider>
  );
}

function LeftSidebar() {
  return (
    <div className="sticky top-0 h-svh border-r-3">
      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              className="text-gray-600 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={24}
            />
            <Input
              placeholder="Tìm kiếm"
              className="pl-12 h-12 text-lg !bg-gray-300 "
            />
          </div>
          <Button variant="ghost" size="icon" className="h-12 w-12">
            <UserRoundPlus className="!h-7 !w-7" />
          </Button>
        </div>
      </div>

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

      <div className="overflow-y-auto h-[calc(100vh-120px)] custom-scrollbar p-3 space-y-2">
        {conversations.map((conv) => (
          <Card
            key={conv.id}
            className={`hover:bg-accent cursor-pointer transition-colors ${
              conv.unread ? "bg-accent/50" : ""
            } ${
              conv.selected
                ? "bg-accent border-primary border-2"
                : "border border-border"
            }`}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{conv.name}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {conv.lastMessage}
                </div>
              </div>
              {conv.unread && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MainChatArea() {
  return (
    <SidebarInset>
      <div className="flex flex-col h-svh">
        <div className="flex-none bg-background p-4 flex justify-between items-center border-b-3">
          <div className="space-y-1">
            <h2 className="font-semibold text-xl">The family is to Love</h2>
            <span className="flex gap-2 items-center">
              <CircleUserRound size={20} />
              <p className="text-muted-foreground">21 thành viên</p>
            </span>
          </div>
          <div className="flex space-x-5 items-center">
            <Button variant="ghost">
              <UserRoundPlus className="!h-7 !w-7" size={28} />
            </Button>
            <Button variant="ghost">
              <Search className="!h-7 !w-7" size={28} />
            </Button>
            <Button variant="ghost">
              <Video className="!h-7 !w-7" size={28} />
            </Button>
            <SidebarTrigger className="rotate-180" />
          </div>
        </div>

        <div className="flex-none bg-muted/30 border-b-3 p-3">
          <div className="flex items-center gap-3">
            <MessageCircleMore className="h-7 w-7 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-muted-foreground">
                  Tin nhắn đã ghim
                </span>
                <span className="text-xs text-muted-foreground">21:00</span>
              </div>
              <p className="text-sm truncate">
                Jonas: Hello, something something something something something
                something
              </p>
            </div>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 messages-scrollbar bg-slate-300">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "Toàn" ? "justify-end" : "justify-start"
              }`}
            >
              <Card
                className={`max-w-xs ${
                  msg.sender === "Toàn"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <CardHeader className="py-1 px-3">
                  <p className="font-semibold">{msg.sender}</p>
                </CardHeader>
                <CardContent className="py-1 px-3">
                  <p>{msg.content}</p>
                </CardContent>
                <CardFooter className="py-1 px-3">
                  <p className="text-xs">{msg.time}</p>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
        <div className="flex-none bg-background border-t-3">
          <div className="flex space-x-2 mb-2 border-b-3 p-2">
            <Button variant="outline" size="icon" className="h-12 w-12">
              <ImagePlus className="!w-5 !h-5" size={28} />
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12">
              <FileVideo className="!w-5 !h-5" size={28} />
            </Button>
          </div>
          <div className="flex items-center space-x-2 p-2">
            <Input
              placeholder="Nhập tin nhắn tới nhóm The family is to Love"
              className="flex-1 h-12 text-base"
            />
            <Button size="icon" className="h-12 w-12">
              <Send size={28} />
            </Button>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}

function RightSidebar() {
  return (
    <Sidebar side="right">
      <SidebarHeader className="border-b-4 p-4 text-center">
        <h2 className="font-semibold text-lg">Thông tin nhóm</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold mb-2 text-base text-typography-heading">
            The family is to Love
          </SidebarGroupLabel>
          <div className="space-y-4">
            <SidebarGroupContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start h-12">
                <Users size={24} className="mr-2" />
                <span>Thêm thành viên</span>
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <Pin size={24} className="mr-2" />
                <span>Ghim hội thoại</span>
              </Button>
            </SidebarGroupContent>
          </div>
        </SidebarGroup>
        <SidebarSeparator className="h-1" />
        <SidebarGroup>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <span className="font-semibold">Thành viên nhóm</span>
              <ChevronDown size={20} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <p className="text-sm text-muted-foreground mt-2">
                21 thành viên
              </p>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
        <SidebarSeparator className="h-1" />
        <SidebarGroup>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <span className="font-semibold">Ảnh/Video</span>
              <ChevronDown size={20} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-muted aspect-square rounded">
                    ?
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full mt-2">
                Xem tất cả
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
        <SidebarSeparator className="h-1" />
        <SidebarGroup>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <span className="font-semibold">Thiết lập bảo mật</span>
              <ChevronDown size={20} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              {/* Thêm các tùy chọn bảo mật ở đây */}
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button variant="destructive" className="w-full h-12">
          <LogOut size={24} className="mr-2" />
          <span>Rời khỏi nhóm</span>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
