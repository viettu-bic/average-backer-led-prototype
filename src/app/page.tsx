"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  MOCK_REQUESTS,
  CURRENT_USER,
  CoachingRequest,
  Applicant,
  StoredSession,
} from "@/lib/mockData";

// ─── Tag color hash ───────────────────────────────────────────────────────────
const TAG_PALETTES = [
  "bg-teal-50 text-teal-700 border border-teal-200",
  "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "bg-violet-50 text-violet-700 border border-violet-200",
  "bg-amber-50 text-amber-700 border border-amber-200",
  "bg-pink-50 text-pink-700 border border-pink-200",
  "bg-sky-50 text-sky-700 border border-sky-200",
  "bg-orange-50 text-orange-700 border border-orange-200",
  "bg-rose-50 text-rose-700 border border-rose-200",
];

function tagColor(tag: string) {
  let h = 0;
  for (const c of tag) h = (h * 31 + c.charCodeAt(0)) % TAG_PALETTES.length;
  return TAG_PALETTES[h];
}

// ─── Trust badge (PRD Story 3) ────────────────────────────────────────────────
function TrustBadge({ score, sessions }: { score: number; sessions: number }) {
  if (sessions < 3) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#fffbeb] text-[#d97706] border border-[#f59e0b] px-2 py-0.5 rounded-full">
        New Creator
      </span>
    );
  }
  if (score >= 80) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#22c55e] px-2 py-0.5 rounded-full">
        ★ Top Rated
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#f3f3f2] text-[#6f6f6a] border border-[#e9e9e7] px-2 py-0.5 rounded-full">
      Score {score}
    </span>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function ClockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function BidIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 40 }: { src: string; name: string; size?: number }) {
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="rounded-full object-cover bg-[#f0fdfa] flex-shrink-0"
      onError={(e) => {
        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f766e&color=fff&size=${size * 2}`;
      }}
    />
  );
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg">{children}</div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: CoachingRequest["status"] }) {
  if (status === "open")
    return <span className="text-xs font-semibold bg-[#f0fdfa] text-[#0f766e] border border-[#0d9488]/30 px-2 py-0.5 rounded-full">Open</span>;
  if (status === "matched")
    return <span className="text-xs font-semibold bg-[#f3f3f2] text-[#6f6f6a] border border-[#e9e9e7] px-2 py-0.5 rounded-full">Matched</span>;
  return <span className="text-xs font-semibold bg-[#fef2f2] text-[#dc2626] border border-red-200 px-2 py-0.5 rounded-full">Closed</span>;
}

// ─── Coaching Card ────────────────────────────────────────────────────────────
function CoachingCard({
  request,
  onBid,
  onViewBids,
}: {
  request: CoachingRequest;
  onBid: (r: CoachingRequest) => void;
  onViewBids: (r: CoachingRequest) => void;
}) {
  return (
    <div className="bg-white rounded-lg border border-[#e9e9e7] shadow hover:shadow-md hover:border-[#0d9488]/30 transition-all duration-200 flex flex-col overflow-hidden group">
      {request.isOwn && (
        <div className="bg-[#0f766e] text-white typo-paragraph-mini-semibold px-4 py-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-white/70 rounded-full" />
          Your Request
        </div>
      )}

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Header row */}
        <div className="flex gap-3 items-start">
          <Avatar src={request.backerAvatar} name={request.backerName} size={40} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="typo-paragraph-small-semibold text-[#252522] truncate">{request.backerName}</span>
              <span className="typo-paragraph-mini text-[#6f6f6a]">{request.backerHandle}</span>
            </div>
            <p className="typo-paragraph-mini text-[#6f6f6a] mt-0.5">{request.postedAt}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className="typo-paragraph-lg-semibold text-[#0f766e]">${request.price}</span>
            <StatusBadge status={request.status} />
          </div>
        </div>

        {/* Title */}
        <h3 className="typo-paragraph-semibold text-[#252522] leading-snug line-clamp-2 group-hover:text-[#0f766e] transition-colors">
          {request.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {request.tags.map((tag) => (
            <span key={tag} className={`typo-paragraph-mini-semibold px-2 py-0.5 rounded-full ${tagColor(tag)}`}>
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-[#6f6f6a] typo-paragraph-mini flex-wrap">
          <span className="flex items-center gap-1">
            <ClockIcon />{request.coachingDuration} min
          </span>
          <span className="flex items-center gap-1">
            <BidIcon />{request.bidCount} bid{request.bidCount !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1 text-[#d97706] font-semibold">
            <ClockIcon />{request.remainingTime} left
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={() => request.isOwn ? onViewBids(request) : onBid(request)}
          className={`mt-auto w-full py-2 rounded-md typo-paragraph-small-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#99f6e4] ${
            request.isOwn
              ? "bg-[#f0fdfa] text-[#0f766e] hover:bg-[#ccfbf1] border border-[#0d9488]/30"
              : "bg-[#0f766e] text-white hover:bg-[#115e59]"
          }`}
        >
          {request.isOwn
            ? `Review ${request.applicants?.length ?? 0} Bid${(request.applicants?.length ?? 0) !== 1 ? "s" : ""}`
            : "Submit Bid"}
        </button>
      </div>
    </div>
  );
}

// ─── Create Request Modal ─────────────────────────────────────────────────────
function CreateModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (r: CoachingRequest) => void }) {
  const [form, setForm] = useState({
    title: "Looking for a Python & data science mentor",
    description:
      "I'm learning Python for data analysis and machine learning. Seeking a mentor who can guide me through NumPy, Pandas, and sklearn. Weekly sessions with mini-projects would be ideal.",
    duration: "60",
    price: "75",
    tags: "python, data science, machine learning, beginner",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newRequest: CoachingRequest = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      backerName: CURRENT_USER.name,
      backerHandle: CURRENT_USER.handle,
      backerAvatar: CURRENT_USER.avatar,
      backerBio: CURRENT_USER.specialty,
      remainingTime: "7d 0h",
      postedAt: "just now",
      coachingDuration: parseInt(form.duration),
      price: parseInt(form.price),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      status: "open",
      bidCount: 0,
      isOwn: true,
      applicants: [],
    };
    onSubmit(newRequest);
    onClose();
  }

  const inputCls = "w-full bg-white border border-[#e9e9e7] rounded-md px-3 py-2 typo-paragraph-small text-[#252522] placeholder:text-[#6f6f6a] focus:outline-none focus:ring-[3px] focus:ring-[#99f6e4] focus:border-[#0d9488] transition-shadow";

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-[#0f766e] px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold">Post a Coaching Request</h2>
              <p className="text-teal-100 typo-paragraph-small mt-0.5">Describe what you want to learn and your budget</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <XIcon />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-1.5">
              What do you want to learn? *
            </label>
            <input
              type="text"
              required
              maxLength={80}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputCls}
              placeholder="e.g. I want to learn how to grow a YouTube channel"
            />
            <p className="typo-paragraph-mini text-[#6f6f6a] mt-1">{form.title.length}/80 characters</p>
          </div>

          <div>
            <label className="block typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-1.5">
              Describe your goals *
            </label>
            <textarea
              required
              rows={4}
              maxLength={1000}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${inputCls} h-auto resize-none`}
              placeholder="Your current level, what you want to achieve, and anything the creator should know..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-1.5">
                Session Length
              </label>
              <select
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className={inputCls}
              >
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>
            <div>
              <label className="block typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-1.5">
                Budget (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 typo-paragraph-small text-[#6f6f6a]">$</span>
                <input
                  type="number"
                  min={20}
                  max={999}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className={`${inputCls} pl-7`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-1.5">
              Topic Tags
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className={inputCls}
              placeholder="e.g. python, beginner, data science"
            />
            <p className="typo-paragraph-mini text-[#6f6f6a] mt-1">Comma-separated, up to 5 tags</p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0f766e] hover:bg-[#115e59] text-white typo-paragraph-small-semibold py-2.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#99f6e4] mt-1"
          >
            Post Request
          </button>
        </form>
      </div>
    </Modal>
  );
}

// ─── Bid (Join) Modal ─────────────────────────────────────────────────────────
function BidModal({
  request,
  onClose,
  onSubmit,
}: {
  request: CoachingRequest;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [pitch, setPitch] = useState(
    "I'm very interested in this request and believe my background makes me a strong fit. I've helped multiple learners achieve similar goals and would love to work with you on a structured plan."
  );

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-[#0f766e] px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold">Submit Your Bid</h2>
              <p className="text-teal-100 typo-paragraph-small mt-0.5">Tell the backer why you're the right fit</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <XIcon />
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
          {/* Request preview */}
          <div className="bg-[#f7f7f6] rounded-lg p-4 flex gap-3 border border-[#e9e9e7]">
            <Avatar src={request.backerAvatar} name={request.backerName} size={40} />
            <div className="flex-1 min-w-0">
              <p className="typo-paragraph-small-semibold text-[#252522] leading-snug">{request.title}</p>
              <p className="typo-paragraph-mini text-[#6f6f6a] mt-0.5">{request.backerHandle} · {request.postedAt}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 typo-paragraph-mini text-[#6f6f6a]"><ClockIcon />{request.coachingDuration} min</span>
                <span className="typo-paragraph-small-semibold text-[#0f766e]">${request.price}</span>
                <span className="flex items-center gap-1 typo-paragraph-mini text-[#d97706] font-semibold"><ClockIcon />{request.remainingTime} left</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-2">Request Details</p>
            <p className="typo-paragraph-small text-[#6f6f6a] leading-relaxed">{request.description}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {request.tags.map((tag) => (
              <span key={tag} className={`typo-paragraph-mini-semibold px-2 py-0.5 rounded-full ${tagColor(tag)}`}>
                {tag}
              </span>
            ))}
          </div>

          {/* Pitch note */}
          <div>
            <label className="block typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-1.5">
              Pitch Note <span className="text-[#afafab] font-normal normal-case">(optional, max 300 chars)</span>
            </label>
            <textarea
              rows={4}
              maxLength={300}
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              className="w-full bg-white border border-[#e9e9e7] rounded-md px-3 py-2 typo-paragraph-small text-[#252522] placeholder:text-[#6f6f6a] focus:outline-none focus:ring-[3px] focus:ring-[#99f6e4] focus:border-[#0d9488] resize-none transition-shadow"
              placeholder="Tell the backer about your experience and how you'd approach this session..."
            />
            <p className="typo-paragraph-mini text-[#6f6f6a] mt-1">{pitch.length}/300</p>
          </div>

          <button
            onClick={onSubmit}
            className="w-full bg-[#0f766e] hover:bg-[#115e59] text-white typo-paragraph-small-semibold py-2.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#99f6e4]"
          >
            Submit Bid
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Review Bids Modal ────────────────────────────────────────────────────────
function ReviewBidsModal({
  request,
  onClose,
  onAccept,
}: {
  request: CoachingRequest;
  onClose: () => void;
  onAccept: (applicant: Applicant) => void;
}) {
  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-[#0f766e] px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold">Review Bids</h2>
              <p className="text-teal-100 typo-paragraph-small mt-0.5 line-clamp-1">{request.title}</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <XIcon />
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-3 max-h-[72vh] overflow-y-auto">
          {(!request.applicants || request.applicants.length === 0) ? (
            <div className="text-center py-12">
              <p className="typo-paragraph-small text-[#6f6f6a]">No bids yet. Check back soon!</p>
              <p className="typo-paragraph-mini text-[#afafab] mt-1">Creators typically respond within 48 hours.</p>
            </div>
          ) : (
            request.applicants.map((applicant) => (
              <div
                key={applicant.id}
                className="border border-[#e9e9e7] rounded-lg p-4 flex flex-col gap-3 hover:border-[#0d9488]/40 transition-colors"
              >
                {/* Creator header */}
                <div className="flex gap-3 items-start">
                  <Avatar src={applicant.avatar} name={applicant.name} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="typo-paragraph-small-semibold text-[#252522]">{applicant.name}</span>
                      <TrustBadge score={applicant.trustScore} sessions={applicant.sessionsCompleted} />
                    </div>
                    <p className="typo-paragraph-mini text-[#6f6f6a]">{applicant.handle}</p>
                    <p className="typo-paragraph-mini-semibold text-[#0f766e] mt-0.5">{applicant.specialty}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="flex items-center gap-0.5 text-[#d97706] typo-paragraph-mini-semibold">
                      <StarIcon />{applicant.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1 typo-paragraph-mini text-[#6f6f6a]">
                      <UsersIcon />{applicant.sessionsCompleted}
                    </span>
                    <span className="typo-paragraph-mini text-[#6f6f6a]">Trust: <strong className="text-[#252522]">{applicant.trustScore}</strong>/100</span>
                  </div>
                </div>

                {/* Pitch */}
                <p className="typo-paragraph-small text-[#6f6f6a] leading-relaxed bg-[#f7f7f6] rounded-md p-3 border border-[#f3f3f2] italic">
                  &ldquo;{applicant.message}&rdquo;
                </p>

                <button
                  onClick={() => onAccept(applicant)}
                  className="w-full bg-[#0f766e] hover:bg-[#115e59] text-white typo-paragraph-small-semibold py-2.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#99f6e4]"
                >
                  Accept This Creator
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}

// ─── Accept Alert ─────────────────────────────────────────────────────────────
function AcceptAlert({
  name,
  onJoinNow,
  onDismiss,
}: {
  name: string;
  onJoinNow: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 animate-slide-down">
      <div className="bg-white border border-[#22c55e] rounded-lg shadow-xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-[#f0fdf4] rounded-full flex items-center justify-center flex-shrink-0 text-[#16a34a]">
          <CheckIcon />
        </div>
        <div className="flex-1 min-w-0">
          <p className="typo-paragraph-small-semibold text-[#252522]">
            🎉 {name} accepted your request!
          </p>
          <p className="typo-paragraph-mini text-[#6f6f6a] mt-0.5">Your coaching session is confirmed and ready to start.</p>
        </div>
        <button
          onClick={onJoinNow}
          className="bg-[#16a34a] hover:bg-[#15803d] text-white typo-paragraph-small-semibold px-4 py-2 rounded-md transition-colors flex-shrink-0"
        >
          Join Now
        </button>
        <button onClick={onDismiss} className="text-[#afafab] hover:text-[#6f6f6a] transition-colors flex-shrink-0 ml-1">
          <XIcon />
        </button>
      </div>
    </div>
  );
}

// ─── Pending Banner ───────────────────────────────────────────────────────────
function PendingBanner({ name }: { name: string }) {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 animate-slide-down">
      <div className="bg-[#f0fdfa] border border-[#0d9488]/40 rounded-lg shadow-lg p-4 flex items-center gap-3">
        <div className="w-4 h-4 border-2 border-[#0f766e] border-t-transparent rounded-full animate-spin flex-shrink-0" />
        <p className="typo-paragraph-small text-[#0f766e]">
          Waiting for {name} to respond{dots}
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const [requests, setRequests] = useState<CoachingRequest[]>(MOCK_REQUESTS);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [bidTarget, setBidTarget] = useState<CoachingRequest | null>(null);
  const [bidsTarget, setBidsTarget] = useState<CoachingRequest | null>(null);
  const [pending, setPending] = useState<{ request: CoachingRequest; applicant?: Applicant } | null>(null);
  const [accepted, setAccepted] = useState<{ request: CoachingRequest; applicant?: Applicant } | null>(null);

  const allTags = Array.from(new Set(requests.flatMap((r) => r.tags)));
  const filtered = activeFilter ? requests.filter((r) => r.tags.includes(activeFilter)) : requests;

  useEffect(() => {
    if (!pending) return;
    const timer = setTimeout(() => { setAccepted(pending); setPending(null); }, 5000);
    return () => clearTimeout(timer);
  }, [pending]);

  const handleBidSubmit = useCallback(() => {
    if (!bidTarget) return;
    setPending({ request: bidTarget });
    setBidTarget(null);
  }, [bidTarget]);

  const handleAccept = useCallback(
    (applicant: Applicant) => {
      if (!bidsTarget) return;
      const request = bidsTarget;
      const creator = {
        id: applicant.id,
        name: applicant.name,
        handle: applicant.handle,
        avatar: applicant.avatar,
        specialty: applicant.specialty,
        rating: applicant.rating,
        sessionsCompleted: applicant.sessionsCompleted,
        trustScore: applicant.trustScore,
      };
      const session: StoredSession = { requestId: request.id, request, creator };
      localStorage.setItem("coachingSession", JSON.stringify(session));
      setBidsTarget(null);
      router.push(`/session/${request.id}`);
    },
    [bidsTarget, router]
  );

  const handleJoinNow = useCallback(() => {
    if (!accepted) return;
    const { request } = accepted;
    const creator = {
      id: CURRENT_USER.id,
      name: CURRENT_USER.name,
      handle: CURRENT_USER.handle,
      avatar: CURRENT_USER.avatar,
      specialty: CURRENT_USER.specialty,
      rating: CURRENT_USER.rating,
      sessionsCompleted: CURRENT_USER.sessionsCompleted,
      trustScore: CURRENT_USER.trustScore,
    };
    const session: StoredSession = { requestId: request.id, request, creator };
    localStorage.setItem("coachingSession", JSON.stringify(session));
    setAccepted(null);
    router.push(`/session/${request.id}`);
  }, [accepted, router]);

  const handleAddRequest = useCallback((r: CoachingRequest) => {
    setRequests((prev) => [r, ...prev]);
  }, []);

  const pendingName = pending?.applicant?.name ?? pending?.request.backerName ?? "";
  const acceptedName = accepted?.applicant?.name ?? accepted?.request.backerName ?? "";

  return (
    <>
      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translate(-50%, -12px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-slide-down { animation: slide-down 0.25s ease-out forwards; }
      `}</style>

      {pending && <PendingBanner name={pendingName} />}
      {accepted && <AcceptAlert name={acceptedName} onJoinNow={handleJoinNow} onDismiss={() => setAccepted(null)} />}

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onSubmit={handleAddRequest} />}
      {bidTarget && <BidModal request={bidTarget} onClose={() => setBidTarget(null)} onSubmit={handleBidSubmit} />}
      {bidsTarget && <ReviewBidsModal request={bidsTarget} onClose={() => setBidsTarget(null)} onAccept={handleAccept} />}

      <div className="min-h-screen bg-[#f7f7f6]">
        {/* ── Nav ── */}
        <header className="bg-white border-b border-[#e9e9e7] sticky top-0 z-40">
          <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#0f766e] rounded-md flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                </svg>
              </div>
              <span className="font-heading font-semibold text-[#252522] text-lg tracking-tight">CoachMatch</span>
              <span className="typo-paragraph-mini-semibold bg-[#f0fdfa] text-[#0f766e] border border-[#0d9488]/30 px-2 py-0.5 rounded-full hidden sm:inline">
                Backer-Led
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-1.5 bg-[#0f766e] hover:bg-[#115e59] text-white typo-paragraph-small-semibold px-4 h-9 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#99f6e4]"
              >
                <PlusIcon />
                <span className="hidden sm:inline">Post Request</span>
                <span className="sm:hidden">Post</span>
              </button>
              <div className="flex items-center gap-2 pl-3 border-l border-[#e9e9e7]">
                <Avatar src={CURRENT_USER.avatar} name={CURRENT_USER.name} size={32} />
                <span className="typo-paragraph-small-semibold text-[#252522] hidden md:inline">{CURRENT_USER.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── Hero ── */}
        <div className="bg-white border-b border-[#e9e9e7]">
          <div className="max-w-[1280px] mx-auto px-6 py-8 md:py-12">
            <div className="max-w-2xl">
              <p className="typo-paragraph-mini-semibold text-[#0f766e] uppercase tracking-widest mb-3">
                Coaching Marketplace · MVP
              </p>
              <h1 className="font-heading text-3xl md:text-4xl font-semibold text-[#252522] leading-tight tracking-tight">
                Backers post what they want to learn.{" "}
                <span className="text-[#0f766e]">Creators bid with their expertise.</span>
              </h1>
              <p className="typo-paragraph text-[#6f6f6a] mt-3 leading-relaxed">
                Buyer-led 1-on-1 coaching — budget set upfront, creators compete on quality. Secured by escrow.
              </p>
            </div>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="bg-white border-b border-[#e9e9e7]">
          <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveFilter(null)}
              className={`typo-paragraph-mini-semibold px-3 py-1.5 rounded-full border transition-colors ${
                !activeFilter
                  ? "bg-[#0f766e] text-white border-[#0f766e]"
                  : "bg-white text-[#6f6f6a] border-[#e9e9e7] hover:border-[#0d9488]/40 hover:text-[#252522]"
              }`}
            >
              All requests
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(activeFilter === tag ? null : tag)}
                className={`typo-paragraph-mini-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  activeFilter === tag
                    ? "bg-[#0f766e] text-white border-[#0f766e]"
                    : `${tagColor(tag)} hover:opacity-80`
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="max-w-[1280px] mx-auto px-6 py-6 pb-16">
          <p className="typo-paragraph-mini text-[#afafab] mb-4">
            {filtered.length} open request{filtered.length !== 1 ? "s" : ""}
            {activeFilter ? ` · filtered by "${activeFilter}"` : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r) => (
              <CoachingCard
                key={r.id}
                request={r}
                onBid={setBidTarget}
                onViewBids={setBidsTarget}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
