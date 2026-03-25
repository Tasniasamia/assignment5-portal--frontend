import { Leaf, Target, Heart, Globe } from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "Sustainability First",
    description:
      "Every idea on our platform is evaluated for its real environmental impact. We prioritize solutions that create lasting positive change.",
    color: "#1a3d2b",
    bg: "rgba(26,61,43,0.08)",
  },
  {
    icon: Target,
    title: "Community Driven",
    description:
      "Our platform thrives on collective wisdom. Members vote, comment, and collaborate to surface the most impactful ideas.",
    color: "#e07b39",
    bg: "rgba(224,123,57,0.08)",
  },
  {
    icon: Heart,
    title: "Open & Inclusive",
    description:
      "Sustainability belongs to everyone. We welcome ideas from all backgrounds, cultures, and regions of the world.",
    color: "#40916c",
    bg: "rgba(64,145,108,0.08)",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description:
      "From rooftop gardens to solar grids, we believe local ideas can inspire global movements when shared openly.",
    color: "#2d6a4f",
    bg: "rgba(45,106,79,0.08)",
  },
];

const stats = [
  { value: "2022", label: "Founded" },
  { value: "8,400+", label: "Members" },
  { value: "1,240+", label: "Ideas Shared" },
  { value: "42", label: "Countries" },
];

export default function AboutSection() {
  return (
    <section style={{ backgroundColor: "#ffffff", padding: "80px 0" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Header */}
        <div style={{ maxWidth: "640px", marginBottom: "64px" }}>
          <span
            style={{
              display: "block",
              fontSize: "11px",
              fontFamily: "'DM Mono', monospace",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#1a3d2b",
              marginBottom: "12px",
            }}
          >
            Who We Are
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "#1a1a18",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            Building a greener world,
            <br />
            one idea at a time
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "16px",
              color: "#4a4a42",
              lineHeight: 1.75,
            }}
          >
            EcoSpark Hub was born from a simple belief: that ordinary people
            hold extraordinary solutions to the climate crisis. We created this
            platform to connect sustainability champions, amplify grassroots
            ideas, and turn community knowledge into action.
          </p>
        </div>

        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "48px",
            alignItems: "start",
            marginBottom: "72px",
          }}
        >
          {/* Left — story */}
          <div>
            <div
              style={{
                width: "100%",
                height: "300px",
                borderRadius: "20px",
                background:
                  "linear-gradient(135deg, #1a3d2b 0%, #2d6a4f 50%, #40916c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-40px",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(116,198,157,0.2)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-30px",
                  left: "-30px",
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(224,123,57,0.15)",
                }}
              />
              <div style={{ textAlign: "center", position: "relative" }}>
                <div style={{ fontSize: "64px", marginBottom: "8px" }}>🌱</div>
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  Growing since 2022
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
              }}
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  style={{
                    backgroundColor: "#f8f4ed",
                    borderRadius: "14px",
                    padding: "16px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "#1a3d2b",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      color: "#8a8a7a",
                      marginTop: "2px",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — mission */}
          <div>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "22px",
                fontWeight: 700,
                color: "#1a1a18",
                marginBottom: "16px",
              }}
            >
              Our Mission
            </h3>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px",
                color: "#4a4a42",
                lineHeight: 1.75,
                marginBottom: "24px",
              }}
            >
              We exist to democratize sustainability innovation. Too often, the
              best ideas for addressing climate change, waste, and pollution
              remain locked in local communities — unknown to the wider world.
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "15px",
                color: "#4a4a42",
                lineHeight: 1.75,
                marginBottom: "32px",
              }}
            >
              EcoSpark Hub breaks down those barriers. By giving every member a
              voice and every idea a stage, we accelerate the spread of
              sustainable practices from neighborhoods to nations.
            </p>

            <div
              style={{
                borderLeft: "3px solid #1a3d2b",
                paddingLeft: "20px",
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "17px",
                  fontStyle: "italic",
                  color: "#1a1a18",
                  lineHeight: 1.6,
                }}
              >
                "The best sustainability solutions already exist — they just
                need to be found, shared, and scaled."
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#8a8a7a",
                  marginTop: "8px",
                }}
              >
                — EcoSpark Hub Founders
              </p>
            </div>
          </div>
        </div>

        {/* Values grid */}
        <div>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "24px",
              fontWeight: 700,
              color: "#1a1a18",
              marginBottom: "32px",
              textAlign: "center",
            }}
          >
            Our Values
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {values.map((v) => (
              <div
                key={v.title}
                style={{
                  backgroundColor: "#f8f4ed",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid #e8e3da",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    backgroundColor: v.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <v.icon style={{ width: "20px", height: "20px", color: v.color }} />
                </div>
                <h4
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#1a1a18",
                    marginBottom: "8px",
                  }}
                >
                  {v.title}
                </h4>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    color: "#4a4a42",
                    lineHeight: 1.65,
                  }}
                >
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}