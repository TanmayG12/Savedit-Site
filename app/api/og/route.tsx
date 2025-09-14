/* app/api/og/route.tsx */
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SavedIt";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function GET() {
  const { width, height } = size;

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg,#ffffff,#f6f6f6)",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
            borderRadius: 28,
            border: "1px solid #e5e5e5",
            padding: "28px 36px",
            background: "rgba(255,255,255,0.85)",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              background: "#0a0a0a",
              color: "white",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: -0.5,
            }}
          >
            S
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                letterSpacing: -1.2,
                color: "#0a0a0a",
                lineHeight: 1.05,
              }}
            >
              One place for all your saves.
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 28,
                color: "#6b7280",
              }}
            >
              Save from any app. Organize with tags & collections.
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}