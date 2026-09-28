import { ImageResponse } from "next/og";
import { destinations, getDestination } from "@/data/destinations";
import { INTEREST_LABELS } from "@/lib/types";

export const dynamic = "force-static";
export const alt = "A Maxxing destination guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const destination = getDestination((await params).slug) ?? destinations[0];
  const [a, b] = destination.palette;

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
          background: `linear-gradient(120deg, ${a}, ${b})`,
          color: "white",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 32 }}>Maxxing</div>
          <div style={{ letterSpacing: 4, textTransform: "uppercase", opacity: 0.85 }}>{destination.country}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 132, lineHeight: 0.95, fontWeight: 700 }}>{destination.name}</div>
          <div style={{ fontSize: 34, lineHeight: 1.25, maxWidth: 1000, opacity: 0.95 }}>{destination.tagline}</div>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 22 }}>
          {destination.strengths.slice(0, 4).map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                padding: "8px 18px",
                borderRadius: 999,
                background: "rgba(0,0,0,0.25)",
              }}
            >
              {INTEREST_LABELS[i]}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
