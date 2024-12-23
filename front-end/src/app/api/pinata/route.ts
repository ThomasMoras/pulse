// app/api/pinata/route.ts
import { NextRequest, NextResponse } from "next/server";
import PinataClient from "@pinata/sdk";
import { Readable } from "stream";

// const getPinataClient = () => {
//   // Logs pour vérifier les variables d'environnement
//   console.log("Checking Pinata env vars:", {
//     hasApiKey: Boolean(process.env.PINATA_API_KEY),
//     hasSecretKey: Boolean(process.env.PINATA_SECRET_KEY),
//   });

//   if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_KEY) {
//     throw new Error("Pinata credentials are not configured");
//   }

//   return new PinataClient({
//     pinataApiKey: process.env.PINATA_API_KEY,
//     pinataSecretApiKey: process.env.PINATA_SECRET_KEY,
//   });
// };

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

// export async function POST(request: NextRequest) {
//   try {
//     console.log("Starting file upload process");

//     const formData = await request.formData();
//     const files = formData.getAll("files");
//     const metadata = JSON.parse(formData.get("metadata") as string);

//     console.log("Received files:", files.length);
//     console.log("Metadata:", metadata);

//     const pinata = getPinataClient();

//     const uploadPromises = files.map(async (file) => {
//       const fileAsFile = file as File;
//       const arrayBuffer = await fileAsFile.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);
//       const stream = bufferToStream(buffer);

//       const result = await pinata.pinFileToIPFS(stream, {
//         pinataMetadata: {
//           name: fileAsFile.name,
//           ...metadata,
//         },
//       });

//       return {
//         originalName: fileAsFile.name,
//         ipfsHash: result.IpfsHash,
//         gateway_url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
//       };
//     });
//     // const uploadPromises = files.map(async (file) => {
//     //   const fileAsFile = file as File;
//     //   console.log("Processing file:", fileAsFile.name);

//     //   try {
//     //     const fileBuffer = Buffer.from(await fileAsFile.arrayBuffer());
//     //     console.log("File converted to buffer");

//     //     const result = await pinata.pinFileToIPFS(fileBuffer, {
//     //       pinataMetadata: {
//     //         name: fileAsFile.name,
//     //         ...metadata,
//     //       },
//     //     });

//     //     console.log("File uploaded to IPFS:", result.IpfsHash);

//     //     return {
//     //       originalName: fileAsFile.name,
//     //       ipfsHash: result.IpfsHash,
//     //       gateway_url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
//     //     };
//     //   } catch (uploadError) {
//     //     console.error("Error uploading individual file:", uploadError);
//     //     throw uploadError;
//     //   }
//     // });

//     const results = await Promise.all(uploadPromises);
//     console.log("All files processed successfully");

//     return NextResponse.json({
//       data: results,
//     });
//   } catch (error) {
//     // Log détaillé de l'erreur
//     console.error("Upload error details:", {
//       message: error.message,
//       stack: error.stack,
//       name: error.name,
//     });

//     return NextResponse.json(
//       {
//         error: "Upload failed",
//         details: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }
