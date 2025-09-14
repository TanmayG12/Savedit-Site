/* app/api/og/route.tsx */
import { ImageResponse } from "next/og";
export const runtime = "edge";
export const alt = "SavedIt";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
          color: "black",
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        SavedIt
      </div>
    ),
    { ...size }
  );
}