import React, { useState, useRef, useCallback } from "react";
import { UploadCloud, Crop, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageCropUploaderProps {
  aspectRatio?: number;
  maxSize?: number;
  minWidth?: number;
  minHeight?: number;
  onImageCropped?: (croppedImage: File) => void;
}

const ImageCropUploader: React.FC<ImageCropUploaderProps> = ({
  maxSize = 5,
  minWidth = 100,
  minHeight = 100,
  onImageCropped,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null
  );
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cropperRef = useRef<HTMLDivElement>(null);

  const [cropArea, setCropArea] = useState({
    x: 0,
    y: 0,
    width: 300,
    height: 300,
  });
  const [currentAction, setCurrentAction] = useState<"move" | "resize" | null>(
    null
  );
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (images.length >= 5) {
        alert("Vous ne pouvez télécharger que 5 images.");
        return;
      }

      Array.from(files).forEach((file) => {
        if (file.size > maxSize * 1024 * 1024) {
          alert(`La taille du fichier dépasse ${maxSize} Mo`);
          return;
        }

        if (!file.type.startsWith("image/")) {
          alert("Veuillez sélectionner une image valide");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          setImages((prevImages) => [
            ...prevImages,
            e.target?.result as string,
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      if (images.length + files.length > 5) {
        alert("Vous ne pouvez télécharger que 5 images.");
        return;
      }

      Array.from(files).forEach((file) => {
        if (file.size > maxSize * 1024 * 1024) {
          alert(`La taille du fichier dépasse ${maxSize} Mo`);
          return;
        }

        if (!file.type.startsWith("image/")) {
          alert("Veuillez sélectionner une image valide");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          setImages((prevImages) => [
            ...prevImages,
            e.target?.result as string,
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleMouseDown = (
    e: React.MouseEvent,
    action: "move" | "resize",
    direction?: string
  ) => {
    if (!cropperRef.current || !imageRef.current) return;

    const rect = cropperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPos({ x, y });
    setCurrentAction(action);
    setResizeDirection(direction || null);

    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cropperRef.current || !imageRef.current) return;

    const rect = cropperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentAction === "move") {
      const newX = cropArea.x + (x - startPos.x);
      const newY = cropArea.y + (y - startPos.y);

      const maxX = rect.width - cropArea.width;
      const maxY = rect.height - cropArea.height;

      setCropArea((prev) => ({
        ...prev,
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      }));
    } else if (currentAction === "resize" && resizeDirection) {
      const dx = x - startPos.x;
      const dy = y - startPos.y;

      let newWidth = cropArea.width;
      let newHeight = cropArea.height;
      let newX = cropArea.x;
      let newY = cropArea.y;

      switch (resizeDirection) {
        case "top-left":
          newWidth = Math.max(minWidth, cropArea.width - dx);
          newHeight = Math.max(minHeight, cropArea.height - dy);
          newX = cropArea.x + (cropArea.width - newWidth);
          newY = cropArea.y + (cropArea.height - newHeight);
          break;
        case "top-right":
          newWidth = Math.max(minWidth, cropArea.width + dx);
          newHeight = Math.max(minHeight, cropArea.height - dy);
          newY = cropArea.y + (cropArea.height - newHeight);
          break;
        case "bottom-left":
          newWidth = Math.max(minWidth, cropArea.width - dx);
          newHeight = Math.max(minHeight, cropArea.height + dy);
          newX = cropArea.x + (cropArea.width - newWidth);
          break;
        case "bottom-right":
          newWidth = Math.max(minWidth, cropArea.width + dx);
          newHeight = Math.max(minHeight, cropArea.height + dy);
          break;
      }

      const maxWidth = rect.width - newX;
      const maxHeight = rect.height - newY;

      setCropArea((prev) => ({
        ...prev,
        width: Math.min(newWidth, maxWidth),
        height: Math.min(newHeight, maxHeight),
        x: Math.max(0, Math.min(newX, rect.width - minWidth)),
        y: Math.max(0, Math.min(newY, rect.height - minHeight)),
      }));
    }

    setStartPos({ x, y });
  };

  const handleMouseUp = () => {
    setCurrentAction(null);
    setResizeDirection(null);
  };

  const performCrop = useCallback(() => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    const img = imageRef.current;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    ctx.drawImage(
      img,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], "cropped-image.png", {
          type: "image/png",
        });
        const croppedUrl = URL.createObjectURL(croppedFile);
        setCroppedImage(croppedUrl);
        onImageCropped?.(croppedFile);
      }
    }, "image/png");

    setIsDialogOpen(false);
  }, [cropArea, onImageCropped]);

  const resetImage = () => {
    setOriginalImage(null);
    setCroppedImage(null);
  };

  const handleDeleteImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full max-w-xl">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Zone d'upload avec glisser-déposer */}
          {images.length < 5 && (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="profile-image-upload"
                multiple
              />
              <label
                htmlFor="profile-image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <UploadCloud className="w-10 h-10 text-gray-500 mb-2" />
                <span className="text-sm text-gray-600">
                  Glissez et déposez des images ou sélectionnez-les
                </span>
              </label>
            </div>
          )}

          {/* Prévisualisation des images téléchargées */}
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden"
            >
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteImage(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Dialog de recadrage */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Recadrer l'image</DialogTitle>
            </DialogHeader>

            {originalImage && (
              <div
                ref={cropperRef}
                className="relative w-full h-[500px] overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  ref={imageRef}
                  src={originalImage}
                  alt="Image à recadrer"
                  className="w-full h-full object-contain"
                />

                <div
                  className="absolute border-2 border-white"
                  style={{
                    width: `${cropArea.width}px`,
                    height: `${cropArea.height}px`,
                    left: `${cropArea.x}px`,
                    top: `${cropArea.y}px`,
                    boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
                  }}
                  onMouseDown={(e) => handleMouseDown(e, "move")}
                >
                  {/* Poignées de redimensionnement */}
                  <div
                    className={`${resizeHandleStyle} -top-2 -left-2 cursor-nwse-resize`}
                    onMouseDown={(e) =>
                      handleMouseDown(e, "resize", "top-left")
                    }
                  />
                  <div
                    className={`${resizeHandleStyle} -top-2 -right-2 cursor-nesw-resize`}
                    onMouseDown={(e) =>
                      handleMouseDown(e, "resize", "top-right")
                    }
                  />
                  <div
                    className={`${resizeHandleStyle} -bottom-2 -left-2 cursor-nesw-resize`}
                    onMouseDown={(e) =>
                      handleMouseDown(e, "resize", "bottom-left")
                    }
                  />
                  <div
                    className={`${resizeHandleStyle} -bottom-2 -right-2 cursor-nwse-resize`}
                    onMouseDown={(e) =>
                      handleMouseDown(e, "resize", "bottom-right")
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex justify-center mt-4">
              <Button onClick={performCrop}>
                <Crop className="mr-2 w-4 h-4" /> Recadrer
              </Button>
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ImageCropUploader;
