import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@ecosparkhub.com",
    sub: "We reply within 24 hours",
    color: "#1a3d2b",
    bg: "rgba(26,61,43,0.08)",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+880 1234-567890",
    sub: "Mon–Fri, 9am–6pm BST",
    color: "#2d6a4f",
    bg: "rgba(45,106,79,0.1)",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Dhaka, Bangladesh",
    sub: "Remote-first team",
    color: "#e07b39",
    bg: "rgba(224,123,57,0.08)",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "24/7 Platform",
    sub: "Always online for you",
    color: "#40916c",
    bg: "rgba(64,145,108,0.08)",
  },
];

export default function ContactSection() {
  return (
    <section style={{ backgroundColor: "#ffffff", padding: "80px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: "560px", margin: "0 auto 60px" }}>
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
            Get In Touch
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
            We&apos;d love to hear
            <br />
            from you
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "16px",
              color: "#4a4a42",
              lineHeight: 1.7,
            }}
          >
            Have a question, idea, or feedback? Our team is always happy to
            help. Reach out through any of the channels below.
          </p>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "48px",
            alignItems: "start",
          }}
        >
          {/* Left — contact info */}
          <div>
            <h3
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                color: "#1a1a18",
                marginBottom: "24px",
              }}
            >
              Contact Information
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px",
                    backgroundColor: "#f8f4ed",
                    borderRadius: "14px",
                    border: "1px solid #e8e3da",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      backgroundColor: info.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <info.icon
                      style={{ width: "18px", height: "18px", color: info.color }}
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "11px",
                        fontWeight: 500,
                        color: "#8a8a7a",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "2px",
                      }}
                    >
                      {info.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#1a1a18",
                        marginBottom: "2px",
                      }}
                    >
                      {info.value}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px",
                        color: "#8a8a7a",
                      }}
                    >
                      {info.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1a1a18",
                  marginBottom: "12px",
                }}
              >
                Follow us on social media
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                {["Twitter", "Facebook", "Instagram", "LinkedIn"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      backgroundColor: "#f8f4ed",
                      border: "1px solid #e8e3da",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600,
                      color: "#1a3d2b",
                      textDecoration: "none",
                    }}
                  >
                    {s.charAt(0)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — contact form */}
          <div
            style={{
              backgroundColor: "#f8f4ed",
              borderRadius: "20px",
              padding: "36px",
              border: "1px solid #e8e3da",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "28px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(26,61,43,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MessageSquare style={{ width: "16px", height: "16px", color: "#1a3d2b" }} />
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#1a1a18",
                  }}
                >
                  Send a Message
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "#8a8a7a",
                  }}
                >
                  We&apos;ll respond within 24 hours
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Name + Email */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#1a1a18",
                      fontFamily: "'DM Sans', sans-serif",
                      marginBottom: "6px",
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    style={{
                      width: "100%",
                      height: "42px",
                      padding: "0 14px",
                      border: "1px solid #e8e3da",
                      borderRadius: "10px",
                      backgroundColor: "#ffffff",
                      fontSize: "13px",
                      fontFamily: "'DM Sans', sans-serif",
                      color: "#1a1a18",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#1a1a18",
                      fontFamily: "'DM Sans', sans-serif",
                      marginBottom: "6px",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    style={{
                      width: "100%",
                      height: "42px",
                      padding: "0 14px",
                      border: "1px solid #e8e3da",
                      borderRadius: "10px",
                      backgroundColor: "#ffffff",
                      fontSize: "13px",
                      fontFamily: "'DM Sans', sans-serif",
                      color: "#1a1a18",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#1a1a18",
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: "6px",
                  }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="How can we help you?"
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "0 14px",
                    border: "1px solid #e8e3da",
                    borderRadius: "10px",
                    backgroundColor: "#ffffff",
                    fontSize: "13px",
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#1a1a18",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Message */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "#1a1a18",
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: "6px",
                  }}
                >
                  Message
                </label>
                <textarea
                  placeholder="Write your message here..."
                  rows={5}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1px solid #e8e3da",
                    borderRadius: "10px",
                    backgroundColor: "#ffffff",
                    fontSize: "13px",
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#1a1a18",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Submit */}
              <button
                type="button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  height: "46px",
                  backgroundColor: "#1a3d2b",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
              >
                <Send style={{ width: "16px", height: "16px" }} />
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}