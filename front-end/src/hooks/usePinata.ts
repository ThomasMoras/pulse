interface UploadResult {
  originalName: string;
  ipfsHash: string;
  gateway_url: string;
}

export const usePinata = () => {
  // Upload multiple de fichiers
  const uploadFiles = async (
    files: File[],
    address: string,
    type: string = "gallery_image"
  ): Promise<UploadResult[]> => {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        console.log("Adding file to formData:", file.name);
        formData.append("files", file);
      });

      const metadata = {
        name: `${type}_${Date.now()}`,
        keyvalues: {
          address: address.toString(),
          type: type,
          timestamp: Date.now().toString(),
        },
      };
      formData.append("metadata", JSON.stringify(metadata));

      const response = await fetch("/api/pinata", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Upload failed");
      }

      return (await response.json()).data;
    } catch (error) {
      console.error("Client upload error:", error);
      throw error;
    }
  };

  // Récupérer la liste des fichiers
  const getPinList = async (hash?: string) => {
    try {
      const response = await fetch(`/api/pinata${hash ? `?hash=${hash}` : ""}`);
      if (!response.ok) throw new Error("Failed to get pin list");
      return await response.json();
    } catch (error) {
      console.error("Error fetching pin list:", error);
      throw error;
    }
  };

  // Supprimer un fichier
  const unpin = async (hash: string) => {
    try {
      const response = await fetch(`/api/pinata`, {
        method: "DELETE",
        body: JSON.stringify({ hash }),
      });
      if (!response.ok) throw new Error("Failed to unpin file");
      return await response.json();
    } catch (error) {
      console.error("Error unpinning file:", error);
      throw error;
    }
  };

  return {
    uploadFiles,
    getPinList,
    unpin,
  };
};
