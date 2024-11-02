import { memo } from "react";
import { Button } from "@/components/ui/button";
import { FileVideo, ImagePlus } from "lucide-react";

interface FileControlsProps {
  onImageSelect: () => void;
  onVideoSelect: () => void;
  imageInputRef: React.RefObject<HTMLInputElement>;
  videoInputRef: React.RefObject<HTMLInputElement>;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileControls = memo(
  ({ onImageSelect, onVideoSelect, ...props }: FileControlsProps) => {
    return (
      <div className="flex space-x-2 mb-2 border-b-3 p-2">
        <input
          type="file"
          ref={props.imageInputRef}
          className="hidden"
          multiple
          accept="image/*"
          onChange={props.onImageChange}
        />
        <input
          type="file"
          ref={props.videoInputRef}
          className="hidden"
          multiple
          accept="video/*"
          onChange={props.onVideoChange}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12"
          onClick={onImageSelect}
        >
          <ImagePlus className="!w-5 !h-5" size={28} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12"
          onClick={onVideoSelect}
        >
          <FileVideo className="!w-5 !h-5" size={28} />
        </Button>
      </div>
    );
  }
);

FileControls.displayName = "FileControls";
