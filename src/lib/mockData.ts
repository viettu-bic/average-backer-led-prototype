export type RequestStatus = "open" | "matched" | "closed";

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
}

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
  isOwn?: boolean;
  applicants?: Applicant[];
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

export const MOCK_REQUESTS: CoachingRequest[] = [
  {
    id: "1",
    title: "I want to learn how to be a vlogger",
    description:
      "Looking for an experienced vlogger to coach me on storytelling, camera work, editing, and building an audience. I'm a complete beginner with a passion for travel content. Ideally someone who has grown a channel to 10k+ subscribers organically. Flexible on scheduling — weekdays preferred.",
    backerName: "Alex Rivers",
    backerHandle: "@alexrivers",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=alexrivers",
    backerBio:
      "Travel enthusiast and aspiring content creator. Been to 30+ countries and want to share those stories with the world.",
    remainingTime: "2d 14h",
    postedAt: "3h ago",
    coachingDuration: 60,
    price: 80,
    tags: ["vlogging", "content creation", "youtube", "video editing"],
    status: "open",
    bidCount: 4,
  },
  {
    id: "2",
    title: "Need Valorant coaching – stuck in Diamond",
    description:
      "I've been hardstuck Diamond 2 for 3 seasons. Need coaching on agent selection, macro play, map control, and mental resilience under pressure. Available weekends only. Prefer someone who has hit Radiant or is an ex-professional player. VOD review sessions welcome.",
    backerName: "Sarah Kim",
    backerHandle: "@sarahk_gg",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=sarahkim",
    backerBio:
      "Competitive gamer, Diamond 2 Valorant. Playing since beta. Looking to finally break through to Immortal.",
    remainingTime: "1d 6h",
    postedAt: "1d ago",
    coachingDuration: 90,
    price: 60,
    tags: ["valorant", "gaming", "esports", "fps"],
    status: "open",
    bidCount: 7,
  },
  {
    id: "3",
    title: "Learn guitar fundamentals from scratch",
    description:
      "Complete beginner wanting to learn acoustic guitar. Interested in fingerpicking styles, basic chords, and eventually playing folk and indie songs. Prefer 30-minute weekly sessions. A patient, encouraging teacher is a must — I've tried apps and they just don't work for me.",
    backerName: "James Moretti",
    backerHandle: "@jmoretti",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=jamesmoretti",
    backerBio:
      "Software engineer by day, music lover by heart. Always wanted to learn guitar and now finally committing to it properly.",
    remainingTime: "3d 2h",
    postedAt: "6h ago",
    coachingDuration: 30,
    price: 45,
    tags: ["guitar", "music", "beginner", "acoustic"],
    status: "open",
    bidCount: 2,
  },
  {
    id: "4",
    title: "React & TypeScript mentorship wanted",
    description:
      "Self-taught developer wanting structured mentorship on React patterns, TypeScript advanced types, and building production-grade apps. Looking for weekly sessions with code review and homework assignments. Happy to share my current SaaS project for architectural feedback.",
    backerName: "Priya Nair",
    backerHandle: "@priyanair_dev",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=priyanair",
    backerBio:
      "Self-taught dev with 1 year of experience, currently building a SaaS product. Passionate about clean code.",
    remainingTime: "5d 0h",
    postedAt: "12h ago",
    coachingDuration: 60,
    price: 120,
    tags: ["react", "typescript", "web dev", "mentorship"],
    status: "open",
    bidCount: 3,
    isOwn: true,
    applicants: [
      {
        id: "a1",
        name: "Dan Chen",
        handle: "@danchen_codes",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=danchen",
        message:
          "Hey Priya! I've been building with React for 5 years, currently at Stripe. Would love to help you level up your TypeScript skills and review your SaaS architecture. I've mentored 47 devs to senior level — let's do this!",
        specialty: "Senior Frontend Engineer @ Stripe",
        rating: 4.9,
        sessionsCompleted: 47,
        trustScore: 94,
      },
      {
        id: "a2",
        name: "Emily Wu",
        handle: "@emilywudev",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=emilywu",
        message:
          "Hi! Staff engineer at Vercel with deep TypeScript expertise. I specialize in mentoring devs on architectural patterns, advanced generics, and scaling React apps. Your SaaS project sounds exciting — let me help you build it right!",
        specialty: "Staff Engineer @ Vercel",
        rating: 4.8,
        sessionsCompleted: 83,
        trustScore: 91,
      },
      {
        id: "a3",
        name: "Marco Silva",
        handle: "@marcosilva_js",
        avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=marcosilva",
        message:
          "Full-stack dev and open-source maintainer (12k GitHub stars on my React toolkit). I love teaching clean architecture, TDD, and React best practices. I've worked with self-taught devs many times — your background is an asset!",
        specialty: "Open Source Maintainer & Freelance Architect",
        rating: 4.7,
        sessionsCompleted: 31,
        trustScore: 85,
      },
    ],
  },
  {
    id: "5",
    title: "Spanish conversation practice – intermediate",
    description:
      "B1/B2 level Spanish learner seeking a native speaker for weekly conversation sessions. Focus on fluency, idioms, and Latin American culture. Flexible schedule, any timezone works. I'm preparing for a relocation to Mexico City.",
    backerName: "Tom Bradley",
    backerHandle: "@tombradley",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=tombradley",
    backerBio:
      "Marketing professional planning to relocate to Mexico City. Need to sharpen Spanish conversational fluency for work.",
    remainingTime: "4d 8h",
    postedAt: "2d ago",
    coachingDuration: 30,
    price: 35,
    tags: ["spanish", "language", "conversation", "b2"],
    status: "open",
    bidCount: 5,
  },
  {
    id: "6",
    title: "Marathon prep – training plan & nutrition",
    description:
      "Running my first marathon in 6 months. Need a coach to build a periodized training plan, advise on nutrition timing, and help me hit a sub-4:30 goal. Currently running 25km/week. I have access to a track and a gym.",
    backerName: "Mia Johnson",
    backerHandle: "@miajruns",
    backerAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=miajohnson",
    backerBio:
      "Amateur runner with 5k and 10k races under my belt. Ready to take the big leap to marathon distance.",
    remainingTime: "6d 12h",
    postedAt: "5h ago",
    coachingDuration: 45,
    price: 90,
    tags: ["fitness", "running", "marathon", "nutrition"],
    status: "open",
    bidCount: 1,
  },
];
