// src/utils/file.utils.ts
import fs from "fs";
import path from "path";

export const validateImageFile = (filePath: string): boolean => {
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const extension = path.extname(filePath).toLowerCase();

  if (!validExtensions.includes(extension)) {
    throw new Error(
      `Extension de fichier non valide. Extensions acceptées: ${validExtensions.join(", ")}`
    );
  }

  if (!fs.existsSync(filePath)) {
    throw new Error("Le fichier n'existe pas");
  }

  return true;
};

export const getFileSize = (filePath: string): number => {
  const stats = fs.statSync(filePath);
  return stats.size;
};
