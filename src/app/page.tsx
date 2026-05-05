"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MOCK_REQUESTS,
  MOCK_YOUR_BIDS,
  CURRENT_USER,
  CoachingRequest,
  Applicant,
  YourBid,
  ChatMessage,
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
function tagColor(t: string) {
  let h = 0; for (const c of t) h = (h * 31 + c.charCodeAt(0)) % TAG_PALETTES.length;
  return TAG_PALETTES[h];
}

// ─── Format datetime-local → readable ────────────────────────────────────────
function fmtDT(v: string) {
  if (!v) return "TBD";
  try {
    const d = new Date(v);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) +
      " · " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  } catch { return v; }
}

// ─── Trust badge ──────────────────────────────────────────────────────────────
function TrustBadge({ score, sessions }: { score: number; sessions: number }) {
  if (sessions < 3) return <span className="typo-paragraph-mini-semibold bg-[#fffbeb] text-[#d97706] border border-[#f59e0b] px-2 py-0.5 rounded-full">New Coach</span>;
  if (score >= 80) return <span className="typo-paragraph-mini-semibold bg-[#f0fdf4] text-[#16a34a] border border-[#22c55e] px-2 py-0.5 rounded-full">★ Top Rated</span>;
  return <span className="typo-paragraph-mini-semibold bg-[#f3f3f2] text-[#6f6f6a] border border-[#e9e9e7] px-2 py-0.5 rounded-full">Score {score}</span>;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 14, className = "" }: { d: string; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d={d} />
  </svg>
);
function ClockIcon({ size = 13 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
}
function CalendarIcon({ size = 13 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function ChatBubbleIcon({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
}
function BidIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
}
function StarIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}
function UsersIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
function XIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
}
function PlusIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
function CheckIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
}
function VideoIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>;
}
function UploadIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>;
}
function LinkIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>;
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 40 }: { src: string; name: string; size?: number }) {
  return (
    <img src={src} alt={name} width={size} height={size}
      style={{ width: size, height: size }}
      className="rounded-full object-cover bg-[#f0fdfa] flex-shrink-0"
      onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f766e&color=fff&size=${size * 2}`; }}
    />
  );
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ children, onClose, zClass = "z-50" }: { children: React.ReactNode; onClose: () => void; zClass?: string }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div className={`fixed inset-0 ${zClass} flex items-center justify-center p-4`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg">{children}</div>
    </div>
  );
}

const inputCls = "w-full bg-white border border-[#e9e9e7] rounded-md px-3 py-2 typo-paragraph-small text-[#252522] placeholder:text-[#afafab] focus:outline-none focus:ring-[3px] focus:ring-[#99f6e4] focus:border-[#0d9488] transition-shadow";

// ─── Chat Modal ───────────────────────────────────────────────────────────────
function ChatModal({ title, messages, myRole, onClose }: {
  title: string; messages: ChatMessage[]; myRole: "backer" | "creator"; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-[#0f766e] px-5 py-4 flex items-center justify-between">
          <div>
            <p className="font-heading font-semibold text-white">Chat</p>
            <p className="typo-paragraph-mini text-teal-200 mt-0.5 line-clamp-1">{title}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><XIcon /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-h-80 bg-[#f7f7f6]">
          {messages.length === 0 ? (
            <p className="text-center typo-paragraph-small text-[#afafab] py-8">No messages yet. Start the conversation!</p>
          ) : messages.map((msg) => {
            const isMe = msg.sender === myRole;
            return (
              <div key={msg.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`max-w-[80%] flex flex-col gap-0.5 ${isMe ? "items-end" : "items-start"}`}>
                  <span className="typo-paragraph-mini text-[#afafab]">{msg.senderName} · {msg.time}</span>
                  <div className={`px-3 py-2 rounded-lg typo-paragraph-small leading-relaxed ${isMe ? "bg-[#0f766e] text-white rounded-tr-none" : "bg-white text-[#252522] border border-[#e9e9e7] rounded-tl-none"}`}>
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-[#e9e9e7] p-3 flex gap-2 bg-white">
          <input type="text" placeholder="Type a message… (not available in prototype)" disabled className="flex-1 bg-[#f7f7f6] border border-[#e9e9e7] rounded-md px-3 py-2 typo-paragraph-small text-[#afafab] placeholder:text-[#afafab] cursor-not-allowed" />
          <button disabled className="bg-[#e9e9e7] text-[#afafab] typo-paragraph-small-semibold px-4 py-2 rounded-md cursor-not-allowed">Send</button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Request Modal ─────────────────────────────────────────────────────
function CreateModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (r: CoachingRequest) => void }) {
  const [form, setForm] = useState({ title: "Looking for a Python & data science mentor", description: "I'm learning Python for data analysis and ML. Seeking a mentor to guide me through NumPy, Pandas, and sklearn with mini-projects.", duration: "60", price: "75", tags: "python, data science, machine learning, beginner" });
  const [times, setTimes] = useState<string[]>(["2026-05-14T10:00"]);
  const [biddingHours, setBiddingHours] = useState(48);

  const addTime = () => setTimes([...times, ""]);
  const removeTime = (i: number) => setTimes(times.filter((_, idx) => idx !== i));
  const updateTime = (i: number, v: string) => setTimes(times.map((t, idx) => idx === i ? v : t));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      id: Date.now().toString(), title: form.title, description: form.description,
      backerName: CURRENT_USER.name, backerHandle: CURRENT_USER.handle, backerAvatar: CURRENT_USER.avatar,
      backerBio: CURRENT_USER.specialty, remainingTime: "7d 0h", postedAt: "just now",
      coachingDuration: parseInt(form.duration), price: parseInt(form.price),
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      status: "open", bidCount: 0, isOwn: true, ownRequestStatus: "bid_receiving",
      biddingTimeHours: biddingHours,
      biddingDeadline: `${biddingHours}h 0m`, applicants: [],
      expectedTimes: times.filter(Boolean),
    });
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-[#0f766e] px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold">Post a Coaching Request</h2>
              <p className="text-teal-100 typo-paragraph-small mt-0.5">Describe what you want to learn and your budget</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white"><XIcon /></button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[72vh] overflow-y-auto">
          <div>
            <label className="block typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-1.5">What do you want to learn? *</label>
            <input type="text" required maxLength={80} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="e.g. I want to learn how to grow a YouTube channel" />
            <p className="typo-paragraph-mini text-[#afafab] mt-1">{form.title.length}/80</p>
          </div>

          <div>
            <label className="block typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-1.5">Describe your goals *</label>
            <textarea required rows={3} maxLength={1000} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputCls} h-auto resize-none`} />
          </div>

          {/* Expected times */}
          <div>
            <label className="block typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-1.5">
              Expected Session Times *
              <span className="ml-1 text-[#afafab] font-normal normal-case">(creators pick one)</span>
            </label>
            <div className="flex flex-col gap-2">
              {times.map((t, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="datetime-local" value={t} onChange={e => updateTime(i, e.target.value)}
                    className={`${inputCls} flex-1`} min="2026-05-01T00:00" />
                  {times.length > 1 && (
                    <button type="button" onClick={() => removeTime(i)} className="text-[#afafab] hover:text-[#dc2626] transition-colors p-1">
                      <XIcon />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addTime} className="mt-2 flex items-center gap-1.5 typo-paragraph-mini-semibold text-[#0f766e] hover:text-[#115e59] transition-colors">
              <PlusIcon />Add another time
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-1.5">Session Length</label>
              <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className={inputCls}>
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>
            <div>
              <label className="block typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-1.5">Budget (USD)</label>
              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 typo-paragraph-small text-[#6f6f6a]">$</span>
                <input type="number" min={20} max={999} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className={`${inputCls} pl-7`} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-1.5">Bid Window (hours)</label>
              <input type="number" min={12} max={168} value={biddingHours} onChange={e => setBiddingHours(parseInt(e.target.value) || 48)} className={inputCls} />
              <p className="typo-paragraph-mini text-[#afafab] mt-1">How long coaches can bid (default 48h)</p>
            </div>
            <div>
              <label className="block typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-1.5">Topic Tags</label>
              <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className={inputCls} placeholder="e.g. python, beginner" />
              <p className="typo-paragraph-mini text-[#afafab] mt-1">Comma-separated, up to 5</p>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#0f766e] hover:bg-[#115e59] text-white typo-paragraph-small-semibold py-2.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#99f6e4] mt-1">
            Post Request
          </button>
        </form>
      </div>
    </Modal>
  );
}

// ─── Bid (Submit) Modal ───────────────────────────────────────────────────────
type PitchTab = "record" | "upload" | "url";

function BidModal({ request, onClose, onSubmit }: { request: CoachingRequest; onClose: () => void; onSubmit: (timePicked: string, price: number) => void }) {
  const [timePicked, setTimePicked] = useState(request.expectedTimes?.[0] ?? "");
  const [price, setPrice] = useState(request.price);
  const [pitch, setPitch] = useState("I'm very interested and believe my background makes me a strong fit. I've helped multiple learners achieve similar goals and would bring a structured plan to our session.");
  const [pitchTab, setPitchTab] = useState<PitchTab | null>(null);
  const [pitchUrl, setPitchUrl] = useState("");

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-[#0f766e] px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold">Submit Your Bid</h2>
              <p className="text-teal-100 typo-paragraph-small mt-0.5 line-clamp-1">{request.title}</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white"><XIcon /></button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          {/* Request preview */}
          <div className="bg-[#f7f7f6] rounded-lg p-3 border border-[#e9e9e7] flex gap-3">
            <Avatar src={request.backerAvatar} name={request.backerName} size={36} />
            <div className="flex-1 min-w-0">
              <p className="typo-paragraph-small-semibold text-[#252522] leading-snug line-clamp-1">{request.title}</p>
              <p className="typo-paragraph-mini text-[#6f6f6a] mt-0.5">
                {request.backerHandle} · {request.coachingDuration} min · ${request.price} budget
                {request.biddingTimeHours && (
                  <span className="ml-1 text-[#d97706] font-semibold">· Bid window: {request.biddingTimeHours}h</span>
                )}
              </p>
            </div>
          </div>

          {/* Time pick */}
          <div>
            <label className="block typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-2">
              Pick a Session Time *
            </label>
            {request.expectedTimes && request.expectedTimes.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {request.expectedTimes.map((t) => (
                  <label key={t} className={`flex items-center gap-3 px-3 py-2.5 rounded-md border cursor-pointer transition-colors ${timePicked === t ? "border-[#0f766e] bg-[#f0fdfa]" : "border-[#e9e9e7] bg-white hover:border-[#0d9488]/40"}`}>
                    <input type="radio" name="timePick" value={t} checked={timePicked === t} onChange={() => setTimePicked(t)} className="accent-[#0f766e]" />
                    <span className={`typo-paragraph-small-semibold ${timePicked === t ? "text-[#0f766e]" : "text-[#252522]"}`}>{fmtDT(t)}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="typo-paragraph-small text-[#afafab] italic">No specific times suggested by the coachee.</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-1.5">Your Price (USD)</label>
            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 typo-paragraph-small text-[#6f6f6a]">$</span>
              <input type="number" min={5} max={999} value={price} onChange={e => setPrice(parseInt(e.target.value))} className={`${inputCls} pl-7`} />
            </div>
            <p className="typo-paragraph-mini text-[#afafab] mt-1">Coachee budget: ${request.price}</p>
          </div>

          {/* Pitch note */}
          <div>
            <label className="block typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-1.5">
              Pitch Note <span className="font-normal text-[#afafab] normal-case">(optional, 300 chars)</span>
            </label>
            <textarea rows={3} maxLength={300} value={pitch} onChange={e => setPitch(e.target.value)}
              className={`${inputCls} h-auto resize-none`}
              placeholder="Tell the backer about your experience and approach…" />
            <p className="typo-paragraph-mini text-[#afafab] mt-1">{pitch.length}/300</p>
          </div>

          {/* Pitch video */}
          <div>
            <label className="block typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-2">
              Pitch Video <span className="font-normal text-[#afafab] normal-case">(optional, 60–90s)</span>
            </label>
            {!pitchTab ? (
              <div className="flex gap-2">
                {([["record", VideoIcon, "Record"], ["upload", UploadIcon, "Upload"], ["url", LinkIcon, "YouTube URL"]] as const).map(([tab, Ic, label]) => (
                  <button key={tab} type="button" onClick={() => setPitchTab(tab as PitchTab)}
                    className="flex-1 flex flex-col items-center gap-1.5 px-3 py-3 rounded-md border border-[#e9e9e7] bg-[#f7f7f6] hover:border-[#0d9488]/40 hover:bg-[#f0fdfa] transition-colors text-[#6f6f6a] hover:text-[#0f766e]">
                    <Ic />
                    <span className="typo-paragraph-mini-semibold">{label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="border border-[#e9e9e7] rounded-lg overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-[#e9e9e7] bg-[#f7f7f6]">
                  {([["record", "Record"], ["upload", "Upload"], ["url", "YouTube URL"]] as const).map(([tab, label]) => (
                    <button key={tab} type="button" onClick={() => setPitchTab(tab as PitchTab)}
                      className={`flex-1 py-2 typo-paragraph-mini-semibold transition-colors ${pitchTab === tab ? "bg-white text-[#0f766e] border-b-2 border-[#0f766e]" : "text-[#6f6f6a] hover:text-[#252522]"}`}>
                      {label}
                    </button>
                  ))}
                </div>
                {/* Content */}
                <div className="p-4">
                  {pitchTab === "record" && (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-[#f3f3f2] rounded-full flex items-center justify-center mx-auto mb-3 text-[#afafab]"><VideoIcon /></div>
                      <p className="typo-paragraph-small text-[#252522] font-medium">Camera access required</p>
                      <p className="typo-paragraph-mini text-[#afafab] mt-1">Record a 60–90 second pitch explaining your expertise</p>
                      <button disabled type="button" className="mt-3 bg-[#e9e9e7] text-[#afafab] typo-paragraph-small-semibold px-5 py-2 rounded-md cursor-not-allowed">Start Recording</button>
                      <p className="typo-paragraph-mini text-[#afafab] mt-2 italic">Not available in this prototype</p>
                    </div>
                  )}
                  {pitchTab === "upload" && (
                    <div className="text-center py-4 border-2 border-dashed border-[#e9e9e7] rounded-md">
                      <div className="text-[#afafab] flex justify-center mb-2"><UploadIcon /></div>
                      <p className="typo-paragraph-small text-[#252522] font-medium">Drag & drop or click to upload</p>
                      <p className="typo-paragraph-mini text-[#afafab] mt-1">MP4 / MOV · 60–90s · max 100 MB</p>
                      <button disabled type="button" className="mt-3 bg-[#e9e9e7] text-[#afafab] typo-paragraph-small-semibold px-5 py-2 rounded-md cursor-not-allowed">Select Video</button>
                      <p className="typo-paragraph-mini text-[#afafab] mt-2 italic">Not available in this prototype</p>
                    </div>
                  )}
                  {pitchTab === "url" && (
                    <div>
                      <label className="typo-paragraph-mini-semibold text-[#6f6f6a] block mb-1.5">YouTube URL</label>
                      <input type="url" value={pitchUrl} onChange={e => setPitchUrl(e.target.value)} placeholder="https://youtube.com/watch?v=…" className={inputCls} />
                      <p className="typo-paragraph-mini text-[#afafab] mt-1">Link will be attached to your bid — no processing in this prototype</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => onSubmit(timePicked, price)}
            className="w-full bg-[#0f766e] hover:bg-[#115e59] text-white typo-paragraph-small-semibold py-2.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#99f6e4]">
            Submit Bid
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Bid Receiving Modal ──────────────────────────────────────────────────────
function BidReceivingModal({ request, onClose, onAccept, onOpenChat }: {
  request: CoachingRequest; onClose: () => void;
  onAccept: (a: Applicant) => void;
  onOpenChat: (msgs: ChatMessage[], creatorName: string) => void;
}) {
  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-[#0f766e] px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold">Incoming Bids</h2>
              <p className="text-teal-100 typo-paragraph-small mt-0.5 line-clamp-1">{request.title}</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white"><XIcon /></button>
          </div>
          {request.biddingDeadline && (
            <div className="mt-3 bg-white/10 rounded-md px-3 py-2 flex items-center gap-2 typo-paragraph-small-semibold">
              <ClockIcon size={14} />Bidding closes in <strong>{request.biddingDeadline}</strong>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col gap-3 max-h-[65vh] overflow-y-auto">
          {(!request.applicants || request.applicants.length === 0) ? (
            <p className="text-center typo-paragraph-small text-[#afafab] py-10">No bids yet. Check back soon!</p>
          ) : request.applicants.map((a) => (
            <div key={a.id} className="border border-[#e9e9e7] rounded-lg p-4 flex flex-col gap-3 hover:border-[#0d9488]/30 transition-colors">
              {/* Creator header */}
              <div className="flex gap-3 items-start">
                <Avatar src={a.avatar} name={a.name} size={42} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="typo-paragraph-small-semibold text-[#252522]">{a.name}</span>
                    <TrustBadge score={a.trustScore} sessions={a.sessionsCompleted} />
                  </div>
                  <p className="typo-paragraph-mini text-[#6f6f6a]">{a.handle}</p>
                  <p className="typo-paragraph-mini-semibold text-[#0f766e] mt-0.5 leading-snug">{a.specialty}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0 typo-paragraph-mini">
                  <span className="flex items-center gap-0.5 text-[#d97706] font-semibold"><StarIcon />{a.rating.toFixed(1)}</span>
                  <span className="flex items-center gap-0.5 text-[#6f6f6a]"><UsersIcon />{a.sessionsCompleted}</span>
                </div>
              </div>

              {/* Price + time */}
              <div className="bg-[#f7f7f6] rounded-md px-3 py-2 border border-[#e9e9e7] flex items-center gap-4">
                {a.price && <div><p className="typo-paragraph-mini text-[#6f6f6a]">Bid Price</p><p className="typo-paragraph-semibold text-[#0f766e]">${a.price}</p></div>}
                {a.price && a.timePicked && <div className="w-px h-8 bg-[#e9e9e7]" />}
                {a.timePicked && <div><p className="typo-paragraph-mini text-[#6f6f6a]">Time Pick</p><p className="typo-paragraph-small-semibold text-[#252522]">{a.timePicked}</p></div>}
              </div>

              {/* Pitch */}
              {a.pitch && (
                <p className="typo-paragraph-small text-[#6f6f6a] leading-relaxed bg-[#f7f7f6] rounded-md p-3 border border-[#f3f3f2] italic">
                  &ldquo;{a.pitch}&rdquo;
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => onAccept(a)} className="flex-1 bg-[#0f766e] hover:bg-[#115e59] text-white typo-paragraph-small-semibold py-2 rounded-md transition-colors">Accept</button>
                <button onClick={() => onOpenChat(a.chatHistory ?? [], a.name)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#f3f3f2] hover:bg-[#e9e9e7] text-[#252522] typo-paragraph-small-semibold py-2 rounded-md border border-[#e9e9e7] transition-colors">
                  <ChatBubbleIcon />Chat {a.chatHistory && a.chatHistory.length > 0 && <span className="bg-[#0f766e] text-white rounded-full w-4 h-4 flex items-center justify-center typo-paragraph-mini-semibold">{a.chatHistory.length}</span>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

// ─── Scheduled Modal ──────────────────────────────────────────────────────────
function ScheduledModal({ request, onClose, onOpenChat, onSimulateStart }: {
  request: CoachingRequest; onClose: () => void; onOpenChat: () => void; onSimulateStart: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-[#2563eb] px-6 py-5 text-white flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold">Session Scheduled</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white"><XIcon /></button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="bg-[#eff6ff] border border-blue-200 rounded-lg p-4 text-center">
            <p className="typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide">Confirmed For</p>
            <p className="font-heading text-2xl font-semibold text-[#2563eb] mt-1">{request.scheduledTime}</p>
          </div>
          {request.selectedCreator && (
            <div className="flex items-center gap-4">
              <div className="flex-1 flex flex-col items-center gap-2 text-center">
                <Avatar src={request.backerAvatar} name={request.backerName} size={48} />
                <div><p className="typo-paragraph-small-semibold text-[#252522]">{request.backerName}</p><p className="typo-paragraph-mini text-[#6f6f6a]">Coachee</p></div>
              </div>
              <div className="flex-shrink-0 text-[#afafab] font-bold">↔</div>
              <div className="flex-1 flex flex-col items-center gap-2 text-center">
                <Avatar src={request.selectedCreator.avatar} name={request.selectedCreator.name} size={48} />
                <div>
                  <p className="typo-paragraph-small-semibold text-[#252522]">{request.selectedCreator.name}</p>
                  <p className="typo-paragraph-mini text-[#0f766e] font-semibold">{request.selectedCreator.specialty}</p>
                  <TrustBadge score={request.selectedCreator.trustScore} sessions={request.selectedCreator.sessionsCompleted} />
                </div>
              </div>
            </div>
          )}
          <button onClick={onSimulateStart}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white typo-paragraph-small-semibold py-2.5 rounded-md transition-colors">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />Simulate: Start Session
          </button>
          <button onClick={onOpenChat} className="w-full flex items-center justify-center gap-2 bg-[#f3f3f2] hover:bg-[#e9e9e7] text-[#252522] typo-paragraph-small-semibold py-2.5 rounded-md border border-[#e9e9e7] transition-colors">
            <ChatBubbleIcon />Open Chat
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Done Modal ───────────────────────────────────────────────────────────────
function DoneModal({ request, onClose, onOpenChat }: { request: CoachingRequest; onClose: () => void; onOpenChat: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-[#16a34a] px-6 py-5 text-white flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold">Session Complete</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white"><XIcon /></button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          {request.rating && (
            <div className="text-center bg-[#f0fdf4] border border-[#22c55e] rounded-lg p-4">
              <p className="typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-2">Your Rating</p>
              <div className="flex items-center justify-center gap-1 text-2xl">{[1,2,3,4,5].map(s => <span key={s} className={s <= request.rating! ? "text-[#d97706]" : "text-[#e9e9e7]"}>★</span>)}</div>
              <p className="typo-paragraph-small text-[#16a34a] font-semibold mt-1">{request.rating}/5 stars</p>
            </div>
          )}
          {request.selectedCreator && (
            <div className="flex gap-3 items-center bg-[#f7f7f6] rounded-lg p-3 border border-[#e9e9e7]">
              <Avatar src={request.selectedCreator.avatar} name={request.selectedCreator.name} size={44} />
              <div className="flex-1 min-w-0">
                <p className="typo-paragraph-small-semibold text-[#252522]">{request.selectedCreator.name}</p>
                <p className="typo-paragraph-mini-semibold text-[#0f766e]">{request.selectedCreator.specialty}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-0.5 text-[#d97706] typo-paragraph-mini-semibold"><StarIcon />{request.selectedCreator.rating.toFixed(1)}</span>
                  <TrustBadge score={request.selectedCreator.trustScore} sessions={request.selectedCreator.sessionsCompleted} />
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 typo-paragraph-mini text-[#6f6f6a] bg-[#f7f7f6] rounded-md p-3 border border-[#e9e9e7]">
            <CalendarIcon />Held on {request.scheduledTime}
          </div>
          <button onClick={onOpenChat} className="w-full flex items-center justify-center gap-2 bg-[#f3f3f2] hover:bg-[#e9e9e7] text-[#252522] typo-paragraph-small-semibold py-2.5 rounded-md border border-[#e9e9e7] transition-colors">
            <ChatBubbleIcon />Open Chat
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Ongoing Modal ────────────────────────────────────────────────────────────
function OngoingModal({ request, onClose, onEndSession }: {
  request: CoachingRequest; onClose: () => void; onEndSession: (rating: number) => void;
}) {
  const initial = Math.max(0, (request.coachingDuration * 60) - ((request.sessionStartedMinutesAgo ?? 0) * 60));
  const [remaining, setRemaining] = useState(initial);
  const [phase, setPhase] = useState<"live" | "rating">("live");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    if (phase !== "live") return;
    const t = setInterval(() => setRemaining(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [phase]);
  const fmt = (n: number) => String(n).padStart(2, "0");
  const h = Math.floor(remaining / 3600), m = Math.floor((remaining % 3600) / 60), s = remaining % 60;

  if (phase === "rating") {
    const creatorName = request.selectedCreator?.name ?? "your coach";
    return (
      <Modal onClose={onClose}>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-[#16a34a] px-6 py-5 text-white flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold">Rate Your Coach</h2>
              <p className="text-green-100 typo-paragraph-small mt-0.5">How was your session with {creatorName}?</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white"><XIcon /></button>
          </div>
          <div className="p-6 flex flex-col gap-5">
            {request.selectedCreator && (
              <div className="flex items-center gap-3 bg-[#f7f7f6] rounded-lg p-3 border border-[#e9e9e7]">
                <Avatar src={request.selectedCreator.avatar} name={request.selectedCreator.name} size={44} />
                <div>
                  <p className="typo-paragraph-small-semibold text-[#252522]">{request.selectedCreator.name}</p>
                  <p className="typo-paragraph-mini-semibold text-[#0f766e]">{request.selectedCreator.specialty}</p>
                </div>
              </div>
            )}
            <div className="text-center">
              <p className="typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-3">Your Rating *</p>
              <div className="flex justify-center gap-2">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
                    className={`text-4xl transition-all duration-100 hover:scale-110 ${(hover || rating) >= s ? "text-[#d97706]" : "text-[#e9e9e7]"}`}>
                    ★
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="typo-paragraph-mini-semibold text-[#d97706] mt-2">
                  {["", "Poor", "Fair", "Good", "Great", "Excellent!"][rating]}
                </p>
              )}
            </div>
            <button
              onClick={() => rating > 0 && onEndSession(rating)}
              disabled={rating === 0}
              className={`w-full typo-paragraph-small-semibold py-2.5 rounded-md transition-colors ${rating > 0 ? "bg-[#16a34a] hover:bg-[#15803d] text-white" : "bg-[#e9e9e7] text-[#afafab] cursor-not-allowed"}`}>
              Submit & Complete Session
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-red-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <h2 className="font-heading text-xl font-semibold">Session Live Now</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><XIcon /></button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div className="bg-gray-950 rounded-lg p-6 text-center">
            <p className="typo-paragraph-mini-semibold text-gray-400 uppercase tracking-widest mb-2">Time Remaining</p>
            <div className={`font-mono font-bold tracking-widest text-5xl ${remaining <= 0 ? "text-red-400" : "text-white"}`}>
              {h > 0 && <>{fmt(h)}:</>}{fmt(m)}:{fmt(s)}
            </div>
            {remaining <= 0 && <p className="typo-paragraph-mini text-red-400 mt-2 uppercase tracking-wide">Session time ended</p>}
          </div>
          {request.selectedCreator && (
            <div className="flex items-center justify-center gap-6">
              {[{ avatar: request.backerAvatar, name: request.backerName, role: "Coachee" },
                { avatar: request.selectedCreator.avatar, name: request.selectedCreator.name, role: "Coach" }].map((p, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-center">
                  <Avatar src={p.avatar} name={p.name} size={52} />
                  <p className="typo-paragraph-small-semibold text-[#252522]">{p.name}</p>
                  <p className="typo-paragraph-mini text-[#6f6f6a]">{p.role}</p>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => window.open("about:blank", "_blank")}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white typo-paragraph-small-semibold py-2.5 rounded-md transition-colors">
            <VideoIcon />Rejoin Google Meet
          </button>
          <button onClick={() => setPhase("rating")}
            className="w-full flex items-center justify-center gap-2 bg-[#f3f3f2] hover:bg-[#e9e9e7] text-[#6f6f6a] typo-paragraph-small-semibold py-2.5 rounded-md border border-[#e9e9e7] transition-colors">
            Simulate: End Session
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Your Bid Modal ───────────────────────────────────────────────────────────
function YourBidModal({ bid, onClose, onOpenChat, onSimulateStart, onEndSession }: {
  bid: YourBid; onClose: () => void; onOpenChat: () => void; onSimulateStart: () => void; onEndSession: () => void;
}) {
  // Countdown for ongoing state
  const [remaining, setRemaining] = useState(bid.requestDuration * 60);
  const [confirmEnd, setConfirmEnd] = useState(false);
  useEffect(() => {
    if (bid.status !== "ongoing") return;
    const t = setInterval(() => setRemaining(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [bid.status]);
  const fmt = (n: number) => String(n).padStart(2, "0");
  const rh = Math.floor(remaining / 3600), rm = Math.floor((remaining % 3600) / 60), rs = remaining % 60;

  const headerCfg: Record<string, string> = {
    on_conversation: "bg-[#0f766e]", wait_for_reply: "bg-[#d97706]",
    scheduled: "bg-[#2563eb]", ongoing: "bg-red-600", done: "bg-[#16a34a]", backer_picked_another: "bg-[#6f6f6a]",
  };
  const titleCfg: Record<string, string> = {
    on_conversation: "Active Chat", wait_for_reply: "Bid Submitted — Waiting",
    scheduled: "Session Scheduled", ongoing: "Session Live", done: "Session Complete", backer_picked_another: "Not Selected",
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className={`px-6 py-5 text-white flex items-center justify-between ${headerCfg[bid.status]}`}>
          <h2 className="font-heading text-xl font-semibold">{titleCfg[bid.status]}</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white"><XIcon /></button>
        </div>
        <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          {/* Request */}
          <div>
            <p className="typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide mb-1.5">Request</p>
            <p className="typo-paragraph-semibold text-[#252522]">{bid.requestTitle}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">{bid.requestTags.map(t => <span key={t} className={`typo-paragraph-mini-semibold px-2 py-0.5 rounded-full ${tagColor(t)}`}>{t}</span>)}</div>
          </div>

          {/* Backer */}
          <div className="flex items-center gap-3 bg-[#f7f7f6] rounded-lg p-3 border border-[#e9e9e7]">
            <Avatar src={bid.backerAvatar} name={bid.backerName} size={36} />
            <div><p className="typo-paragraph-small-semibold text-[#252522]">{bid.backerName}</p><p className="typo-paragraph-mini text-[#6f6f6a]">{bid.backerHandle} · Coachee</p></div>
          </div>

          {/* Your bid details */}
          <div className="bg-[#f0fdfa] rounded-lg p-3 border border-[#0d9488]/20">
            <p className="typo-paragraph-mini-semibold text-[#0f766e] uppercase tracking-wide mb-2">Your Bid</p>
            <div className="flex items-center gap-4 flex-wrap">
              <div><p className="typo-paragraph-mini text-[#6f6f6a]">Price</p><p className="typo-paragraph-semibold text-[#0f766e]">${bid.price}</p></div>
              <div className="w-px h-7 bg-[#0d9488]/20" />
              <div><p className="typo-paragraph-mini text-[#6f6f6a]">Time</p><p className="typo-paragraph-small-semibold text-[#252522]">{bid.timePicked}</p></div>
              <div className="w-px h-7 bg-[#0d9488]/20" />
              <div><p className="typo-paragraph-mini text-[#6f6f6a]">Duration</p><p className="typo-paragraph-small-semibold text-[#252522]">{bid.requestDuration} min</p></div>
            </div>
          </div>

          {/* Status-specific content */}
          {bid.status === "wait_for_reply" && (
            <div className="bg-[#fffbeb] rounded-lg p-4 border border-[#f59e0b] flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-[#d97706] border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <div><p className="typo-paragraph-small-semibold text-[#d97706]">Waiting for coachee response</p><p className="typo-paragraph-mini text-[#d97706]/70 mt-0.5">Bid valid for {bid.biddingTimeHours}h · coachees typically respond within 48h</p></div>
            </div>
          )}
          {bid.status === "scheduled" && bid.scheduledTime && (
            <div className="bg-[#eff6ff] rounded-lg p-4 border border-blue-200 text-center">
              <p className="typo-paragraph-mini-semibold text-[#6f6f6a] uppercase tracking-wide">Session Confirmed For</p>
              <p className="font-heading text-xl font-semibold text-[#2563eb] mt-1">{bid.scheduledTime}</p>
            </div>
          )}
          {bid.status === "ongoing" && (
            <div className="bg-gray-950 rounded-lg p-5 text-center flex flex-col gap-2">
              <p className="typo-paragraph-mini-semibold text-gray-400 uppercase tracking-widest">Time Remaining</p>
              <div className={`font-mono font-bold text-4xl tracking-widest ${remaining <= 0 ? "text-red-400" : "text-white"}`}>
                {rh > 0 && <>{fmt(rh)}:</>}{fmt(rm)}:{fmt(rs)}
              </div>
              {remaining <= 0 && <p className="typo-paragraph-mini text-red-400 uppercase tracking-wide">Session time ended</p>}
            </div>
          )}
          {bid.status === "backer_picked_another" && (
            <div className="bg-[#f3f3f2] rounded-lg p-4 border border-[#e9e9e7] text-center">
              <p className="typo-paragraph-small-semibold text-[#6f6f6a]">The backer selected another creator</p>
              <p className="typo-paragraph-mini text-[#afafab] mt-1">This request has been filled. Consider browsing other open requests.</p>
            </div>
          )}
          {bid.status === "done" && (
            <div className="bg-[#f0fdf4] rounded-lg p-3 border border-[#22c55e] flex items-center gap-2 typo-paragraph-small text-[#16a34a] font-semibold">
              <CheckIcon />Session completed successfully
            </div>
          )}

          {/* Simulate Start — only for scheduled */}
          {bid.status === "scheduled" && (
            <button onClick={onSimulateStart}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white typo-paragraph-small-semibold py-2.5 rounded-md transition-colors">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />Simulate: Start Session
            </button>
          )}

          {/* Join Meet + End Session — for ongoing */}
          {bid.status === "ongoing" && !confirmEnd && (
            <>
              <button onClick={() => window.open("about:blank", "_blank")}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white typo-paragraph-small-semibold py-2.5 rounded-md transition-colors">
                <VideoIcon />Join Google Meet
              </button>
              <button onClick={() => setConfirmEnd(true)}
                className="w-full flex items-center justify-center gap-2 bg-[#f3f3f2] hover:bg-[#e9e9e7] text-[#6f6f6a] typo-paragraph-small-semibold py-2.5 rounded-md border border-[#e9e9e7] transition-colors">
                Simulate: End Session
              </button>
            </>
          )}
          {bid.status === "ongoing" && confirmEnd && (
            <div className="bg-[#f0fdf4] border border-[#22c55e] rounded-lg p-4 flex flex-col gap-3">
              <p className="typo-paragraph-small-semibold text-[#16a34a] text-center">Mark session as complete?</p>
              <p className="typo-paragraph-mini text-[#6f6f6a] text-center">The coachee will be asked to rate the session.</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmEnd(false)} className="flex-1 bg-[#f3f3f2] hover:bg-[#e9e9e7] text-[#252522] typo-paragraph-small-semibold py-2 rounded-md border border-[#e9e9e7] transition-colors">Cancel</button>
                <button onClick={onEndSession} className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-white typo-paragraph-small-semibold py-2 rounded-md transition-colors">Confirm Complete</button>
              </div>
            </div>
          )}

          {/* Chat button */}
          {(bid.status === "on_conversation" || bid.status === "scheduled" || bid.status === "ongoing" || bid.status === "done") && (
            <button onClick={onOpenChat} className="w-full flex items-center justify-center gap-2 bg-[#f3f3f2] hover:bg-[#e9e9e7] text-[#252522] typo-paragraph-small-semibold py-2.5 rounded-md border border-[#e9e9e7] transition-colors">
              <ChatBubbleIcon />Open Chat {bid.chatHistory && bid.chatHistory.length > 0 && `(${bid.chatHistory.length} messages)`}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

// ─── Coaching Card (Browse view) ──────────────────────────────────────────────
function CoachingCard({ request, onBid }: { request: CoachingRequest; onBid: (r: CoachingRequest) => void }) {
  return (
    <div className="bg-white rounded-lg border border-[#e9e9e7] shadow hover:shadow-md hover:border-[#0d9488]/30 transition-all duration-200 flex flex-col overflow-hidden group">
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex gap-3 items-start">
          <Avatar src={request.backerAvatar} name={request.backerName} size={40} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap"><span className="typo-paragraph-small-semibold text-[#252522] truncate">{request.backerName}</span><span className="typo-paragraph-mini text-[#6f6f6a]">{request.backerHandle}</span></div>
            <p className="typo-paragraph-mini text-[#afafab] mt-0.5">{request.postedAt}</p>
          </div>
          <span className="typo-paragraph-lg-semibold text-[#0f766e] flex-shrink-0">${request.price}</span>
        </div>
        <h3 className="typo-paragraph-semibold text-[#252522] leading-snug line-clamp-2 group-hover:text-[#0f766e] transition-colors">{request.title}</h3>
        <div className="flex flex-wrap gap-1.5">{request.tags.map(t => <span key={t} className={`typo-paragraph-mini-semibold px-2 py-0.5 rounded-full ${tagColor(t)}`}>{t}</span>)}</div>
        {request.expectedTimes && request.expectedTimes.length > 0 && (
          <div className="flex items-center gap-1.5 typo-paragraph-mini text-[#6f6f6a]">
            <CalendarIcon size={11} />
            <span>{request.expectedTimes.length} time slot{request.expectedTimes.length > 1 ? "s" : ""} available</span>
          </div>
        )}
        <div className="flex items-center gap-3 typo-paragraph-mini text-[#6f6f6a] flex-wrap">
          <span className="flex items-center gap-1"><ClockIcon />{request.coachingDuration} min</span>
          <span className="flex items-center gap-1"><BidIcon />{request.bidCount} bid{request.bidCount !== 1 ? "s" : ""}</span>
          <span className="flex items-center gap-1 text-[#d97706] font-semibold"><ClockIcon />{request.remainingTime} left</span>
        </div>
        <button onClick={() => onBid(request)}
          className="mt-auto w-full py-2 rounded-md typo-paragraph-small-semibold bg-[#0f766e] text-white hover:bg-[#115e59] transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#99f6e4]">
          Submit Bid
        </button>
      </div>
    </div>
  );
}

// ─── Own Request Card ─────────────────────────────────────────────────────────
function OwnRequestCard({ request, onOpen }: { request: CoachingRequest; onOpen: (r: CoachingRequest) => void }) {
  const cfgs = {
    bid_receiving: { badge: "Bid Receiving", badgeCls: "bg-[#f0fdfa] text-[#0f766e] border-[#0d9488]/40", btnCls: "bg-[#0f766e] hover:bg-[#115e59] text-white", btnLabel: `Review ${request.applicants?.length ?? 0} Bid${(request.applicants?.length ?? 0) !== 1 ? "s" : ""}` },
    scheduled:     { badge: "Scheduled",     badgeCls: "bg-[#eff6ff] text-[#2563eb] border-blue-200",     btnCls: "bg-[#2563eb] hover:bg-blue-700 text-white",     btnLabel: "View Details" },
    ongoing:       { badge: "● Live Now",    badgeCls: "bg-red-50 text-red-600 border-red-200",           btnCls: "bg-red-600 hover:bg-red-700 text-white",         btnLabel: "Open Session" },
    done:          { badge: "Done",          badgeCls: "bg-[#f0fdf4] text-[#16a34a] border-[#22c55e]",   btnCls: "bg-[#f3f3f2] hover:bg-[#e9e9e7] text-[#252522] border border-[#e9e9e7]", btnLabel: "View Session" },
    canceled:      { badge: "Canceled",      badgeCls: "bg-[#f3f3f2] text-[#afafab] border-[#e9e9e7]",   btnCls: "bg-[#f3f3f2] text-[#afafab] cursor-not-allowed", btnLabel: "Canceled" },
  } as const;
  const s = request.ownRequestStatus ?? "bid_receiving";
  const cfg = cfgs[s];

  return (
    <div className="bg-white rounded-lg border border-[#e9e9e7] shadow hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      <div className="bg-[#f7f7f6] border-b border-[#e9e9e7] px-4 py-1.5 flex items-center justify-between">
        <span className="typo-paragraph-mini-semibold text-[#6f6f6a]">Your Request</span>
        <span className={`typo-paragraph-mini-semibold px-2 py-0.5 rounded-full border ${cfg.badgeCls}`}>{cfg.badge}</span>
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="typo-paragraph-semibold text-[#252522] leading-snug line-clamp-2">{request.title}</h3>

        {s === "bid_receiving" && request.biddingDeadline && (
          <div className="flex items-center gap-1.5 typo-paragraph-mini text-[#d97706] font-semibold"><ClockIcon />Closes in {request.biddingDeadline}</div>
        )}
        {s === "scheduled" && request.scheduledTime && (
          <div className="flex items-center gap-1.5 typo-paragraph-mini text-[#2563eb] font-semibold"><CalendarIcon />{request.scheduledTime}</div>
        )}
        {s === "ongoing" && (
          <div className="flex items-center gap-1.5 typo-paragraph-mini text-red-600 font-semibold"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />Session in progress</div>
        )}
        {s === "done" && request.rating && (
          <div className="flex items-center gap-1">{[1,2,3,4,5].map(n => <span key={n} className={n <= request.rating! ? "text-[#d97706]" : "text-[#e9e9e7]"}>★</span>)}<span className="typo-paragraph-mini text-[#6f6f6a] ml-1">{request.rating}/5</span></div>
        )}

        <div className="flex flex-wrap gap-1.5">{request.tags.map(t => <span key={t} className={`typo-paragraph-mini-semibold px-2 py-0.5 rounded-full ${tagColor(t)}`}>{t}</span>)}</div>
        <div className="flex items-center gap-3 typo-paragraph-mini text-[#6f6f6a]">
          <span className="flex items-center gap-1"><ClockIcon />{request.coachingDuration} min</span>
          <span className="typo-paragraph-small-semibold text-[#0f766e]">${request.price}</span>
        </div>
        <button onClick={() => s !== "canceled" && onOpen(request)} disabled={s === "canceled"}
          className={`mt-auto w-full py-2 rounded-md typo-paragraph-small-semibold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#99f6e4] ${cfg.btnCls}`}>
          {cfg.btnLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Your Bid Card ────────────────────────────────────────────────────────────
function YourBidCard({ bid, onOpen }: { bid: YourBid; onOpen: (b: YourBid) => void }) {
  const cfgs = {
    on_conversation: { badge: "In Chat",        badgeCls: "bg-[#f0fdfa] text-[#0f766e] border-[#0d9488]/40", btnCls: "bg-[#0f766e] hover:bg-[#115e59] text-white",     btnLabel: "Open Chat" },
    wait_for_reply:  { badge: "Waiting",         badgeCls: "bg-[#fffbeb] text-[#d97706] border-[#f59e0b]",   btnCls: "bg-[#f3f3f2] hover:bg-[#e9e9e7] text-[#252522] border border-[#e9e9e7]", btnLabel: "View Bid" },
    scheduled:       { badge: "Scheduled",       badgeCls: "bg-[#eff6ff] text-[#2563eb] border-blue-200",     btnCls: "bg-[#2563eb] hover:bg-blue-700 text-white",       btnLabel: "View Details" },
    ongoing:         { badge: "● Live Now",      badgeCls: "bg-red-50 text-red-600 border-red-200",           btnCls: "bg-red-600 hover:bg-red-700 text-white",           btnLabel: "Open Session" },
    done:            { badge: "Completed",        badgeCls: "bg-[#f0fdf4] text-[#16a34a] border-[#22c55e]",   btnCls: "bg-[#f3f3f2] hover:bg-[#e9e9e7] text-[#252522] border border-[#e9e9e7]", btnLabel: "View Session" },
    backer_picked_another: { badge: "Not Selected", badgeCls: "bg-[#f3f3f2] text-[#afafab] border-[#e9e9e7]", btnCls: "bg-[#f3f3f2] text-[#afafab] cursor-not-allowed", btnLabel: "Request Closed" },
  } as const;
  const cfg = cfgs[bid.status];

  return (
    <div className="bg-white rounded-lg border border-[#e9e9e7] shadow hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      <div className="bg-[#f7f7f6] border-b border-[#e9e9e7] px-4 py-1.5 flex items-center justify-between">
        <span className="typo-paragraph-mini-semibold text-[#6f6f6a]">Your Bid</span>
        <span className={`typo-paragraph-mini-semibold px-2 py-0.5 rounded-full border ${cfg.badgeCls}`}>{cfg.badge}</span>
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex gap-2 items-center">
          <Avatar src={bid.backerAvatar} name={bid.backerName} size={28} />
          <span className="typo-paragraph-small-semibold text-[#252522]">{bid.backerName}</span>
          <span className="typo-paragraph-mini text-[#6f6f6a]">{bid.backerHandle}</span>
        </div>
        <h3 className="typo-paragraph-semibold text-[#252522] leading-snug line-clamp-2">{bid.requestTitle}</h3>

        {bid.status === "scheduled" && bid.scheduledTime && (
          <div className="flex items-center gap-1.5 typo-paragraph-mini text-[#2563eb] font-semibold"><CalendarIcon />{bid.scheduledTime}</div>
        )}

        <div className="bg-[#f7f7f6] rounded-md px-3 py-2 border border-[#e9e9e7] flex items-center gap-3 typo-paragraph-mini">
          <span className="typo-paragraph-small-semibold text-[#0f766e]">${bid.price}</span>
          <span className="text-[#e9e9e7]">·</span>
          <span className="flex items-center gap-1 text-[#6f6f6a]"><CalendarIcon size={11} />{bid.timePicked}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">{bid.requestTags.map(t => <span key={t} className={`typo-paragraph-mini-semibold px-2 py-0.5 rounded-full ${tagColor(t)}`}>{t}</span>)}</div>

        <button onClick={() => bid.status !== "backer_picked_another" && onOpen(bid)} disabled={bid.status === "backer_picked_another"}
          className={`mt-auto w-full py-2 rounded-md typo-paragraph-small-semibold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#99f6e4] ${cfg.btnCls}`}>
          {cfg.btnLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Notification banner ──────────────────────────────────────────────────────
type Notif =
  | { type: "bid_submitted"; requestTitle: string }
  | { type: "request_scheduled"; requestTitle: string; creatorName: string; scheduledTime: string }
  | { type: "session_live"; request: CoachingRequest }
  | { type: "session_complete"; rating?: number };

function NotifBanner({ notif, onDismiss, onAction }: { notif: Notif; onDismiss: () => void; onAction: () => void }) {
  if (notif.type === "bid_submitted") {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[80] w-full max-w-lg px-4 animate-slide-down">
        <div className="bg-white border border-[#0d9488]/40 rounded-lg shadow-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#f0fdfa] rounded-full flex items-center justify-center flex-shrink-0">
            <div className="w-4 h-4 border-2 border-[#0f766e] border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="typo-paragraph-small-semibold text-[#252522]">Bid submitted! Waiting for response.</p>
            <p className="typo-paragraph-mini text-[#6f6f6a] mt-0.5 line-clamp-1">&ldquo;{notif.requestTitle}&rdquo; · backers typically respond within 48h</p>
          </div>
          <button onClick={onAction} className="bg-[#f3f3f2] hover:bg-[#e9e9e7] text-[#252522] border border-[#e9e9e7] typo-paragraph-small-semibold px-4 py-2 rounded-md transition-colors flex-shrink-0 whitespace-nowrap">View Bid</button>
          <button onClick={onDismiss} className="text-[#afafab] hover:text-[#6f6f6a] transition-colors flex-shrink-0 ml-1"><XIcon /></button>
        </div>
      </div>
    );
  }
  if (notif.type === "request_scheduled") {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[80] w-full max-w-lg px-4 animate-slide-down">
        <div className="bg-white border border-[#2563eb] rounded-lg shadow-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#eff6ff] rounded-full flex items-center justify-center flex-shrink-0 text-[#2563eb]"><CalendarIcon size={16} /></div>
          <div className="flex-1 min-w-0">
            <p className="typo-paragraph-small-semibold text-[#252522]">Session scheduled with {notif.creatorName}!</p>
            <p className="typo-paragraph-mini text-[#6f6f6a] mt-0.5 line-clamp-1">&ldquo;{notif.requestTitle}&rdquo; · {notif.scheduledTime}</p>
          </div>
          <button onClick={onAction} className="bg-[#2563eb] hover:bg-blue-700 text-white typo-paragraph-small-semibold px-4 py-2 rounded-md transition-colors flex-shrink-0 whitespace-nowrap">View</button>
          <button onClick={onDismiss} className="text-[#afafab] hover:text-[#6f6f6a] transition-colors flex-shrink-0 ml-1"><XIcon /></button>
        </div>
      </div>
    );
  }
  if (notif.type === "session_complete") {
    const stars = notif.rating ? "★".repeat(notif.rating) + "☆".repeat(5 - notif.rating) : "";
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[80] w-full max-w-lg px-4 animate-slide-down">
        <div className="bg-white border border-[#22c55e] rounded-lg shadow-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-[#f0fdf4] rounded-full flex items-center justify-center flex-shrink-0 text-[#16a34a]"><CheckIcon /></div>
          <div className="flex-1 min-w-0">
            <p className="typo-paragraph-small-semibold text-[#252522]">Session completed! 🎉</p>
            <p className="typo-paragraph-mini text-[#6f6f6a] mt-0.5">
              {notif.rating ? <span className="text-[#d97706] font-semibold">{stars} {notif.rating}/5</span> : "Marked as done."}
            </p>
          </div>
          <button onClick={onDismiss} className="text-[#afafab] hover:text-[#6f6f6a] transition-colors flex-shrink-0"><XIcon /></button>
        </div>
      </div>
    );
  }
  // session_live
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[80] w-full max-w-lg px-4 animate-slide-down">
      <div className="bg-white border border-red-300 rounded-lg shadow-xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="typo-paragraph-small-semibold text-[#252522]">● Session is live!</p>
          <p className="typo-paragraph-mini text-[#6f6f6a] mt-0.5 line-clamp-1">{notif.request.selectedCreator?.name} joined &ldquo;{notif.request.title}&rdquo;</p>
        </div>
        <button onClick={onAction} className="bg-red-600 hover:bg-red-700 text-white typo-paragraph-small-semibold px-4 py-2 rounded-md transition-colors flex-shrink-0 whitespace-nowrap">Open Session</button>
        <button onClick={onDismiss} className="text-[#afafab] hover:text-[#6f6f6a] transition-colors flex-shrink-0 ml-1"><XIcon /></button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type ViewMode = "all" | "your_requests" | "your_bids";

export default function Home() {
  const [requests, setRequests] = useState<CoachingRequest[]>(MOCK_REQUESTS);
  const [yourBids, setYourBids] = useState<YourBid[]>(MOCK_YOUR_BIDS);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Browse modals
  const [showCreate, setShowCreate] = useState(false);
  const [bidTarget, setBidTarget] = useState<CoachingRequest | null>(null);

  // Own request modals
  const [ownModal, setOwnModal] = useState<CoachingRequest | null>(null);

  // Your bid modal
  const [bidModal, setBidModal] = useState<YourBid | null>(null);

  // Chat overlay
  const [chatCtx, setChatCtx] = useState<{ messages: ChatMessage[]; title: string; myRole: "backer" | "creator" } | null>(null);

  // Notification banner
  const [notif, setNotif] = useState<Notif | null>(null);

  // Derived lists
  const browseRequests = requests.filter(r => !r.isOwn);
  const ownRequests = requests.filter(r => r.isOwn);
  const allTags = Array.from(new Set(browseRequests.flatMap(r => r.tags)));
  const filteredBrowse = activeTag ? browseRequests.filter(r => r.tags.includes(activeTag)) : browseRequests;

  // Auto-dismiss notif after 8s
  useEffect(() => {
    if (!notif) return;
    const t = setTimeout(() => setNotif(null), 8000);
    return () => clearTimeout(t);
  }, [notif]);

  const handleBidSubmit = useCallback((timePicked: string, price: number) => {
    if (!bidTarget) return;
    const newBid: YourBid = {
      id: `bid_${Date.now()}`,
      requestTitle: bidTarget.title,
      requestDescription: bidTarget.description,
      requestTags: bidTarget.tags,
      requestDuration: bidTarget.coachingDuration,
      backerName: bidTarget.backerName,
      backerHandle: bidTarget.backerHandle,
      backerAvatar: bidTarget.backerAvatar,
      postedAt: bidTarget.postedAt,
      price,
      timePicked: timePicked ? fmtDT(timePicked) : "TBD",
      biddingTimeHours: bidTarget.biddingTimeHours ?? 48,
      status: "wait_for_reply",
    };
    setYourBids(prev => [newBid, ...prev]);
    setBidTarget(null);
    setNotif({ type: "bid_submitted", requestTitle: bidTarget.title });
    setViewMode("your_bids");
  }, [bidTarget]);

  const handleAcceptApplicant = useCallback((applicant: Applicant) => {
    if (!ownModal) return;
    const scheduledTime = applicant.timePicked ?? "TBD";
    const updatedRequest: CoachingRequest = {
      ...ownModal,
      ownRequestStatus: "scheduled",
      scheduledTime,
      selectedCreator: {
        id: applicant.id,
        name: applicant.name,
        handle: applicant.handle,
        avatar: applicant.avatar,
        specialty: applicant.specialty,
        rating: applicant.rating,
        sessionsCompleted: applicant.sessionsCompleted,
        trustScore: applicant.trustScore,
      },
    };
    setRequests(prev => prev.map(r => r.id === ownModal.id ? updatedRequest : r));
    setOwnModal(null);
    setNotif({ type: "request_scheduled", requestTitle: ownModal.title, creatorName: applicant.name, scheduledTime });
    setViewMode("your_requests");
  }, [ownModal]);

  const handleRequestEndSession = useCallback((requestId: string, rating: number) => {
    setRequests(prev => prev.map(r =>
      r.id === requestId ? { ...r, ownRequestStatus: "done" as const, rating } : r
    ));
    setOwnModal(null);
    setNotif({ type: "session_complete", rating });
  }, []);

  const handleBidEndSession = useCallback((bidId: string) => {
    setYourBids(prev => prev.map(b => b.id === bidId ? { ...b, status: "done" as const } : b));
    setBidModal(null);
    setNotif({ type: "session_complete" });
  }, []);

  const handleSimulateStart = useCallback((requestId: string) => {
    setRequests(prev => prev.map(r =>
      r.id === requestId ? { ...r, ownRequestStatus: "ongoing" as const, sessionStartedMinutesAgo: 0 } : r
    ));
    // Update ownModal to reflect new status so OngoingModal opens
    setOwnModal(prev => prev ? { ...prev, ownRequestStatus: "ongoing", sessionStartedMinutesAgo: 0 } : null);
  }, []);

  const handleBidSimulateStart = useCallback((bidId: string) => {
    setYourBids(prev => prev.map(b => b.id === bidId ? { ...b, status: "ongoing" as const } : b));
    setBidModal(prev => prev ? { ...prev, status: "ongoing" as const } : null);
  }, []);

  const openChat = useCallback((messages: ChatMessage[], title: string, myRole: "backer" | "creator") => {
    setChatCtx({ messages, title, myRole });
  }, []);

  const handleOwnOpen = useCallback((r: CoachingRequest) => {
    if (r.ownRequestStatus === "canceled") return;
    setOwnModal(r);
  }, []);

  const handleAddRequest = useCallback((r: CoachingRequest) => {
    setRequests(prev => [r, ...prev]);
    setViewMode("your_requests");
  }, []);

  return (
    <>
      <style>{`
        @keyframes slide-down { from { opacity:0; transform:translate(-50%,-12px) } to { opacity:1; transform:translate(-50%,0) } }
        .animate-slide-down { animation: slide-down 0.25s ease-out forwards; }
      `}</style>

      {/* Notification */}
      {notif && (
        <NotifBanner
          notif={notif}
          onDismiss={() => setNotif(null)}
          onAction={() => {
            if (notif.type === "bid_submitted") {
              setViewMode("your_bids");
            } else if (notif.type === "request_scheduled") {
              setViewMode("your_requests");
            } else if (notif.type === "session_complete") {
              // no-op, banner has no action button
            } else {
              setOwnModal(notif.request);
            }
            setNotif(null);
          }}
        />
      )}

      {/* Chat overlay */}
      {chatCtx && <ChatModal title={chatCtx.title} messages={chatCtx.messages} myRole={chatCtx.myRole} onClose={() => setChatCtx(null)} />}

      {/* Browse modals */}
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onSubmit={handleAddRequest} />}
      {bidTarget && <BidModal request={bidTarget} onClose={() => setBidTarget(null)} onSubmit={handleBidSubmit} />}


      {/* Own request modals */}
      {ownModal && ownModal.ownRequestStatus === "bid_receiving" && (
        <BidReceivingModal request={ownModal} onClose={() => setOwnModal(null)} onAccept={handleAcceptApplicant}
          onOpenChat={(msgs, name) => openChat(msgs, `Chat with ${name}`, "backer")} />
      )}
      {ownModal && ownModal.ownRequestStatus === "scheduled" && (
        <ScheduledModal request={ownModal} onClose={() => setOwnModal(null)}
          onOpenChat={() => openChat(ownModal.chatHistory ?? [], `Chat — ${ownModal.title}`, "backer")}
          onSimulateStart={() => handleSimulateStart(ownModal.id)} />
      )}
      {ownModal && ownModal.ownRequestStatus === "done" && (
        <DoneModal request={ownModal} onClose={() => setOwnModal(null)}
          onOpenChat={() => openChat(ownModal.chatHistory ?? [], `Chat — ${ownModal.title}`, "backer")} />
      )}
      {ownModal && ownModal.ownRequestStatus === "ongoing" && (
        <OngoingModal request={ownModal} onClose={() => setOwnModal(null)}
          onEndSession={(rating) => handleRequestEndSession(ownModal.id, rating)} />
      )}

      {/* Your bid modal */}
      {bidModal && (
        <YourBidModal bid={bidModal} onClose={() => setBidModal(null)}
          onOpenChat={() => openChat(bidModal.chatHistory ?? [], bidModal.requestTitle, "creator")}
          onSimulateStart={() => handleBidSimulateStart(bidModal.id)}
          onEndSession={() => handleBidEndSession(bidModal.id)} />
      )}

      {/* ── Page ── */}
      <div className="min-h-screen bg-[#f7f7f6]">
        {/* Nav */}
        <header className="bg-white border-b border-[#e9e9e7] sticky top-0 z-40">
          <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#0f766e] rounded-md flex items-center justify-center flex-shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" /></svg>
              </div>
              <span className="font-heading font-semibold text-[#252522] text-lg tracking-tight">SprouX Coach</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowCreate(true)}
                className="flex items-center gap-1.5 bg-[#0f766e] hover:bg-[#115e59] text-white typo-paragraph-small-semibold px-4 h-9 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#99f6e4]">
                <PlusIcon /><span className="hidden sm:inline">Post Request</span><span className="sm:hidden">Post</span>
              </button>
              <div className="flex items-center gap-2 pl-3 border-l border-[#e9e9e7]">
                <Avatar src={CURRENT_USER.avatar} name={CURRENT_USER.name} size={32} />
                <span className="typo-paragraph-small-semibold text-[#252522] hidden md:inline">{CURRENT_USER.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero */}
        <div className="bg-white border-b border-[#e9e9e7]">
          <div className="max-w-[1280px] mx-auto px-6 py-8">
            <p className="typo-paragraph-mini-semibold text-[#0f766e] uppercase tracking-widest mb-2">Coaching Marketplace · MVP</p>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-[#252522] leading-tight tracking-tight">
              Coachees post what they want to learn.{" "}
              <span className="text-[#0f766e]">Coaches apply with their expertise.</span>
            </h1>
            <p className="typo-paragraph text-[#6f6f6a] mt-2 leading-relaxed">
              Coachee-led 1-on-1 coaching — budget set upfront, coaches compete on quality. Secured by escrow.
            </p>
          </div>
        </div>

        {/* View tabs */}
        <div className="bg-white border-b border-[#e9e9e7]">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex items-center gap-0">
              {([
                ["all", `Browse (${browseRequests.length})`],
                ["your_requests", `My Requests (${ownRequests.length})`],
                ["your_bids", `My Bids (${yourBids.length})`],
              ] as const).map(([mode, label]) => (
                <button key={mode} onClick={() => { setViewMode(mode); setActiveTag(null); }}
                  className={`px-4 py-3 typo-paragraph-small-semibold border-b-2 transition-colors ${viewMode === mode ? "border-[#0f766e] text-[#0f766e]" : "border-transparent text-[#6f6f6a] hover:text-[#252522]"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tag filters (Browse only) */}
        {viewMode === "all" && (
          <div className="bg-white border-b border-[#e9e9e7]">
            <div className="max-w-[1280px] mx-auto px-6 py-2.5 flex items-center gap-2 flex-wrap">
              <button onClick={() => setActiveTag(null)}
                className={`typo-paragraph-mini-semibold px-3 py-1.5 rounded-full border transition-colors ${!activeTag ? "bg-[#0f766e] text-white border-[#0f766e]" : "bg-white text-[#6f6f6a] border-[#e9e9e7] hover:border-[#0d9488]/40"}`}>
                All
              </button>
              {allTags.map(tag => (
                <button key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`typo-paragraph-mini-semibold px-3 py-1.5 rounded-full border transition-colors ${activeTag === tag ? "bg-[#0f766e] text-white border-[#0f766e]" : `${tagColor(tag)} hover:opacity-80`}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="max-w-[1280px] mx-auto px-6 py-6 pb-16">
          {viewMode === "all" && (
            <>
              <p className="typo-paragraph-mini text-[#afafab] mb-4">{filteredBrowse.length} open request{filteredBrowse.length !== 1 ? "s" : ""}{activeTag ? ` · filtered by "${activeTag}"` : ""}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBrowse.map(r => <CoachingCard key={r.id} request={r} onBid={setBidTarget} />)}
              </div>
            </>
          )}

          {viewMode === "your_requests" && (
            <>
              <p className="typo-paragraph-mini text-[#afafab] mb-4">{ownRequests.length} request{ownRequests.length !== 1 ? "s" : ""} you posted</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ownRequests.map(r => <OwnRequestCard key={r.id} request={r} onOpen={handleOwnOpen} />)}
              </div>
            </>
          )}

          {viewMode === "your_bids" && (
            <>
              <p className="typo-paragraph-mini text-[#afafab] mb-4">{yourBids.length} bid{yourBids.length !== 1 ? "s" : ""} you submitted</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {yourBids.map(b => <YourBidCard key={b.id} bid={b} onOpen={setBidModal} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
