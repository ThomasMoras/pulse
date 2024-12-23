"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DropZone } from "./ImageUploader/DropZone";
import { ImagePreview } from "./ImageUploader/ImagePreview";

interface ImageCropUploaderProps {
  aspectRatio?: number;
  maxSize?: number;
  minWidth?: number;
  minHeight?: number;
  existingImages?: string[]; // URLs des images IPFS existantes
  onImageCropped?: (files: File[]) => void;
}

const ImageCropUploader: React.FC<ImageCropUploaderProps> = ({
  maxSize = 5,
  existingImages = [],
  onImageCropped,
}) => {
  const [images, setImages] = useState<string[]>(existingImages);
  const [files, setFiles] = useState<File[]>([]);

  // Créer une fonction mémorisée pour notifier les changements
  const notifyChanges = useCallback(
    (newFiles: File[]) => {
      // Utiliser setTimeout pour éviter la mise à jour pendant le rendu
      setTimeout(() => {
        onImageCropped?.(newFiles);
      }, 0);
    },
    [onImageCropped]
  );

  const processFile = useCallback(
    (file: File) => {
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
        const result = e.target?.result as string;
        if (result) {
          setImages((prevImages) => [...prevImages, result]);
          setFiles((prevFiles) => {
            const newFiles = [...prevFiles, file];
            notifyChanges(newFiles);
            return newFiles;
          });
        }
      };
      reader.readAsDataURL(file);
    },
    [maxSize, notifyChanges]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = event.target.files;
      if (!newFiles) return;

      if (images.length + newFiles.length > 5) {
        alert("Vous ne pouvez télécharger que 5 images.");
        return;
      }

      Array.from(newFiles).forEach(processFile);
    },
    [images.length, processFile]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const droppedFiles = event.dataTransfer.files;

      if (images.length + droppedFiles.length > 5) {
        alert("Vous ne pouvez télécharger que 5 images.");
        return;
      }

      Array.from(droppedFiles).forEach(processFile);
    },
    [images.length, processFile]
  );

  // const handleDeleteImage = useCallback(
  //   (index: number) => {
  //     setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  //     setFiles((prevFiles) => {
  //       const newFiles = prevFiles.filter((_, i) => i !== index);
  //       notifyChanges(newFiles);
  //       return newFiles;
  //     });
  //   },
  //   [notifyChanges]
  // );
  const handleDeleteImage = (index: number) => {
    const isExistingImage = index < existingImages.length;

    setImages((prevImages) => {
      const newImages = prevImages.filter((_, i) => i !== index);
      return newImages;
    });

    if (!isExistingImage) {
      setFiles((prevFiles) => {
        const newFiles = prevFiles.filter((_, i) => i !== index - existingImages.length);
        onImageCropped?.(newFiles);
        return newFiles;
      });
    }
  };

  return (
    <Card className="w-full max-w-xl">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.length < 5 && <DropZone onDrop={handleDrop} onChange={handleFileChange} />}

          {images.map((image, index) => (
            <ImagePreview key={index} image={image} index={index} onDelete={handleDeleteImage} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCropUploader;
