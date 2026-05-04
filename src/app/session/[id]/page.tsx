"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StoredSession } from "@/lib/mockData";

// ─── Icons ────────────────────────────────────────────────────────────────────
function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function BadgeCheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

// ─── Google Meet SVG icon ─────────────────────────────────────────────────────
function MeetIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 75 65" fill="none">
      <rect x="0" y="3" width="50" height="59" rx="6" fill="#1a73e8" />
      <path d="M50 22l18-14v49L50 43V22z" fill="#34a853" />
      <rect x="8" y="15" width="34" height="10" rx="2" fill="#fff" opacity="0.25" />
      <rect x="8" y="29" width="34" height="18" rx="2" fill="#fff" opacity="0.15" />
    </svg>
  );
}

// ─── Tag color hash ───────────────────────────────────────────────────────────
const TAG_PALETTES = [
  "bg-indigo-100 text-indigo-700 border border-indigo-200",
  "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "bg-violet-100 text-violet-700 border border-violet-200",
  "bg-amber-100 text-amber-700 border border-amber-200",
  "bg-pink-100 text-pink-700 border border-pink-200",
  "bg-sky-100 text-sky-700 border border-sky-200",
  "bg-teal-100 text-teal-700 border border-teal-200",
  "bg-rose-100 text-rose-700 border border-rose-200",
];

