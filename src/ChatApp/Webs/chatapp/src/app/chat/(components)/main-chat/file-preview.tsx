import { memo } from "react";
import { FileItem } from "./file-item";

interface FilePreviewProps {
  images: File[];
  videos: File[];
  onRemove: (type: "images" | "videos", index: number) => void;
}

export const FilePreview = memo(
  ({ images, videos, onRemove }: FilePreviewProps) => {
    if (images.length === 0 && videos.length === 0) return null;

    return (
      <div className="p-2 border-b-3">
        <div className="grid grid-cols-4 gap-2">
          {images.map((file, index) => (
            <FileItem
              key={`img-${file.name}-${index}`}
              file={file}
              index={index}
              type="images"
              onRemove={onRemove}
            />
          ))}
          {videos.map((file, index) => (
            <FileItem
              key={`vid-${file.name}-${index}`}
              file={file}
              index={index}
              type="videos"
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>
    );
  }
);

FilePreview.displayName = "FilePreview";
