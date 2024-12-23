import { UploadCloud } from "lucide-react";

interface DropZoneProps {
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onDrop, onChange }) => {
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer"
      onDragOver={handleDragOver}
      onDrop={onDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
        id="profile-image-upload"
        multiple
      />
      <label htmlFor="profile-image-upload" className="cursor-pointer flex flex-col items-center">
        <UploadCloud className="w-10 h-10 text-gray-500 mb-2" />
        <span className="text-sm text-gray-600">
          Glissez et déposez des images ou sélectionnez-les
        </span>
      </label>
    </div>
  );
};
