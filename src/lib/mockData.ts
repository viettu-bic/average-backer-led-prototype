// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  sender: "backer" | "creator";
  senderName: string;
  message: string;
  time: string;
}

export interface Applicant {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  message: string;
  specialty: string;
  rating: number;
  sessionsCompleted: number;
  trustScore: number;
  // Bid-specific fields (present when applicant submits a bid)
  price?: number;
  timePicked?: string;
  pitch?: string;
  chatHistory?: ChatMessage[];
}

export interface SelectedCreator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  specialty: string;
  rating: number;
  sessionsCompleted: number;
  trustScore: number;
}

export type RequestStatus = "open" | "matched" | "closed";
export type OwnRequestStatus = "bid_receiving" | "scheduled" | "ongoing" | "done" | "canceled";
export type BidStatus = "on_conversation" | "wait_for_reply" | "scheduled" | "ongoing" | "done" | "backer_picked_another";

export interface CoachingRequest {
  id: string;
  title: string;
  description: string;
  backerName: string;
  backerHandle: string;
  backerAvatar: string;
  backerBio: string;
  remainingTime: string;
  postedAt: string;
  coachingDuration: number;
  price: number;
  tags: string[];
  status: RequestStatus;
  bidCount: number;
  expectedTimes?: string[];
  isOwn?: boolean;
  applicants?: Applicant[];
  // Own-request lifecycle
  ownRequestStatus?: OwnRequestStatus;
  biddingDeadline?: string;
  scheduledTime?: string;
  sessionStartedMinutesAgo?: number;
  rating?: number;
  selectedCreator?: SelectedCreator;
  chatHistory?: ChatMessage[];
}

export interface YourBid {
  id: string;
  requestTitle: string;
  requestDescription: string;
  requestTags: string[];
  requestDuration: number;
  backerName: string;
  backerHandle: string;
  backerAvatar: string;
  postedAt: string;
  price: number;
  timePicked: string;
  biddingTimeHours: number;
  status: BidStatus;
  scheduledTime?: string;
  chatHistory?: ChatMessage[];
}

export interface StoredSession {
  requestId: string;
  request: CoachingRequest;
  creator: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    specialty: string;
    rating: number;
    sessionsCompleted: number;
    trustScore: number;
  };
}

// ─── Current user ─────────────────────────────────────────────────────────────

export const CURRENT_USER = {
  id: "me",
  name: "Priya Nair",
  handle: "@priyanair_dev",
  avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=priyanair",
  specialty: "Self-taught Developer & SaaS Builder",
  rating: 4.7,
  sessionsCompleted: 12,
  trustScore: 74,
};

// ─── Mock chat histories ──────────────────────────────────────────────────────

export const CHAT_DESIGN_LUCAS: ChatMessage[] = [
  { id: "1", sender: "backer", senderName: "Priya", message: "Hey Lucas! I loved your SaaS redesign case studies.", time: "Yesterday · 3:12 PM" },
  { id: "2", sender: "creator", senderName: "Lucas Ferreira", message: "Thanks Priya! I've done quite a few landing pages for similar products. What's the main conversion problem you're facing?", time: "Yesterday · 3:28 PM" },
  { id: "3", sender: "backer", senderName: "Priya", message: "The hero fold has a high bounce rate. I think the value prop isn't clear enough.", time: "Yesterday · 3:35 PM" },
  { id: "4", sender: "creator", senderName: "Lucas Ferreira", message: "Classic problem! I can help you reframe the messaging and test 2-3 layout variants. Shall we go with May 10 at 9 AM?", time: "Yesterday · 3:40 PM" },
  { id: "5", sender: "backer", senderName: "Priya", message: "Yes! That works. I'll prepare a short Loom of the current page beforehand.", time: "Yesterday · 3:44 PM" },
  { id: "6", sender: "creator", senderName: "Lucas Ferreira", message: "Perfect, that'll save us a lot of time. See you then!", time: "Yesterday · 3:46 PM" },
];

export const CHAT_DESIGN_RAVI: ChatMessage[] = [
  { id: "1", sender: "backer", senderName: "Priya", message: "Hi Ravi! Can you share some landing pages you've designed for similar SaaS tools?", time: "2d ago · 11:05 AM" },
  { id: "2", sender: "creator", senderName: "Ravi Shankar", message: "Sure! Here are 3 recent ones: [notion.so/ravi-portfolio]. All achieved >25% signup lift after redesign.", time: "2d ago · 11:22 AM" },
  { id: "3", sender: "backer", senderName: "Priya", message: "These look great, especially the analytics tool one. Your pricing feels a bit below market — is that intentional?", time: "2d ago · 11:30 AM" },
  { id: "4", sender: "creator", senderName: "Ravi Shankar", message: "Yes, I'm building my review base on CoachMatch. Happy to go deep on your project at a fair rate.", time: "2d ago · 11:38 AM" },
];

export const CHAT_SQL_SCHEDULED: ChatMessage[] = [
  { id: "1", sender: "creator", senderName: "David Park", message: "Hi Priya, confirmed for May 15 at 3 PM. Should I prepare anything specific beforehand?", time: "May 2 · 9:00 AM" },
  { id: "2", sender: "backer", senderName: "Priya", message: "Yes! I'll share the slow query log export. We have some joins that timeout past 10s.", time: "May 2 · 9:14 AM" },
  { id: "3", sender: "creator", senderName: "David Park", message: "Perfect. Share it here or via email — either works. I'll do a prelim analysis before the session.", time: "May 2 · 9:20 AM" },
  { id: "4", sender: "backer", senderName: "Priya", message: "Emailing it now. Thanks for being proactive!", time: "May 2 · 9:22 AM" },
];

export const CHAT_COPY_DONE: ChatMessage[] = [
  { id: "1", sender: "backer", senderName: "Priya", message: "Nadia, the email sequence you helped me write got a 38% open rate! Way above our usual 22%.", time: "Apr 28 · 5:01 PM" },
  { id: "2", sender: "creator", senderName: "Nadia Okafor", message: "That's amazing! The subject line A/B test really paid off. Any specific email that performed best?", time: "Apr 28 · 5:18 PM" },
  { id: "3", sender: "backer", senderName: "Priya", message: "The 'Day 3 story' email had 52% opens 🤯 I'm definitely booking another session for the onboarding sequence.", time: "Apr 28 · 5:22 PM" },
  { id: "4", sender: "creator", senderName: "Nadia Okafor", message: "Love hearing that! I'm happy to help with onboarding copy — that's where most SaaS conversions happen.", time: "Apr 28 · 5:30 PM" },
];

export const CHAT_TIKTOK_ACTIVE: ChatMessage[] = [
  { id: "1", sender: "creator", senderName: "Priya", message: "Hi! I submitted a bid on your TikTok strategy request. I've grown 3 accounts from 0 to 10k+ using the same tactics I'd share.", time: "Today · 10:05 AM" },
  { id: "2", sender: "backer", senderName: "Mei Lin", message: "Oh interesting! What niches have you worked with?", time: "Today · 10:18 AM" },
  { id: "3", sender: "creator", senderName: "Priya", message: "B2B SaaS, food/lifestyle, and one personal brand account. The hooks are different for each but the content architecture is transferable.", time: "Today · 10:23 AM" },
  { id: "4", sender: "backer", senderName: "Mei Lin", message: "That sounds exactly what I need. Are you free May 14 at 11 AM?", time: "Today · 10:31 AM" },
  { id: "5", sender: "creator", senderName: "Priya", message: "Yes, I can do May 14 at 11 AM! I'll block that slot.", time: "Today · 10:34 AM" },
];

