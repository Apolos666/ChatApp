import { format } from "date-fns";
import { User } from "@/types/user";

interface ViewFieldsProps {
    user: User;
}

export function ViewFields({ user }: ViewFieldsProps) {
    const renderField = (label: string, value: string) => (
        <div className="space-y-2">
            <label className="text-sm text-gray-500">{label}</label>
            <div>{value}</div>
        </div>
    );

    return (
        <>
            <div className="grid grid-cols-2 gap-6">
                {renderField("Role", user.role)}
                {renderField("Status", user.status)}
            </div>

            <div className="grid grid-cols-2 gap-6">
                {renderField("Gender", user.gender)}
                {renderField(
                    "Date of Birth",
                    format(new Date(user.dob), "dd MMMM yyyy")
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {renderField("Email", user.email)}
                {renderField("Phone Number", user.phone_number)}
            </div>

            {renderField("Address", user.address)}

            {renderField(
                "Joined At",
                format(new Date(user.created_at), "dd MMMM yyyy")
            )}
        </>
    );
} 