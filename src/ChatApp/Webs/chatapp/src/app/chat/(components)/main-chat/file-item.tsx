import { memo } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface FileItemProps {
  file: File;
  index: number;
  type: "images" | "videos";
  onRemove: (type: "images" | "videos", index: number) => void;
}

export const FileItem = memo(
  ({ file, index, type, onRemove }: FileItemProps) => {
    if (type === "images") {
      return (
        <div className="relative group">
          <Image
            src={URL.createObjectURL(file)}
            alt={file.name}
            width={200}
            height={200}
            className="w-full h-24 object-cover rounded"
          />
          <button
            onClick={() => onRemove(type, index)}
            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 
            opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      );
    }

    return (
      <div className="relative group">
        <video
          src={URL.createObjectURL(file)}
          className="w-full h-24 object-cover rounded"
        />
        <button
          onClick={() => onRemove(type, index)}
          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 
          opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    );
  }
);

FileItem.displayName = "FileItem";