export const CHAT_SQL_BID_SCHEDULED: ChatMessage[] = [
  { id: "1", sender: "backer", senderName: "Kevin Torres", message: "Hi Priya! I accepted your bid. Confirmed for May 16 at 11 AM. Does that still work for you?", time: "May 3 · 2:10 PM" },
  { id: "2", sender: "creator", senderName: "Priya", message: "Yes, perfect! I'll review the business plan you shared beforehand.", time: "May 3 · 2:25 PM" },
  { id: "3", sender: "backer", senderName: "Kevin Torres", message: "Great. I'll send the full deck by May 14 so you have time.", time: "May 3 · 2:28 PM" },
];

export const CHAT_PHOTO_DONE: ChatMessage[] = [
  { id: "1", sender: "creator", senderName: "Priya", message: "Thanks for the session Sam! Quick recap — focus on exposure triangle first, then Lightroom presets in week 2.", time: "Apr 25 · 4:30 PM" },
  { id: "2", sender: "backer", senderName: "Sam Osei", message: "Loved the session! Already editing my first shoot. Will you do a follow-up session on portrait retouching?", time: "Apr 25 · 6:00 PM" },
  { id: "3", sender: "creator", senderName: "Priya", message: "Absolutely, I'd love to! Post a new request and mention this session — I'll match the rate.", time: "Apr 25 · 6:14 PM" },
];

// ─── Mock Requests ────────────────────────────────────────────────────────────

