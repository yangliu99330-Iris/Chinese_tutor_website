import { ImageResponse } from "next/og";

export const alt = "Chinese Tutor Yang — online Mandarin and Chinese dance lessons";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Latin text only: the default OG font has no CJK glyphs.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #B668BD 0%, #C65C5C 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 6, textTransform: "uppercase", opacity: 0.85 }}>
          Online lessons with Miss Yang
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 24, lineHeight: 1.05 }}>Chinese Tutor Yang</div>
        <div style={{ fontSize: 40, marginTop: 28, opacity: 0.95 }}>Mandarin Chinese &amp; Chinese Dance Lessons</div>
        <div style={{ fontSize: 28, marginTop: 56, opacity: 0.85 }}>www.chinesetutoryang.com</div>
      </div>
    ),
    size
  );
}
