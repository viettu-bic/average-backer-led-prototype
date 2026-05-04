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

// ─── SVG icons ────────────────────────────────────────────────────────────────
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
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
      className="rounded-full object-cover bg-indigo-100 flex-shrink-0"
      onError={(e) => {
        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=${size}`;
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg">{children}</div>
    </div>
  );
}

// ─── Coaching Card ────────────────────────────────────────────────────────────
function CoachingCard({
  request,
  onJoin,
  onViewApplicants,
}: {
  request: CoachingRequest;
  onJoin: (r: CoachingRequest) => void;
  onViewApplicants: (r: CoachingRequest) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200 flex flex-col overflow-hidden group">
      {request.isOwn && (
        <div className="bg-indigo-600 text-white text-xs font-semibold px-4 py-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-white rounded-full" />
          Your Request
        </div>
      )}

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header */}
        <div className="flex gap-3 items-start">
          <Avatar src={request.backerAvatar} name={request.backerName} size={44} />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">
              {request.title}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{request.backerHandle}</p>
          </div>
          <span className="text-xl font-bold text-indigo-600 flex-shrink-0">
            ${request.price}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {request.tags.map((tag) => (
            <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColor(tag)}`}>
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <ClockIcon />
            {request.coachingDuration} min
          </span>
          <span className="flex items-center gap-1 text-amber-600 font-medium">
            <ClockIcon />
            {request.remainingTime} left
          </span>
          {request.isOwn && request.applicants && (
            <span className="ml-auto text-indigo-600 font-semibold">
              {request.applicants.length} applicant{request.applicants.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Action */}
        <button
          onClick={() => request.isOwn ? onViewApplicants(request) : onJoin(request)}
          className={`mt-auto w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
            request.isOwn
              ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow"
          }`}
        >
          {request.isOwn ? "View Applicants" : "Join Coaching"}
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
      "I'm learning Python for data analysis and machine learning. Seeking a mentor who can guide me through NumPy, Pandas, and sklearn. Weekly sessions with mini-projects would be ideal. I'm comfortable with the basics but need direction.",
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
      coachingDuration: parseInt(form.duration),
      price: parseInt(form.price),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      isOwn: true,
      applicants: [],
    };
    onSubmit(newRequest);
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Create Coaching Request</h2>
              <p className="text-indigo-200 text-sm mt-0.5">Find the perfect coach for your goals</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <XIcon />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Title *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              placeholder="What do you want to learn?"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
              placeholder="Describe your goals, current level, and what you're looking for..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Session Duration
              </label>
              <select
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Budget (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                <input
                  type="number"
                  min={5}
                  max={999}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              placeholder="e.g. python, beginner, data science"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors mt-2"
          >
            Post Request
          </button>
        </form>
      </div>
    </Modal>
  );
}

// ─── Join Coaching Modal ──────────────────────────────────────────────────────
function JoinModal({
  request,
  onClose,
  onSubmit,
}: {
  request: CoachingRequest;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [why, setWhy] = useState(
    "I'm very interested in this coaching opportunity. Based on my background and experience, I believe I'd be a great fit and can help you achieve your goals efficiently. Looking forward to working with you!"
  );

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Join Coaching Session</h2>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <XIcon />
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
          {/* Request info */}
          <div className="bg-gray-50 rounded-xl p-4 flex gap-3">
            <Avatar src={request.backerAvatar} name={request.backerName} size={40} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm leading-snug">{request.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{request.backerHandle}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><ClockIcon />{request.coachingDuration} min</span>
                <span className="text-indigo-600 font-bold">${request.price}</span>
                <span className="flex items-center gap-1 text-amber-600"><ClockIcon />{request.remainingTime} left</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Request Details</p>
            <p className="text-sm text-gray-600 leading-relaxed">{request.description}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {request.tags.map((tag) => (
              <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColor(tag)}`}>
                {tag}
              </span>
            ))}
          </div>

          {/* Why input */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Why do you want to join? <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </label>
            <textarea
              rows={4}
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
              placeholder="Tell the backer why you'd be a great coach for them..."
            />
          </div>

          <button
            onClick={onSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Submit Application
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Applicants Modal ─────────────────────────────────────────────────────────
function ApplicantsModal({
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
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Applicants</h2>
              <p className="text-indigo-200 text-sm mt-0.5 line-clamp-1">{request.title}</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <XIcon />
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
          {(!request.applicants || request.applicants.length === 0) ? (
            <p className="text-center text-gray-400 py-8 text-sm">No applicants yet. Check back soon!</p>
          ) : (
            request.applicants.map((applicant) => (
              <div key={applicant.id} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 hover:border-indigo-200 transition-colors">
                <div className="flex gap-3 items-start">
                  <Avatar src={applicant.avatar} name={applicant.name} size={44} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{applicant.name}</p>
                    <p className="text-xs text-gray-400">{applicant.handle}</p>
                    <p className="text-xs text-indigo-600 font-medium mt-0.5">{applicant.specialty}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
                      <StarIcon />
                      {applicant.rating}
                    </span>
                    <span className="text-xs text-gray-400">{applicant.sessionsCompleted} sessions</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3 italic">
                  "{applicant.message}"
                </p>

                <button
                  onClick={() => onAccept(applicant)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Accept
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
  backerName,
  onJoinNow,
  onDismiss,
}: {
  backerName: string;
  onJoinNow: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 animate-slide-down">
      <div className="bg-white border border-emerald-200 rounded-2xl shadow-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 text-emerald-600">
          <CheckCircleIcon />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">
            🎉 {backerName} accepted your request!
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Your coaching session is ready to start</p>
        </div>
        <button
          onClick={onJoinNow}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors flex-shrink-0"
        >
          Join Now
        </button>
        <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-1">
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
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl shadow-lg p-4 flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
        <p className="text-sm text-indigo-700 font-medium">
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
  const [joinTarget, setJoinTarget] = useState<CoachingRequest | null>(null);
  const [applicantsTarget, setApplicantsTarget] = useState<CoachingRequest | null>(null);
  const [pending, setPending] = useState<{ request: CoachingRequest; applicant?: Applicant } | null>(null);
  const [accepted, setAccepted] = useState<{ request: CoachingRequest; applicant?: Applicant } | null>(null);

  // All unique tags across all requests
  const allTags = Array.from(new Set(requests.flatMap((r) => r.tags)));

  const filteredRequests = activeFilter
    ? requests.filter((r) => r.tags.includes(activeFilter))
    : requests;

  // After 5s pending → accepted
  useEffect(() => {
    if (!pending) return;
    const timer = setTimeout(() => {
      setAccepted(pending);
      setPending(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [pending]);

  const handleJoinSubmit = useCallback(() => {
    if (!joinTarget) return;
    setPending({ request: joinTarget });
    setJoinTarget(null);
  }, [joinTarget]);

  const handleAcceptApplicant = useCallback(
    (applicant: Applicant) => {
      if (!applicantsTarget) return;
      const request = applicantsTarget;
      const creator = {
        id: applicant.id,
        name: applicant.name,
        handle: applicant.handle,
        avatar: applicant.avatar,
        specialty: applicant.specialty,
        rating: applicant.rating,
        sessionsCompleted: applicant.sessionsCompleted,
      };
      const session: StoredSession = { requestId: request.id, request, creator };
      localStorage.setItem("coachingSession", JSON.stringify(session));
      setApplicantsTarget(null);
      router.push(`/session/${request.id}`);
    },
    [applicantsTarget, router]
  );

  const handleJoinNow = useCallback(() => {
    if (!accepted) return;
    const { request, applicant } = accepted;

    const creator = applicant
      ? {
          id: applicant.id,
          name: applicant.name,
          handle: applicant.handle,
          avatar: applicant.avatar,
          specialty: applicant.specialty,
          rating: applicant.rating,
          sessionsCompleted: applicant.sessionsCompleted,
        }
      : {
          id: CURRENT_USER.id,
          name: CURRENT_USER.name,
          handle: CURRENT_USER.handle,
          avatar: CURRENT_USER.avatar,
          specialty: CURRENT_USER.specialty,
          rating: CURRENT_USER.rating,
          sessionsCompleted: CURRENT_USER.sessionsCompleted,
        };

    const session: StoredSession = { requestId: request.id, request, creator };
    localStorage.setItem("coachingSession", JSON.stringify(session));
    setAccepted(null);
    router.push(`/session/${request.id}`);
  }, [accepted, router]);

  const handleAddRequest = useCallback((r: CoachingRequest) => {
    setRequests((prev) => [r, ...prev]);
  }, []);

  const pendingName = pending?.applicant
    ? pending.applicant.name
    : pending?.request.backerName ?? "";

  const acceptedName = accepted?.applicant
    ? accepted.applicant.name
    : accepted?.request.backerName ?? "";

  return (
    <>
      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translate(-50%, -16px); }
          to   { opacity: 1; transform: translate(-50%, 0);     }
        }
        .animate-slide-down { animation: slide-down 0.3s ease forwards; }
      `}</style>

      {/* Pending / Accept banners */}
      {pending && <PendingBanner name={pendingName} />}
      {accepted && (
        <AcceptAlert
          backerName={acceptedName}
          onJoinNow={handleJoinNow}
          onDismiss={() => setAccepted(null)}
        />
      )}

      {/* Modals */}
      {showCreate && (
        <CreateModal onClose={() => setShowCreate(false)} onSubmit={handleAddRequest} />
      )}
      {joinTarget && (
        <JoinModal
          request={joinTarget}
          onClose={() => setJoinTarget(null)}
          onSubmit={handleJoinSubmit}
        />
      )}
      {applicantsTarget && (
        <ApplicantsModal
          request={applicantsTarget}
          onClose={() => setApplicantsTarget(null)}
          onAccept={handleAcceptApplicant}
        />
      )}

      {/* Page */}
      <div className="min-h-screen bg-gray-50">
        {/* Nav */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-lg tracking-tight">CoachMatch</span>
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold ml-1">
                Backer-Led
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                <PlusIcon />
                Create Request
              </button>
              <Avatar src={CURRENT_USER.avatar} name={CURRENT_USER.name} size={36} />
            </div>
          </div>
        </header>

        {/* Hero */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Find your next{" "}
              <span className="text-indigo-600">coaching session</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Backers post what they want to learn. Creators apply with their expertise. One session. Real results.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveFilter(null)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                !activeFilter
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(activeFilter === tag ? null : tag)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  activeFilter === tag
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : `${tagColor(tag)} hover:opacity-80`
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <p className="text-xs text-gray-400 mb-4 font-medium">
            {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""}
            {activeFilter ? ` tagged "${activeFilter}"` : " available"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.map((request) => (
              <CoachingCard
                key={request.id}
                request={request}
                onJoin={setJoinTarget}
                onViewApplicants={setApplicantsTarget}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
