import Link from "next/link";
import { Search, ArrowRight, Leaf, Zap, Recycle, Car, Droplets, Sprout, Users } from "lucide-react";

const categories = [
  { name: "Energy", icon: Zap },
  { name: "Waste", icon: Recycle },
  { name: "Transportation", icon: Car },
  { name: "Water", icon: Droplets },
  { name: "Agriculture", icon: Sprout },
  { name: "Community", icon: Users },
];

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "#f8f4ed" }}
    >
      {/* Background circles */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          backgroundColor: "rgba(116,198,157,0.12)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          backgroundColor: "rgba(224,123,57,0.08)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          backgroundColor: "rgba(26,61,43,0.04)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl">

          {/* Tag pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(26,61,43,0.08)",
              border: "1px solid rgba(26,61,43,0.15)",
              borderRadius: "9999px",
              padding: "6px 16px",
              marginBottom: "24px",
            }}
          >
            <Leaf style={{ width: "14px", height: "14px", color: "#1a3d2b" }} />
            <span
              style={{
                color: "#1a3d2b",
                fontSize: "12px",
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Community-driven sustainability platform
            </span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              color: "#1a1a18",
              marginBottom: "24px",
            }}
          >
            Ideas that{" "}
            <span
              style={{
                display: "block",
                background: "linear-gradient(135deg, #1a3d2b 0%, #40916c 50%, #e07b39 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Spark Change
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "#4a4a42",
              lineHeight: 1.7,
              maxWidth: "520px",
              marginBottom: "40px",
            }}
          >
            Share, discover, and vote on sustainability ideas that help build a
            greener, healthier planet — one community at a time.
          </p>

          {/* Search bar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            <div style={{ position: "relative", flex: "1", minWidth: "240px", maxWidth: "440px" }}>
              <Search
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "16px",
                  height: "16px",
                  color: "#8a8a7a",
                }}
              />
              <input
                type="text"
                placeholder="Search for ideas..."
                style={{
                  width: "100%",
                  height: "48px",
                  paddingLeft: "44px",
                  paddingRight: "16px",
                  border: "1px solid #e8e3da",
                  borderRadius: "12px",
                  backgroundColor: "#ffffff",
                  fontSize: "14px",
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#1a1a18",
                  outline: "none",
                  boxShadow: "0 1px 4px rgba(26,61,43,0.06)",
                }}
              />
            </div>
            <Link
              href="/ideas"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                height: "48px",
                paddingLeft: "24px",
                paddingRight: "24px",
                backgroundColor: "#1a3d2b",
                color: "#ffffff",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background-color 0.2s",
              }}
            >
              Explore Ideas
              <ArrowRight style={{ width: "16px", height: "16px" }} />
            </Link>
          </div>

          {/* Category pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/ideas?category=${cat.name.toLowerCase()}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  border: "1px solid #e8e3da",
                  backgroundColor: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 500,
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#4a4a42",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                <cat.icon style={{ width: "12px", height: "12px" }} />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Floating stats card */}
        <div
          style={{
            position: "absolute",
            right: "2rem",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "#ffffff",
            border: "1px solid #e8e3da",
            borderRadius: "20px",
            padding: "24px",
            width: "220px",
            boxShadow: "0 8px 32px rgba(26,61,43,0.08)",
          }}
          className="hidden xl:block"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                backgroundColor: "rgba(26,61,43,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Leaf style={{ width: "16px", height: "16px", color: "#1a3d2b" }} />
            </div>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a18", fontFamily: "'DM Sans', sans-serif" }}>
              Platform Stats
            </span>
          </div>

          {[
            { label: "Ideas Shared", value: "1,240+" },
            { label: "Active Members", value: "8,400+" },
            { label: "Votes Cast", value: "32K+" },
            { label: "Categories", value: "12" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #f0ebe2",
              }}
            >
              <span style={{ fontSize: "12px", color: "#8a8a7a", fontFamily: "'DM Sans', sans-serif" }}>
                {s.label}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#1a3d2b",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}