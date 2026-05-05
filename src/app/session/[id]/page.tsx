"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StoredSession } from "@/lib/mockData";

// ─── Icons ────────────────────────────────────────────────────────────────────
function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="15 18 9 12 15 6" />
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
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function VideoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  );
}
function MonitorIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

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

// ─── Trust badge ──────────────────────────────────────────────────────────────
function TrustBadge({ score, sessions }: { score: number; sessions: number }) {
  if (sessions < 3) return <span className="typo-paragraph-mini-semibold bg-[#fffbeb] text-[#d97706] border border-[#f59e0b] px-2 py-0.5 rounded-full">New Coach</span>;
  if (score >= 80) return <span className="typo-paragraph-mini-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#22c55e] px-2 py-0.5 rounded-full">★ Top Rated</span>;
  return <span className="typo-paragraph-mini-semibold bg-[#f3f3f2] text-[#6f6f6a] border border-[#e9e9e7] px-2 py-0.5 rounded-full">Score {score}</span>;
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 64 }: { src: string; name: string; size?: number }) {
  return (
    <img
      src={src} alt={name} width={size} height={size}
      style={{ width: size, height: size }}
      className="rounded-full object-cover bg-[#f0fdfa] flex-shrink-0 ring-2 ring-white shadow-sm"
      onError={(e) => {
        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f766e&color=fff&size=${size * 2}`;
      }}
    />
  );
}

// ─── Profile Card ─────────────────────────────────────────────────────────────
function ProfileCard({
  avatar, name, handle, specialty, rating, sessions, trustScore, role,
}: {
  avatar: string; name: string; handle: string; specialty: string;
  rating: number; sessions: number; trustScore: number;
  role: "Coachee" | "Coach";
}) {
  const isBacker = role === "Coachee";
  return (
    <div className="bg-white rounded-lg border border-[#e9e9e7] shadow p-5 flex flex-col items-center text-center gap-3 flex-1">
      <div className="relative">
        <Avatar src={avatar} name={name} size={64} />
        <span className={`absolute -bottom-1 -right-1 typo-paragraph-mini-semibold px-2 py-0.5 rounded-full text-white ${isBacker ? "bg-[#0f766e]" : "bg-[#16a34a]"}`}>
          {role}
        </span>
      </div>
      <div>
        <p className="typo-paragraph-semibold text-[#252522]">{name}</p>
        <p className="typo-paragraph-mini text-[#6f6f6a]">{handle}</p>
        <p className="typo-paragraph-mini-semibold text-[#0f766e] mt-1 leading-snug">{specialty}</p>
      </div>
      <div className="w-full pt-3 border-t border-[#f3f3f2] flex flex-col gap-2">
        {!isBacker && (
          <div className="flex justify-center">
            <TrustBadge score={trustScore} sessions={sessions} />
          </div>
        )}
        <div className="flex items-center justify-center gap-4 typo-paragraph-mini text-[#6f6f6a]">
          <span className="flex items-center gap-1 text-[#d97706] font-semibold"><StarIcon />{rating.toFixed(1)}</span>
          <span className="flex items-center gap-1"><UsersIcon />{sessions} sessions</span>
          {!isBacker && (
            <span className="flex items-center gap-1 text-[#0f766e] font-semibold"><ShieldIcon />{trustScore}/100</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function Timer({ remaining }: { remaining: number }) {
  const clamped = Math.max(0, remaining);
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = clamped % 60;
  const fmt = (n: number) => String(n).padStart(2, "0");
  const done = remaining <= 0;

  return (
    <div className="flex flex-col items-center gap-1">
      <p className="typo-paragraph-mini-semibold text-white/60 uppercase tracking-widest mb-1">Time remaining</p>
      <div className={`flex items-center gap-1 font-mono text-5xl font-bold tracking-widest ${done ? "text-red-300" : "text-white"}`}>
        {h > 0 && <><span>{fmt(h)}</span><span className="text-white/30 text-4xl">:</span></>}
        <span>{fmt(m)}</span>
        <span className="text-white/30 text-4xl">:</span>
        <span>{fmt(s)}</span>
      </div>
      {done && <span className="typo-paragraph-mini-semibold text-red-300 uppercase tracking-wide mt-1">Session time ended</span>}
    </div>
  );
}

// ─── Google Meet icon ─────────────────────────────────────────────────────────
function MeetIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 75 65" fill="none">
      <rect x="0" y="3" width="50" height="59" rx="6" fill="#1a73e8" />
      <path d="M50 22l18-14v49L50 43V22z" fill="#34a853" />
      <rect x="10" y="16" width="30" height="8" rx="2" fill="#fff" opacity="0.25" />
      <rect x="10" y="30" width="30" height="20" rx="2" fill="#fff" opacity="0.15" />
    </svg>
  );
}

// ─── Session Page ─────────────────────────────────────────────────────────────
export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [session, setSession] = useState<StoredSession | null>(null);
  const [joined, setJoined] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(true);

  const JOINED_KEY = `coachingSession_joinedAt_${id}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem("coachingSession");
      if (raw) {
        const data: StoredSession = JSON.parse(raw);
        if (data.requestId === id) {
          setSession(data);
          const storedAt = localStorage.getItem(JOINED_KEY);
          if (storedAt) {
            const elapsed = Math.floor((Date.now() - parseInt(storedAt)) / 1000);
            setRemaining(data.request.coachingDuration * 60 - elapsed);
            setJoined(true);
          }
        }
      }
    } catch { /* ignore */ }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!joined || !session) return;
    const interval = setInterval(() => {
      const storedAt = localStorage.getItem(JOINED_KEY);
      if (!storedAt) return;
      const elapsed = Math.floor((Date.now() - parseInt(storedAt)) / 1000);
      setRemaining(session.request.coachingDuration * 60 - elapsed);
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joined, session]);

  const handleJoin = useCallback(() => {
    window.open("about:blank", "_blank");
    if (!localStorage.getItem(JOINED_KEY)) {
      localStorage.setItem(JOINED_KEY, Date.now().toString());
      if (session) setRemaining(session.request.coachingDuration * 60);
    }
    setJoined(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f6] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0f766e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#f7f7f6] flex flex-col items-center justify-center gap-4">
        <p className="typo-paragraph text-[#6f6f6a]">Session not found.</p>
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-[#0f766e] hover:text-[#115e59] typo-paragraph-small-semibold transition-colors"
        >
          <ArrowLeftIcon />
          Back to Marketplace
        </button>
      </div>
    );
  }

  const { request, creator } = session;

  return (
    <div className="min-h-screen bg-[#f7f7f6]">
      {/* ── Nav ── */}
      <header className="bg-white border-b border-[#e9e9e7] sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-[#6f6f6a] hover:text-[#252522] typo-paragraph-small-medium transition-colors"
          >
            <ArrowLeftIcon />
            Marketplace
          </button>
          <div className="h-4 w-px bg-[#e9e9e7]" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#0f766e] rounded-md flex items-center justify-center">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              </svg>
            </div>
            <span className="font-heading font-semibold text-[#252522] text-sm">CoachMatch</span>
          </div>
          <div className="ml-auto">
            <span className={`typo-paragraph-mini-semibold px-2.5 py-1 rounded-full ${
              joined
                ? "bg-[#f0fdf4] text-[#16a34a] border border-[#22c55e]"
                : "bg-[#fffbeb] text-[#d97706] border border-[#f59e0b]"
            }`}>
              {joined ? "● Live" : "● Ready"}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col gap-5">

        {/* ── Request details card ── */}
        <div className="bg-white rounded-lg border border-[#e9e9e7] shadow p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="typo-paragraph-mini-semibold bg-[#f0fdfa] text-[#0f766e] border border-[#0d9488]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldIcon />
              Session Confirmed
            </span>
          </div>

          <h1 className="font-heading text-2xl font-semibold text-[#252522] leading-snug">
            {request.title}
          </h1>
          <p className="typo-paragraph text-[#6f6f6a] mt-3 leading-relaxed">{request.description}</p>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {request.tags.map((tag) => (
              <span key={tag} className={`typo-paragraph-mini-semibold px-2 py-0.5 rounded-full ${tagColor(tag)}`}>
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-[#f3f3f2]">
            <div className="text-center">
              <p className="typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide">Duration</p>
              <p className="typo-heading-4 text-[#252522] mt-1 flex items-center justify-center gap-1.5">
                <ClockIcon />{request.coachingDuration} min
              </p>
            </div>
            <div className="text-center">
              <p className="typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide">Session Fee</p>
              <p className="typo-heading-4 text-[#0f766e] mt-1">${request.price}</p>
            </div>
            <div className="text-center">
              <p className="typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide">Format</p>
              <p className="typo-heading-4 text-[#252522] mt-1 flex items-center justify-center gap-1.5">
                <VideoIcon />1-on-1
              </p>
            </div>
          </div>
        </div>

        {/* ── Participants ── */}
        <div>
          <p className="typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-3">
            Participants
          </p>
          <div className="flex gap-4">
            <ProfileCard
              avatar={request.backerAvatar}
              name={request.backerName}
              handle={request.backerHandle}
              specialty={request.backerBio}
              rating={4.8}
              sessions={23}
              trustScore={78}
              role="Coachee"
            />
            <ProfileCard
              avatar={creator.avatar}
              name={creator.name}
              handle={creator.handle}
              specialty={creator.specialty}
              rating={creator.rating}
              sessions={creator.sessionsCompleted}
              trustScore={creator.trustScore}
              role="Coach"
            />
          </div>
        </div>

        {/* ── Join panel ── */}
        <div className={`rounded-lg p-8 transition-colors duration-500 ${
          joined ? "bg-[#052e16]" : "bg-[#0f766e]"
        }`}>
          <div className="flex flex-col items-center gap-6 text-center">
            {joined ? (
              <>
                <Timer remaining={remaining} />
                <p className="typo-paragraph-small text-white/60">
                  Your Google Meet session is open in a new tab
                </p>
                <button
                  onClick={handleJoin}
                  className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white typo-paragraph-small-semibold px-6 py-3 rounded-md transition-colors border border-white/20"
                >
                  <MeetIcon size={20} />
                  Rejoin Meeting
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <MeetIcon size={52} />
                  <div className="text-left">
                    <p className="font-heading text-2xl font-semibold text-white">Google Meet Ready</p>
                    <p className="typo-paragraph-small text-teal-200 mt-1">Your private coaching room is set up</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 typo-paragraph-small text-white/60 flex-wrap justify-center">
                  <span className="flex items-center gap-1.5"><ClockIcon />{request.coachingDuration} min session</span>
                  <span className="flex items-center gap-1.5"><ShieldIcon />Encrypted & private</span>
                  <span className="flex items-center gap-1.5"><MonitorIcon />Screen share available</span>
                </div>

                <button
                  onClick={handleJoin}
                  className="flex items-center gap-3 bg-white text-[#0f766e] typo-paragraph-semibold px-8 py-4 rounded-md hover:bg-teal-50 transition-colors shadow-lg"
                >
                  <MeetIcon size={24} />
                  Join Google Meet
                </button>
                <p className="typo-paragraph-mini text-white/40">
                  Timer starts when you join. Opens in a new tab.
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Session notes ── */}
        <div className="bg-white rounded-lg border border-[#e9e9e7] shadow p-5">
          <h3 className="typo-paragraph-semibold text-[#252522] mb-3">Session Guidelines</h3>
          <ul className="flex flex-col gap-2.5">
            {[
              "Join a few minutes early to test your audio and video settings.",
              "Have your goals and questions ready before the session starts.",
              "Payment is held in escrow and released after you mark the session complete.",
              "You can rate and leave a review for the coach within 48 hours post-session.",
              "If anything goes wrong, use the Raise Dispute option within 48 hours.",
            ].map((note, i) => (
              <li key={i} className="flex items-start gap-2.5 typo-paragraph-small text-[#6f6f6a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488] mt-1.5 flex-shrink-0" />
                {note}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
