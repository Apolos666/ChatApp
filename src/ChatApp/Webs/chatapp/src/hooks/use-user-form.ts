import { useState } from "react";
import { User } from "@/types/user";

export function useUserForm(user: User, onSave?: (user: User) => void) {
    const [formData, setFormData] = useState<Partial<User>>({...user});

    const handleChange = (field: keyof User, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSave) {
            onSave({ ...user, ...formData } as User);
        }
    };

    const checkFormChanged = (newFormData: Partial<User>) => {
        return Object.keys(newFormData).some((key) => {
            const field = key as keyof User;
            return newFormData[field] !== user?.[field];
        });
    };

    const isFormChanged = checkFormChanged(formData);

    return { formData, isFormChanged, handleChange, handleSubmit };
} 