"use client";

import { useEffect, useRef, useState } from "react";
import { updateProfileService } from "@/service/profile.service"; // path adjust করো

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "ADMIN" | "MEMBER";
  admin: { profilePhoto: string | null; contactNumber: string | null } | null;
  member: { profilePhoto: string | null; contactNumber: string | null } | null;
}

// ─── Replace with your actual getUserInfo ─────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────

export default function UpdateProfile({data}:{data:any}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // Image state — তিনটা আলাদা track করা হচ্ছে
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null); // server থেকে আসা
  const [newFile, setNewFile] = useState<File | null>(null);                     // user pick করা
  const [newPreviewUrl, setNewPreviewUrl] = useState<string | null>(null);       // নতুন file এর preview

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ── Load profile ────────────────────────────────────────────────────────
useEffect(() => {
  try {
    const u = data; // ✅ direct use

    setProfile(u);
    setName(u.name ?? "");

    const roleData = u.role === "ADMIN" ? u.admin : u.member;
    setContactNumber(roleData?.contactNumber ?? "");

    const photo = roleData?.profilePhoto ?? u.image ?? null;
    setExistingImageUrl(photo);
  } catch {
    setError("Failed to load profile.");
  } finally {
    setLoading(false);
  }
}, [data]);
  // ── Pick new image ──────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (newPreviewUrl) URL.revokeObjectURL(newPreviewUrl);
    setNewFile(file);
    setNewPreviewUrl(URL.createObjectURL(file));
    setExistingImageUrl(null); // visually replace করো
  };

  // ── Cancel newly picked file (before save) ──────────────────────────────
  const handleCancelNewFile = () => {
    if (newPreviewUrl) URL.revokeObjectURL(newPreviewUrl);
    setNewFile(null);
    setNewPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };



  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await updateProfileService({ name, contactNumber, file: newFile });
      console.log("response from updateProfileService", res);
      if (res.success) {
        setSuccess("Profile updated successfully!");
        if (newPreviewUrl) {
          setExistingImageUrl(newPreviewUrl);
          setNewFile(null);
          setNewPreviewUrl(null);
        }
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(res.message ?? "Update failed.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const displayImage = newPreviewUrl ?? existingImageUrl;
  const initials = profile?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";

  // ── Skeleton ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="up-wrap">
        <div className="up-sk up-sk-avatar" />
        <div className="up-sk up-sk-line" />
        <div className="up-sk up-sk-line" style={{ width: "60%" }} />
        <div className="up-sk up-sk-btn" />
        <style>{skeletonCss}</style>
      </div>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="up-container">
        <form onSubmit={handleSubmit} className="up-form">

          {/* ── 1. Image Upload ──────────────────────────────── */}
          <div className="up-avatar-section">
            <p className="up-section-label">Profile photo</p>

            <div className="up-avatar-row">
              {/* Clickable avatar */}
              <div
                className="up-avatar"
                onClick={() => fileInputRef.current?.click()}
                role="button" tabIndex={0} title="Click to change photo"
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              >
                {displayImage
                  ? <img src={displayImage} alt="Profile" className="up-avatar-img" />
                  : <span className="up-initials">{initials}</span>
                }
                <div className="up-avatar-overlay"><CameraIcon /></div>
              </div>

              {/* Buttons */}
              <div className="up-avatar-btns">
                <button type="button" className="up-btn-outline"
                  onClick={() => fileInputRef.current?.click()}>
                  {displayImage ? "Change photo" : "Upload photo"}
                </button>

                {/* Cancel newly picked file */}
                {newFile && (
                  <button type="button" className="up-btn-danger" onClick={handleCancelNewFile}>
                    Cancel
                  </button>
                )}

                {/* Delete server image */}
                {existingImageUrl && !newFile && (
                  <button type="button" className="up-btn-danger"
                    onClick={handleDeleteExistingImage} disabled={deleting}>
                    {deleting ? "Removing…" : "Remove photo"}
                  </button>
                )}
              </div>
            </div>

            {/* Newly picked file info */}
            {newFile && (
              <p className="up-file-info">
                <FileIcon />
                {newFile.name}
                <span className="up-file-size">({(newFile.size / 1024).toFixed(0)} KB)</span>
              </p>
            )}

            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange} style={{ display: "none" }} />
          </div>

          <div className="up-divider" />

          {/* ── 2. Read-only info ─────────────────────────────── */}
          <div className="up-readonly-row">
            <div className="up-readonly-item">
              <span className="up-label">Email</span>
              <span className="up-readonly-val">{profile?.email}</span>
            </div>
            <div className="up-readonly-item">
              <span className="up-label">Role</span>
              <span className={`up-badge ${profile?.role === "ADMIN" ? "up-badge-admin" : "up-badge-member"}`}>
                {profile?.role}
              </span>
            </div>
          </div>

          <div className="up-divider" />

          {/* ── 3. Editable fields ───────────────────────────── */}
          <div className="up-field">
            <label className="up-label" htmlFor="up-name">Full name</label>
            <input id="up-name" type="text" className="up-input"
              placeholder="Enter your full name"
              value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="up-field">
            <label className="up-label" htmlFor="up-phone">Contact number</label>
            <div className="up-input-wrap">
              <span className="up-prefix"><PhoneIcon /></span>
              <input id="up-phone" type="tel" className="up-input up-input-pl"
                placeholder="+880 1700 000000"
                value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
            </div>
          </div>

          {/* ── 4. Feedback ──────────────────────────────────── */}
          {error && (
            <div className="up-alert up-alert-err"><AlertIcon />{error}</div>
          )}
          {success && (
            <div className="up-alert up-alert-ok"><CheckIcon />{success}</div>
          )}

          {/* ── 5. Submit ────────────────────────────────────── */}
          <button type="submit" className="up-submit" disabled={saving}>
            {saving && <span className="up-spinner" />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function CameraIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
}
function PhoneIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.43 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.128.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.29 6.29l1.12-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.572 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
function FileIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline",marginRight:4,verticalAlign:"middle"}}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>;
}
function AlertIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}
function CheckIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><polyline points="20 6 9 17 4 12"/></svg>;
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
.up-container { max-width: 500px; margin: 0 auto; padding: 2rem 1rem; font-family: 'Geist','DM Sans',system-ui,sans-serif; }
.up-form { display: flex; flex-direction: column; gap: 1.2rem; }
.up-section-label { font-size:.78rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:#64748b; margin:0 0 .75rem; }

/* avatar */
.up-avatar-section { display:flex; flex-direction:column; }
.up-avatar-row { display:flex; align-items:center; gap:1.25rem; }
.up-avatar { position:relative; width:88px; height:88px; border-radius:50%; cursor:pointer; flex-shrink:0; border:2.5px solid #e2e8f0; overflow:hidden; outline:none; transition:border-color .2s; }
.up-avatar:hover { border-color:#6366f1; }
.up-avatar:focus-visible { box-shadow:0 0 0 3px rgba(99,102,241,.25); }
.up-avatar-img { width:100%; height:100%; object-fit:cover; border-radius:50%; display:block; }
.up-initials { width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#eef2ff; color:#4f46e5; font-size:1.4rem; font-weight:700; }
.up-avatar-overlay { position:absolute; inset:0; border-radius:50%; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; color:#fff; opacity:0; transition:opacity .18s; }
.up-avatar:hover .up-avatar-overlay { opacity:1; }

/* buttons */
.up-avatar-btns { display:flex; flex-direction:column; gap:8px; }
.up-btn-outline { height:34px; padding:0 14px; border:1.5px solid #6366f1; background:transparent; color:#4f46e5; border-radius:8px; font-size:.84rem; font-weight:600; cursor:pointer; transition:background .15s; }
.up-btn-outline:hover { background:#eef2ff; }
.up-btn-danger { height:34px; padding:0 14px; border:none; background:none; color:#dc2626; border-radius:8px; font-size:.84rem; font-weight:500; cursor:pointer; text-align:left; transition:background .15s; }
.up-btn-danger:hover { background:#fef2f2; }
.up-btn-danger:disabled { opacity:.55; cursor:not-allowed; }

/* file info */
.up-file-info { margin:8px 0 0; font-size:.8rem; color:#64748b; }
.up-file-size { margin-left:4px; color:#94a3b8; }

/* divider */
.up-divider { height:1px; background:#f1f5f9; }

/* read-only */
.up-readonly-row { display:flex; gap:10px; flex-wrap:wrap; }
.up-readonly-item { flex:1; min-width:140px; display:flex; flex-direction:column; gap:4px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:.6rem .85rem; }
.up-readonly-val { font-size:.875rem; color:#334155; font-weight:500; word-break:break-all; }

/* badge */
.up-badge { display:inline-block; padding:2px 10px; border-radius:999px; font-size:.7rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; width:fit-content; }
.up-badge-admin { background:#ede9fe; color:#6d28d9; }
.up-badge-member { background:#dbeafe; color:#1d4ed8; }

/* label */
.up-label { font-size:.78rem; font-weight:600; color:#64748b; letter-spacing:.05em; text-transform:uppercase; }

/* input */
.up-field { display:flex; flex-direction:column; gap:6px; }
.up-input-wrap { position:relative; }
.up-prefix { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#94a3b8; display:flex; align-items:center; }
.up-input { height:44px; padding:0 .875rem; border:1.5px solid #e2e8f0; border-radius:10px; font-size:.9375rem; color:#1e293b; background:#fff; outline:none; width:100%; box-sizing:border-box; transition:border-color .15s,box-shadow .15s; }
.up-input-pl { padding-left:2.25rem; }
.up-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.12); }
.up-input::placeholder { color:#cbd5e1; }

/* alerts */
.up-alert { display:flex; align-items:center; gap:8px; padding:.6rem .9rem; border-radius:8px; font-size:.875rem; }
.up-alert-err { background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; }
.up-alert-ok { background:#f0fdf4; border:1px solid #bbf7d0; color:#15803d; }

/* submit */
.up-submit { height:48px; border-radius:12px; background:#4f46e5; color:#fff; font-size:.9375rem; font-weight:600; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background .15s,transform .1s; }
.up-submit:hover:not(:disabled) { background:#4338ca; }
.up-submit:active:not(:disabled) { transform:scale(.98); }
.up-submit:disabled { opacity:.65; cursor:not-allowed; }

/* spinner */
.up-spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,.35); border-top-color:#fff; border-radius:50%; animation:up-spin .6s linear infinite; }
@keyframes up-spin { to { transform:rotate(360deg); } }
`;

const skeletonCss = `
.up-wrap { max-width:500px; margin:2rem auto; padding:0 1rem; display:flex; flex-direction:column; gap:1rem; }
.up-sk { background:#f1f5f9; border-radius:8px; animation:pulse 1.4s ease-in-out infinite; }
.up-sk-avatar { width:88px; height:88px; border-radius:50%; }
.up-sk-line { height:44px; }
.up-sk-btn { height:48px; border-radius:12px; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
`;