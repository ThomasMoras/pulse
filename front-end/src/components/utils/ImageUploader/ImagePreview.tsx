// components/ImageUploader/ImagePreview.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ImagePreviewProps {
  image: string;
  index: number;
  onDelete: (index: number) => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ image, index, onDelete }) => (
  <div className="relative group rounded-lg overflow-hidden h-40 w-full">
    <Image
      src={image}
      alt={`Image ${index + 1}`}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
      <Button
        variant="destructive"
        size="icon"
        onClick={() => onDelete(index)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  </div>
);