function tagColor(tag: string) {
  let h = 0;
  for (const c of tag) h = (h * 31 + c.charCodeAt(0)) % TAG_PALETTES.length;
  return TAG_PALETTES[h];
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 64 }: { src: string; name: string; size?: number }) {
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="rounded-full object-cover bg-indigo-100 flex-shrink-0 ring-4 ring-white shadow"
      onError={(e) => {
        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=${size * 2}`;
      }}
    />
  );
}

// ─── Profile Card ─────────────────────────────────────────────────────────────
function ProfileCard({
  avatar,
  name,
  handle,
  specialty,
  rating,
  sessions,
  role,
  accentColor,
}: {
  avatar: string;
  name: string;
  handle: string;
  specialty: string;
  rating: number;
  sessions: number;
  role: "Backer" | "Creator";
  accentColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-3 flex-1">
      <div className="relative">
        <Avatar src={avatar} name={name} size={72} />
        <span
          className={`absolute -bottom-1 -right-1 text-xs font-bold px-2 py-0.5 rounded-full text-white ${accentColor}`}
        >
          {role}
        </span>
      </div>
      <div>
        <p className="font-bold text-gray-900">{name}</p>
        <p className="text-xs text-gray-400">{handle}</p>
        <p className="text-xs text-indigo-600 font-medium mt-1">{specialty}</p>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-500 pt-1 border-t border-gray-50 w-full justify-center">
        <span className="flex items-center gap-1 text-amber-500 font-bold">
          <StarIcon />
          {rating.toFixed(1)}
        </span>
        <span className="flex items-center gap-1">
          <UsersIcon />
          {sessions} sessions
        </span>
      </div>
    </div>
  );
}

// ─── Timer display ────────────────────────────────────────────────────────────
function Timer({ remaining }: { remaining: number }) {
  const clamped = Math.max(0, remaining);
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = clamped % 60;
  const fmt = (n: number) => String(n).padStart(2, "0");
  const done = remaining <= 0;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`flex items-center gap-1.5 font-mono text-4xl font-bold tracking-widest ${done ? "text-red-300" : "text-white"}`}>
        {h > 0 && <>{fmt(h)}<span className="opacity-50">:</span></>}
        <span>{fmt(m)}</span>
        <span className="opacity-50">:</span>
        <span>{fmt(s)}</span>
      </div>
      {done && <span className="text-red-300 text-xs font-semibold tracking-wide uppercase">Session time ended</span>}
    </div>
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

  // Persist joinedAt so rejoin continues the same countdown
  const JOINED_KEY = `coachingSession_joinedAt_${id}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem("coachingSession");
      if (raw) {
        const data: StoredSession = JSON.parse(raw);
        if (data.requestId === id) {
          setSession(data);
          // Restore joined state if user already started the session
          const storedJoinedAt = localStorage.getItem(JOINED_KEY);
          if (storedJoinedAt) {
            const elapsed = Math.floor((Date.now() - parseInt(storedJoinedAt)) / 1000);
            const totalSecs = data.request.coachingDuration * 60;
            setRemaining(totalSecs - elapsed);
            setJoined(true);
          }
        }
      }
    } catch {
      // ignore parse errors
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!joined || !session) return;
    const interval = setInterval(() => {
      const storedJoinedAt = localStorage.getItem(JOINED_KEY);
      if (!storedJoinedAt) return;
      const elapsed = Math.floor((Date.now() - parseInt(storedJoinedAt)) / 1000);
      setRemaining(session.request.coachingDuration * 60 - elapsed);
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joined, session]);

  const handleJoin = useCallback(() => {
    window.open("about:blank", "_blank");
    // Only record start time on first join
    if (!localStorage.getItem(JOINED_KEY)) {
      localStorage.setItem(JOINED_KEY, Date.now().toString());
      if (session) setRemaining(session.request.coachingDuration * 60);
    }
    setJoined(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Session not found.</p>
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          <ArrowLeftIcon />
          Back to Marketplace
        </button>
      </div>
    );
  }

  const { request, creator } = session;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <ArrowLeftIcon />
            Back
          </button>
          <div className="h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-sm">CoachMatch</span>
          </div>
          <div className="ml-auto">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                joined
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {joined ? "● Live" : "● Ready"}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

        {/* Title card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <BadgeCheckIcon />
                  Confirmed Session
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                {request.title}
              </h1>
              <p className="text-gray-500 mt-3 text-sm leading-relaxed">{request.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {request.tags.map((tag) => (
                  <span key={tag} className={`text-xs px-2.5 py-1 rounded-full font-medium ${tagColor(tag)}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Session stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Duration</p>
              <p className="text-lg font-bold text-gray-900 mt-1 flex items-center justify-center gap-1.5">
                <ClockIcon />
                {request.coachingDuration} min
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Price</p>
              <p className="text-lg font-bold text-indigo-600 mt-1">${request.price}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Format</p>
              <p className="text-lg font-bold text-gray-900 mt-1 flex items-center justify-center gap-1.5">
                <VideoIcon />
                1-on-1
              </p>
            </div>
          </div>
        </div>

        {/* Profiles */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Session Participants
          </h2>
          <div className="flex gap-4">
            <ProfileCard
              avatar={request.backerAvatar}
              name={request.backerName}
              handle={request.backerHandle}
              specialty={request.backerBio}
              rating={4.8}
              sessions={23}
              role="Backer"
              accentColor="bg-indigo-600"
            />
            <ProfileCard
              avatar={creator.avatar}
              name={creator.name}
              handle={creator.handle}
              specialty={creator.specialty}
              rating={creator.rating}
              sessions={creator.sessionsCompleted}
              role="Creator"
              accentColor="bg-emerald-600"
            />
          </div>
        </div>

        {/* Join section */}
        <div
          className={`rounded-2xl p-6 transition-all duration-500 ${
            joined
              ? "bg-gradient-to-br from-emerald-600 to-teal-600"
              : "bg-gradient-to-br from-indigo-600 to-violet-700"
          }`}
        >
          <div className="flex flex-col items-center gap-5 text-center">
            {joined ? (
              <>
                <p className="text-emerald-100 text-sm font-medium tracking-wide uppercase">
                  Session in progress
                </p>
                <Timer remaining={remaining} />
                <p className="text-white/70 text-sm">
                  Your Google Meet session is open in a new tab
                </p>
                <button
                  onClick={handleJoin}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-white/30"
                >
                  <MeetIcon size={22} />
                  Rejoin Meeting
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <MeetIcon size={48} />
                  <div className="text-left">
                    <p className="text-white font-bold text-lg">Google Meet Ready</p>
                    <p className="text-indigo-200 text-sm">Your coaching room is set up and waiting</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-white/70 text-sm">
                  <span className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {request.coachingDuration} min session
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Encrypted & private
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    Screen share available
                  </span>
                </div>

                <button
                  onClick={handleJoin}
                  className="flex items-center gap-3 bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg text-base"
                >
                  <MeetIcon size={26} />
                  Join Google Meet
                </button>
                <p className="text-indigo-200/70 text-xs">
                  Clicking join opens your coaching session in a new tab
                </p>
              </>
            )}
          </div>
        </div>

        {/* Session notes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Session Notes</h3>
          <ul className="text-xs text-gray-500 flex flex-col gap-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
              Please join the session a few minutes early to test your audio and video.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
              Have your goals and questions ready before the session starts.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
              Payment is released to the creator after the session ends.
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
              You can rate and leave a review for the creator after the session.
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
