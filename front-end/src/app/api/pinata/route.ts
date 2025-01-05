import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");
    const metadata = JSON.parse(formData.get("metadata") as string);

    const uploadPromises = files.map(async (file) => {
      const fileAsFile = file as File;
      const newFormData = new FormData();
      newFormData.append("file", fileAsFile);

      // S'assurer que toutes les valeurs sont des strings
      const pinataMetadata = {
        name: metadata.name,
        keyvalues: Object.entries(metadata.keyvalues).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: String(value), // Conversion explicite en string
          }),
          {}
        ),
      };

      newFormData.append("pinataMetadata", JSON.stringify(pinataMetadata));

      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          "pinata_api_key": process.env.PINATA_API_KEY!,
          "pinata_secret_api_key": process.env.PINATA_SECRET_KEY!,
        },
        body: newFormData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload to Pinata: ${await response.text()}`);
      }

      const result = await response.json();

      return {
        originalName: fileAsFile.name,
        ipfsHash: result.IpfsHash,
        gateway_url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      };
    });

    const results = await Promise.all(uploadPromises);

    return NextResponse.json({
      data: results,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