export const MOCK_REQUESTS: CoachingRequest[] = [
  // ── Browse view (not own) ──────────────────────────────────────
  {
    id: "1",
    title: "I want to learn how to be a vlogger",
    description: "Looking for an experienced vlogger to coach me on storytelling, camera work, editing, and building an audience. I'm a complete beginner with a passion for travel content. Ideally someone who has grown a channel to 10k+ subscribers organically.",
    backerName: "Alex Rivers",
    backerHandle: "@alexrivers",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=alexrivers",
    backerBio: "Travel enthusiast and aspiring content creator. 30+ countries, finally documenting it all.",
    remainingTime: "2d 14h",
    postedAt: "3h ago",
    coachingDuration: 60,
    price: 80,
    tags: ["vlogging", "content creation", "youtube", "video editing"],
    status: "open",
    bidCount: 4,
    expectedTimes: ["2026-05-10T09:00", "2026-05-11T14:00", "2026-05-15T10:00"],
  },
  {
    id: "2",
    title: "Need Valorant coaching – stuck in Diamond",
    description: "Hardstuck Diamond 2 for 3 seasons. Need coaching on agent selection, macro play, map control, and mental resilience. Available weekends only. Prefer someone who has hit Radiant or is ex-professional.",
    backerName: "Sarah Kim",
    backerHandle: "@sarahk_gg",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=sarahkim",
    backerBio: "Competitive gamer, Diamond 2 Valorant. Playing since beta.",
    remainingTime: "1d 6h",
    postedAt: "1d ago",
    coachingDuration: 90,
    price: 60,
    tags: ["valorant", "gaming", "esports", "fps"],
    status: "open",
    bidCount: 7,
    expectedTimes: ["2026-05-10T19:00", "2026-05-11T19:00", "2026-05-17T15:00"],
  },
  {
    id: "3",
    title: "Learn guitar fundamentals from scratch",
    description: "Complete beginner wanting to learn acoustic guitar. Interested in fingerpicking styles and folk/indie songs. 30-minute weekly sessions. Patient, encouraging teacher is a must.",
    backerName: "James Moretti",
    backerHandle: "@jmoretti",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=jamesmoretti",
    backerBio: "Software engineer who finally decided to learn guitar properly.",
    remainingTime: "3d 2h",
    postedAt: "6h ago",
    coachingDuration: 30,
    price: 45,
    tags: ["guitar", "music", "beginner", "acoustic"],
    status: "open",
    bidCount: 2,
    expectedTimes: ["2026-05-12T18:00", "2026-05-13T18:00"],
  },
  {
    id: "5",
    title: "Spanish conversation practice – intermediate",
    description: "B1/B2 level Spanish learner seeking a native speaker for weekly conversation sessions. Focus on fluency, idioms, and Latin American culture. Preparing for relocation to Mexico City.",
    backerName: "Tom Bradley",
    backerHandle: "@tombradley",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=tombradley",
    backerBio: "Marketing professional relocating to Mexico City. Need work-ready Spanish.",
    remainingTime: "4d 8h",
    postedAt: "2d ago",
    coachingDuration: 30,
    price: 35,
    tags: ["spanish", "language", "conversation", "b2"],
    status: "open",
    bidCount: 5,
    expectedTimes: ["2026-05-09T08:00", "2026-05-16T08:00", "2026-05-23T08:00"],
  },
  {
    id: "6",
    title: "Marathon prep – training plan & nutrition",
    description: "Running my first marathon in 6 months. Need a coach for a periodized training plan, nutrition timing, and a sub-4:30 goal. Currently running 25km/week.",
    backerName: "Mia Johnson",
    backerHandle: "@miajruns",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=miajohnson",
    backerBio: "Amateur runner with 5k and 10k races. Ready for marathon distance.",
    remainingTime: "6d 12h",
    postedAt: "5h ago",
    coachingDuration: 45,
    price: 90,
    tags: ["fitness", "running", "marathon", "nutrition"],
    status: "open",
    bidCount: 1,
    expectedTimes: ["2026-05-11T07:00", "2026-05-18T07:00"],
  },

  // ── Your Requests view (own) ───────────────────────────────────

  {
    id: "4",
    title: "React & TypeScript mentorship wanted",
    description: "Self-taught developer wanting structured mentorship on React patterns, TypeScript advanced types, and building production-grade apps. Looking for weekly sessions with code review and homework assignments.",
    backerName: "Priya Nair",
    backerHandle: "@priyanair_dev",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=priyanair",
    backerBio: "Self-taught dev building a SaaS product. Passionate about clean code.",
    remainingTime: "5d 0h",
    postedAt: "12h ago",
    coachingDuration: 60,
    price: 120,
    tags: ["react", "typescript", "web dev", "mentorship"],
    status: "open",
    bidCount: 3,
    isOwn: true,
    ownRequestStatus: "bid_receiving",
    biddingDeadline: "5d 0h",
    expectedTimes: ["2026-05-10T10:00", "2026-05-11T14:00", "2026-05-12T10:00"],
    applicants: [
      {
        id: "a1",
        name: "Dan Chen",
        handle: "@danchen_codes",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=danchen",
        message: "5 years React at Stripe. Mentored 47 devs.",
        specialty: "Senior Frontend Engineer @ Stripe",
        rating: 4.9,
        sessionsCompleted: 47,
        trustScore: 94,
        price: 120,
        timePicked: "Sat May 10 · 10:00 AM",
        pitch: undefined,
      },
      {
        id: "a2",
        name: "Emily Wu",
        handle: "@emilywudev",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=emilywu",
        message: "Staff engineer at Vercel. Deep TypeScript expertise.",
        specialty: "Staff Engineer @ Vercel",
        rating: 4.8,
        sessionsCompleted: 83,
        trustScore: 91,
        price: 115,
        timePicked: "Sun May 11 · 2:00 PM",
        pitch: "I'd love to review your SaaS codebase and create a structured learning path tailored to your specific challenges and gaps. I'll assign small exercises between sessions to accelerate progress.",
        chatHistory: [
          { id: "c1", sender: "creator", senderName: "Emily Wu", message: "Hi Priya! I noticed you're building a SaaS — happy to do a quick architecture review as part of the first session at no extra charge.", time: "Today · 8:30 AM" },
          { id: "c2", sender: "backer", senderName: "Priya", message: "That sounds amazing! I've been struggling with how to structure my custom hooks layer.", time: "Today · 8:45 AM" },
          { id: "c3", sender: "creator", senderName: "Emily Wu", message: "Classic challenge for self-taught devs. I'll prepare a mini-template for you. See you on May 11!", time: "Today · 8:52 AM" },
        ],
      },
      {
        id: "a3",
        name: "Marco Silva",
        handle: "@marcosilva_js",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=marcosilva",
        message: "Open-source maintainer (12k ★). Clean architecture & TDD.",
        specialty: "Open Source Maintainer & Freelance Architect",
        rating: 4.7,
        sessionsCompleted: 31,
        trustScore: 85,
        price: 100,
        timePicked: "Sat May 10 · 10:00 AM",
        pitch: undefined,
        chatHistory: [
          { id: "c1", sender: "creator", senderName: "Marco Silva", message: "Hey Priya! Quick question — are you using React Router or Next.js App Router?", time: "Yesterday · 4:10 PM" },
          { id: "c2", sender: "backer", senderName: "Priya", message: "Next.js App Router! Still wrapping my head around server components.", time: "Yesterday · 4:22 PM" },
          { id: "c3", sender: "creator", senderName: "Marco Silva", message: "Perfect, that's my specialty right now. I've just migrated 3 production apps. Lots to share!", time: "Yesterday · 4:28 PM" },
        ],
      },
    ],
  },

  // ── Own: Bid Receiving ──
  {
    id: "own1",
    title: "UI/UX Design feedback for my SaaS landing page",
    description: "My SaaS landing page has a high bounce rate. I need a UX/UI expert to review the hero fold, value proposition copy, and CTA placement. Willing to test 2-3 design variants together in the session.",
    backerName: "Priya Nair",
    backerHandle: "@priyanair_dev",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=priyanair",
    backerBio: "SaaS founder working on conversion rate optimization.",
    remainingTime: "1d 18h",
    postedAt: "6h ago",
    coachingDuration: 60,
    price: 80,
    tags: ["ux design", "landing page", "conversion", "saas"],
    status: "open",
    bidCount: 3,
    isOwn: true,
    ownRequestStatus: "bid_receiving",
    biddingDeadline: "18h 30m",
    expectedTimes: ["2026-05-10T09:00", "2026-05-11T14:00", "2026-05-12T10:00"],
    applicants: [
      {
        id: "b1",
        name: "Lucas Ferreira",
        handle: "@lucasdesigns",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=lucasferreira",
        message: "12+ SaaS landing pages redesigned, avg 28% conversion lift.",
        specialty: "Product Designer @ Figma Alumni",
        rating: 4.9,
        sessionsCompleted: 34,
        trustScore: 92,
        price: 75,
        timePicked: "Sat May 10 · 9:00 AM",
        pitch: "I've redesigned 12 SaaS landing pages in the past year alone, with an average 28% conversion rate lift. I'll come prepared with a quick heuristic audit of your current page and 2-3 high-impact recommendations we can prototype live together.",
        chatHistory: CHAT_DESIGN_LUCAS,
      },
      {
        id: "b2",
        name: "Aisha Mensah",
        handle: "@aishaux",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=aishamensah",
        message: "Former Shopify design lead. CRO specialist.",
        specialty: "Senior UX Designer @ Ex-Shopify",
        rating: 4.8,
        sessionsCompleted: 61,
        trustScore: 88,
        price: 90,
        timePicked: "Sun May 11 · 2:00 PM",
        pitch: undefined,
      },
      {
        id: "b3",
        name: "Ravi Shankar",
        handle: "@ravicreates",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ravishankar",
        message: "Freelance designer specializing in early-stage startup growth.",
        specialty: "Freelance Product Designer",
        rating: 4.6,
        sessionsCompleted: 12,
        trustScore: 71,
        price: 65,
        timePicked: "Mon May 12 · 10:00 AM",
        pitch: "My specialty is conversion-optimized design for early-stage startups where every visitor counts. I'll help you clarify your value prop and layout so visitors understand what you offer in under 5 seconds.",
        chatHistory: CHAT_DESIGN_RAVI,
      },
    ],
  },

  // ── Own: Scheduled ──
  {
    id: "own2",
    title: "Advanced SQL performance tuning for production DB",
    description: "Several queries in our production Postgres DB are timing out at scale. Need an expert to help me identify bottlenecks, optimize indexes, and restructure complex joins. Have query logs ready to share.",
    backerName: "Priya Nair",
    backerHandle: "@priyanair_dev",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=priyanair",
    backerBio: "SaaS founder dealing with database scaling issues.",
    remainingTime: "0d 0h",
    postedAt: "3d ago",
    coachingDuration: 60,
    price: 100,
    tags: ["sql", "postgresql", "backend", "performance"],
    status: "matched",
    bidCount: 5,
    isOwn: true,
    ownRequestStatus: "scheduled",
    scheduledTime: "Thu May 15 · 3:00 PM",
    chatHistory: CHAT_SQL_SCHEDULED,
    expectedTimes: ["2026-05-15T15:00", "2026-05-17T10:00"],
    selectedCreator: {
      id: "c1",
      name: "David Park",
      handle: "@davidparkdb",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=davidpark",
      specialty: "Database Architect @ AWS",
      rating: 4.9,
      sessionsCompleted: 52,
      trustScore: 96,
    },
  },

  // ── Own: Done ──
  {
    id: "own3",
    title: "Launch email copywriting for my SaaS product",
    description: "Need a copywriter to help me write a 5-email launch sequence for my SaaS. Focused on problem-aware → solution-aware journey. Target audience: indie developers and small startup founders.",
    backerName: "Priya Nair",
    backerHandle: "@priyanair_dev",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=priyanair",
    backerBio: "SaaS founder working on product launch.",
    remainingTime: "0d 0h",
    postedAt: "8d ago",
    coachingDuration: 90,
    price: 75,
    tags: ["copywriting", "email", "saas", "marketing"],
    status: "matched",
    bidCount: 6,
    isOwn: true,
    ownRequestStatus: "done",
    scheduledTime: "Fri Apr 28 · 2:00 PM",
    rating: 5,
    chatHistory: CHAT_COPY_DONE,
    expectedTimes: [],
    selectedCreator: {
      id: "c2",
      name: "Nadia Okafor",
      handle: "@nadiawrites",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=nadiaokafor",
      specialty: "B2B SaaS Copywriter & Email Strategist",
      rating: 4.9,
      sessionsCompleted: 78,
      trustScore: 93,
    },
  },

  // ── Own: Ongoing ──
  {
    id: "own4",
    title: "Podcast production workflow & editing coaching",
    description: "Launching a podcast for my SaaS brand. Need help setting up the production workflow — recording setup, editing in Descript/GarageBand, show notes, and distribution strategy.",
    backerName: "Priya Nair",
    backerHandle: "@priyanair_dev",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=priyanair",
    backerBio: "SaaS founder launching a podcast for brand building.",
    remainingTime: "0d 0h",
    postedAt: "4d ago",
    coachingDuration: 60,
    price: 70,
    tags: ["podcast", "audio", "content", "production"],
    status: "matched",
    bidCount: 4,
    isOwn: true,
    ownRequestStatus: "ongoing",
    scheduledTime: "Today · 2:00 PM",
    sessionStartedMinutesAgo: 22,
    expectedTimes: [],
    selectedCreator: {
      id: "c3",
      name: "Jordan Lee",
      handle: "@jordanpodcasts",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=jordanlee",
      specialty: "Podcast Producer & Audio Engineer",
      rating: 4.8,
      sessionsCompleted: 29,
      trustScore: 82,
    },
  },

  // ── Own: Canceled ──
  {
    id: "own5",
    title: "Instagram B2B growth strategy for SaaS founders",
    description: "Want to use Instagram as a top-of-funnel channel for my SaaS. Looking for someone who's grown a B2B account organically — specifically targeting developers and startup founders.",
    backerName: "Priya Nair",
    backerHandle: "@priyanair_dev",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=priyanair",
    backerBio: "SaaS founder exploring Instagram as a growth channel.",
    remainingTime: "0d 0h",
    postedAt: "5d ago",
    coachingDuration: 45,
    price: 55,
    tags: ["instagram", "social media", "b2b", "growth"],
    status: "closed",
    bidCount: 2,
    isOwn: true,
    ownRequestStatus: "canceled",
    expectedTimes: [],
  },
];

