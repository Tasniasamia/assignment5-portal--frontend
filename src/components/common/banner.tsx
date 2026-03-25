import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

interface PageBannerProps {
  title: string;
  breadcrumb?: string;
}

export default function PageBanner({ title, breadcrumb }: PageBannerProps) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "120px 24px 60px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid #e8e3da",
      }}
    >
      {/* Background decoration circles */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          backgroundColor: "rgba(26,61,43,0.04)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "-40px",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          backgroundColor: "rgba(224,123,57,0.05)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative" }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            color: "#1a1a18",
            marginBottom: "16px",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>

        {/* Breadcrumb */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#f8f4ed",
            border: "1px solid #e8e3da",
            borderRadius: "9999px",
            padding: "6px 16px",
          }}
        >
          <Link
            href="/"

            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#4a4a42",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <Home style={{ width: "13px", height: "13px" }} />
            Home
          </Link>
          <ChevronRight style={{ width: "13px", height: "13px", color: "#8a8a7a" }} />
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: "#1a3d2b",
            }}
          >
            {breadcrumb || title}
          </span>
        </div>
      </div>
    </div>
  );
}