import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { videoUrl, startTime, endTime } = await req.json();

    if (!videoUrl || startTime === undefined || endTime === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const urlParts = videoUrl.split("/");
    const uploadIndex = urlParts.indexOf("upload");
    const publicIdWithExt = urlParts.slice(uploadIndex + 2).join("/");
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");

    const trimmedUrl = cloudinary.url(publicId, {
      resource_type: "video",
      transformation: [
        {
          start_offset: startTime,
          end_offset: endTime,
        },
      ],
      format: "mp4",
    });

    return NextResponse.json({ 
      success: true, 
      clipUrl: trimmedUrl 
    });

  } catch (error) {
    console.error("Clip error:", error);
    return NextResponse.json({ error: "Clip failed" }, { status: 500 });
  }
}