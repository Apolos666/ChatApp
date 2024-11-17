import { useState } from "react";
import { User } from "@/types/user";
import { httpPostPrivate, httpDelPrivate } from "@/services/user.service.api/_req";

export function useUserForm(user: User, onSave?: (user: User) => void) {
    const [formData, setFormData] = useState<Partial<User>>({...user});

    const handleAvatarUpload = async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        try {
            await httpPostPrivate(`/user/avatar`, formData)
            if (onSave) {
                await onSave({ ...user } as User);
            }
        } catch (error) {
            console.error("Error uploading avatar:", error)
        }
    }

    const handleAvatarRemove = async () => {
        try {
            await httpDelPrivate(`/user/avatar`)
            if (onSave) {
                await onSave({ ...user } as User);
            }
        } catch (error) {
            console.error("Error removing avatar:", error)
        }
    }

    const handleChange = (field: keyof User, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent, data: Partial<User>) => {
        e.preventDefault(); 
        if (onSave) {
            await onSave({ ...user, ...data } as User);
        }
    };

    const checkFormChanged = (newFormData: Partial<User>) => {
        return Object.keys(newFormData).some((key) => {
            const field = key as keyof User;
            return newFormData[field] !== user?.[field];
        });
    };

    const isFormChanged = checkFormChanged(formData);

    return { formData, isFormChanged, handleChange, handleSubmit, handleAvatarUpload, handleAvatarRemove };
} 