// ─── Your Bids ────────────────────────────────────────────────────────────────

export const MOCK_YOUR_BIDS: YourBid[] = [
  {
    id: "yb1",
    requestTitle: "TikTok content strategy for absolute beginners",
    requestDescription: "I've never made a TikTok video before but want to grow a channel about sustainable fashion. Need help with hook writing, content calendar, and understanding the algorithm.",
    requestTags: ["tiktok", "content strategy", "social media", "fashion"],
    requestDuration: 60,
    backerName: "Mei Lin",
    backerHandle: "@meilingreen",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=meilin",
    postedAt: "Today",
    price: 65,
    timePicked: "Wed May 14 · 11:00 AM",
    biddingTimeHours: 48,
    status: "on_conversation",
    chatHistory: CHAT_TIKTOK_ACTIVE,
  },
  {
    id: "yb2",
    requestTitle: "React Native consultation for MVP mobile app",
    requestDescription: "Building my first mobile app in React Native. Need someone to review my architecture decisions and advise on navigation, state management, and performance patterns.",
    requestTags: ["react native", "mobile", "typescript", "mvp"],
    requestDuration: 60,
    backerName: "Carlos Mendez",
    backerHandle: "@carlosbuilds",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=carlosmendez",
    postedAt: "Yesterday",
    price: 110,
    timePicked: "Mon May 13 · 3:00 PM",
    biddingTimeHours: 48,
    status: "wait_for_reply",
  },
  {
    id: "yb3",
    requestTitle: "Business plan review for food startup",
    requestDescription: "Looking for an experienced entrepreneur or business consultant to review my food delivery startup business plan — unit economics, go-to-market, and financial projections.",
    requestTags: ["business plan", "startup", "food", "finance"],
    requestDuration: 90,
    backerName: "Kevin Torres",
    backerHandle: "@kevinfoods",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=kevinforres",
    postedAt: "2d ago",
    price: 95,
    timePicked: "Fri May 16 · 11:00 AM",
    biddingTimeHours: 48,
    status: "scheduled",
    scheduledTime: "Fri May 16 · 11:00 AM",
    chatHistory: CHAT_SQL_BID_SCHEDULED,
  },
  {
    id: "yb4",
    requestTitle: "Photoshop & Lightroom mastery for beginners",
    requestDescription: "Photographer wanting to level up photo editing — skin retouching, color grading, and batch export workflows. Have Adobe CC subscription, using it maybe 20% of its potential.",
    requestTags: ["photoshop", "lightroom", "photography", "editing"],
    requestDuration: 60,
    backerName: "Sam Osei",
    backerHandle: "@samosei_photo",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=samosei",
    postedAt: "10d ago",
    price: 55,
    timePicked: "Fri Apr 25 · 2:00 PM",
    biddingTimeHours: 48,
    status: "done",
    scheduledTime: "Fri Apr 25 · 2:00 PM",
    chatHistory: CHAT_PHOTO_DONE,
  },
  {
    id: "yb5",
    requestTitle: "Email marketing automation setup (Mailchimp/Klaviyo)",
    requestDescription: "E-commerce brand wanting to set up automated email flows — welcome series, abandoned cart, and post-purchase. Have a list of 2,000 subscribers but no automations yet.",
    requestTags: ["email marketing", "automation", "e-commerce", "klaviyo"],
    requestDuration: 60,
    backerName: "Fiona Walsh",
    backerHandle: "@fionashop",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=fionawalsh",
    postedAt: "5d ago",
    price: 80,
    timePicked: "Tue May 6 · 10:00 AM",
    biddingTimeHours: 24,
    status: "backer_picked_another",
  },
];
