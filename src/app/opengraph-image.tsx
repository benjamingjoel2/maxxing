import { ImageResponse } from "next/og";
import { destinations } from "@/data/destinations";

export const alt = "Maxxing — Culture oriented trips";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #f7f2e9 0%, #efe7d9 100%)",
          color: "#1c1917",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 44, fontWeight: 700 }}>Maxxing</div>
          <div style={{ fontSize: 20, letterSpacing: 4, textTransform: "uppercase", color: "#c2552b" }}>
            Culture oriented trips
          </div>
        </div>
        <div style={{ fontSize: 76, lineHeight: 1.05, fontWeight: 700, maxWidth: 960 }}>
          Travel for what a place makes, plays, cooks and remembers.
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {destinations.map((d) => (
            <div
              key={d.slug}
              style={{
                display: "flex",
                padding: "8px 18px",
                borderRadius: 999,
                fontSize: 22,
                color: "white",
                background: `linear-gradient(135deg, ${d.palette[0]}, ${d.palette[1]})`,
              }}
            >
              {d.name}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
