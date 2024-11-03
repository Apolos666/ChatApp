import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useUserForm } from "@/hooks/use-user-form";
import { User } from "@/types/user";
import { FormFields } from "./form-fields";
interface UserEditFormProps {
    user: User;
    onSave?: (user: User) => void;
    onCancel: () => void;
}

export function UserEditForm({ user, onSave, onCancel }: UserEditFormProps) {
    const { formData, isFormChanged, handleChange, handleSubmit } = useUserForm(user, onSave);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormFields formData={formData} onChange={handleChange} />
            
            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={!isFormChanged}
                    className="flex items-center gap-2"
                >
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </div>
        </form>
    );
} 