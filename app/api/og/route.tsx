/* app/api/og/route.tsx */
import { ImageResponse } from "next/og";

export const runtime = "edge";

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
    { width: 1200, height: 630 }
  );
}