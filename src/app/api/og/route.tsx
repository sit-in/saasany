import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Sassany";
  const description =
    searchParams.get("description") ||
    "Build your AI SaaS product in a weekend";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            right: "-200px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-150px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            ⚡
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "white",
              letterSpacing: "-0.5px",
            }}
          >
            Sassany
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: title.length > 40 ? "52px" : "64px",
            fontWeight: "800",
            color: "white",
            margin: "0 0 24px 0",
            lineHeight: "1.1",
            maxWidth: "900px",
            letterSpacing: "-1px",
          }}
        >
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p
            style={{
              fontSize: "26px",
              color: "rgba(255,255,255,0.65)",
              margin: "0",
              maxWidth: "800px",
              lineHeight: "1.4",
            }}
          >
            {description.length > 120
              ? description.slice(0, 120) + "..."
              : description}
          </p>
        )}

        {/* Bottom badge */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "80px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "100px",
            padding: "10px 20px",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.7)",
              fontWeight: "500",
            }}
          >
            sassany.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
