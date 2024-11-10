import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User } from "@/types/user";

interface UserHeaderProps {
    user: User;
    isEditMode?: boolean;
    onChange?: (field: keyof User, value: string) => void;
}

export function UserHeader({ user, isEditMode = false, onChange }: UserHeaderProps) {
    return (
        <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar || ""} alt={user.name} className="object-cover" />
                <AvatarFallback>
                    {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </AvatarFallback>
            </Avatar>
            {isEditMode ? (
                <div className="flex-1">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={user.name || ''}
                        onChange={(e) => onChange?.('name', e.target.value)}
                    />
                </div>
            ) : (
                <h2 className="text-xl font-semibold">{user.name}</h2>
            )}
        </div>
    );
} 