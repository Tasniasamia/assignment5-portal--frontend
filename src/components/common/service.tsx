import {
  Lightbulb,
  ThumbsUp,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  Search,
  BarChart2,
  Bell,
} from "lucide-react";

const services = [
  {
    icon: Lightbulb,
    title: "Idea Submission",
    description:
      "Submit your sustainability ideas with full details — problem statement, proposed solution, images, and supporting documents. Draft and refine before publishing.",
    tag: "Core Feature",
    tagColor: "#1a3d2b",
    tagBg: "rgba(26,61,43,0.08)",
  },
  {
    icon: ShieldCheck,
    title: "Admin Review",
    description:
      "Every idea goes through a transparent review process. Admins approve high-quality submissions and provide constructive feedback on rejected ones.",
    tag: "Quality Control",
    tagColor: "#2d6a4f",
    tagBg: "rgba(45,106,79,0.1)",
  },
  {
    icon: ThumbsUp,
    title: "Community Voting",
    description:
      "Upvote or downvote ideas to help the best ones rise to the top. Remove your vote anytime. The most-voted ideas get featured on the homepage.",
    tag: "Engagement",
    tagColor: "#e07b39",
    tagBg: "rgba(224,123,57,0.08)",
  },
  {
    icon: MessageCircle,
    title: "Nested Discussions",
    description:
      "Comment on ideas and reply to others in a threaded discussion system — similar to Reddit. Share experiences, ask questions, and build on ideas together.",
    tag: "Community",
    tagColor: "#40916c",
    tagBg: "rgba(64,145,108,0.08)",
  },
  {
    icon: CreditCard,
    title: "Paid Ideas",
    description:
      "Idea authors can monetize detailed proposals by marking them as paid. Members purchase access via Stripe. A payment receipt is emailed automatically.",
    tag: "Monetization",
    tagColor: "#1a3d2b",
    tagBg: "rgba(26,61,43,0.08)",
  },
  {
    icon: Search,
    title: "Smart Search & Filter",
    description:
      "Find ideas by keyword, category, type, vote count, or author. Sort by recency, top-voted, or most-commented. All with instant results.",
    tag: "Discovery",
    tagColor: "#2d6a4f",
    tagBg: "rgba(45,106,79,0.1)",
  },
  {
    icon: BarChart2,
    title: "Member Dashboard",
    description:
      "Track your submitted ideas, votes, comments, and payments in one place. View feedback from admins and resubmit rejected ideas after improvements.",
    tag: "Dashboard",
    tagColor: "#e07b39",
    tagBg: "rgba(224,123,57,0.08)",
  },
  {
    icon: Bell,
    title: "Newsletter Updates",
    description:
      "Subscribe to receive weekly digests of top-voted ideas, new submissions, and important platform announcements directly to your inbox.",
    tag: "Notifications",
    tagColor: "#40916c",
    tagBg: "rgba(64,145,108,0.08)",
  },
];

export default function ServicesSection() {
  return (
    <section style={{ backgroundColor: "#f8f4ed", padding: "80px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 60px" }}>
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
            What We Offer
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "#1a1a18",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            Everything you need to
            <br />
            champion sustainability
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "16px",
              color: "#4a4a42",
              lineHeight: 1.7,
            }}
          >
            From idea creation to community engagement, EcoSpark Hub provides
            all the tools to share, discover, and act on sustainable solutions.
          </p>
        </div>

        {/* Services grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {services.map((service) => (
            <div
              key={service.title}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "18px",
                padding: "28px",
                border: "1px solid #e8e3da",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  backgroundColor: service.tagBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <service.icon
                  style={{ width: "22px", height: "22px", color: service.tagColor }}
                />
              </div>

              {/* Tag */}
              <span
                style={{
                  display: "inline-block",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  color: service.tagColor,
                  backgroundColor: service.tagBg,
                  padding: "3px 10px",
                  borderRadius: "9999px",
                  marginBottom: "10px",
                }}
              >
                {service.tag}
              </span>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1a1a18",
                  marginBottom: "10px",
                }}
              >
                {service.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#4a4a42",
                  lineHeight: 1.7,
                }}
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div
          style={{
            marginTop: "60px",
            backgroundColor: "#1a3d2b",
            borderRadius: "20px",
            padding: "40px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "22px",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "6px",
              }}
            >
              Ready to share your idea?
            </h3>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Join 8,400+ members already making a difference.
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a
              href="/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                height: "44px",
                padding: "0 24px",
                backgroundColor: "#e07b39",
                color: "#ffffff",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                textDecoration: "none",
              }}
            >
              Get Started Free
            </a>
            <a
              href="/ideas"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                height: "44px",
                padding: "0 24px",
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                textDecoration: "none",
              }}
            >
              Explore Ideas
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}