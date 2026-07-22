import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Beaker,
  Brush,
  Circle,
  Club,
  Diamond,
  Eraser,
  ExternalLink,
  Folder,
  Gamepad2,
  Github,
  Heart,
  Linkedin,
  Minus,
  PaintBucket,
  Paintbrush,
  Pencil,
  Mail,
  Monitor,
  Phone,
  Rocket,
  SprayCan,
  Spade,
  Square,
  SquareDashed,
  Target,
  Type,
  User,
} from "lucide-react";

// This file builds the whole "Windows 95 style" portfolio app.
// Think of it like a mini operating system made with React.

// --- Data ------------------------------------------------------------------

type ProjectFocus = "AI" | "Health" | "Websites" | "Research";

type Project = {
  id: string;
  title: string;
  focus: ProjectFocus;
  status: "In Progress" | "Prototype" | "Shipped";
  summary: string;
  details: string;
  problem: string;
  process: string;
  outcome: string;
  tags: string[];
  links?: Array<{ label: string; url: string }>;
  insight?: {
    reflection: string;
    decisions: string[];
    learnings?: string[];
  };
};

type LabItem = {
  id: string;
  title: string;
  summary: string;
  youtubeId: string;
};

const YOUTUBE_CONCEPT_PLAYLIST_URL = "https://www.youtube.com/playlist?list=PLCIh1-EWC0c4";

type ObjectiveReference = {
  kind: "project" | "lab";
  id: string | null;
};

type DegreeObjective = {
  number: number;
  text: string;
  references: ObjectiveReference[];
};

type PortfolioNavTarget = { window: "projects"; projectId: string } | { window: "lab"; labId: string };

type WindowId = "home" | "about" | "lab" | "projects" | "contact" | "objectives" | "paint" | "solitaire";

type WindowConfig = {
  id: WindowId;
  title: string;
  icon: React.ReactNode;
  initialPosition: { x: number; y: number };
};

type CardSuit = "H" | "D" | "S" | "C";
type CardRank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
type Card = {
  id: string;
  rank: CardRank;
  suit: CardSuit;
};

// These are the main projects shown in the Projects window.
const PROJECTS: Project[] = [
  {
    id: "voice-ai-agent",
    title: "Voice AI Agent",
    focus: "AI",
    status: "In Progress",
    summary: "Voice-first AI agent for guided conversations, disclosures, and human handoff.",
    details: "Built on the Magnetiq / ZipApproval platform architecture — a multi-layer AI system spanning experience (web, SMS, voice), orchestration, RAG knowledge retrieval, memory, data, partner integrations, and governance. The voice agent at Ask MyLo guides users through compliant flows with consent, session logging, and escalation paths to human specialists.",
    problem: "Regulated voice AI products must balance natural conversation with compliance, traceability, and clear handoff moments when automation reaches its limits.",
    process: "Mapped the full stack from Docker/Ollama inference and FastAPI backend through RAG ingestion, prompt policy wrappers, GoHighLevel and CRM integrations, funnel step tracking, and admin analytics for drop-offs and lead quality.",
    outcome: "A live voice AI experience with architecture designed for safe refusal templates, audit trails, human handoff CTAs, and measurable conversation funnels.",
    tags: ["Voice AI", "Agent UX", "RAG", "Compliance", "System Architecture"],
    links: [
      { label: "Live Site", url: "https://askmylo.ai/" },
      { label: "Architecture Doc", url: "./ZippApproval-Architecture-For-Development.pdf" },
    ],
    insight: {
      reflection:
        "I wanted voice AI to feel accountable, not magical — every step visible, every handoff intentional. The architecture doc maps how compliance, RAG, and human escalation stay connected across the stack.",
      decisions: [
        "Separated orchestration from experience so policy and prompts can evolve without breaking the voice UI.",
        "Built funnel step tracking and drop-off logging before optimizing copy.",
        "Designed handoff CTAs as first-class interaction states, not error fallbacks.",
      ],
      learnings: [
        "Regulated AI needs audit trails as much as conversational polish.",
        "Visible system state builds trust faster than smoother small talk.",
      ],
    },
  },
  {
    id: "appointment-booking-chatbot",
    title: "Appointment Booking Chatbot",
    focus: "AI",
    status: "In Progress",
    summary: "Conversational agent focused on qualifying leads and booking appointments.",
    details: "Designed and shipped a chatbot experience that walks users through discovery questions, surfaces the right next step, and routes them toward scheduled appointments. Built as part of the Magnetiq agent product line with emphasis on clear conversation states and conversion-oriented handoffs.",
    problem: "Service businesses lose leads when booking flows feel generic, opaque, or disconnected from what the user already asked in chat.",
    process: "Structured the conversation into identifiable steps, connected scheduling and CRM workflows, and tuned prompts for qualification before booking.",
    outcome: "A deployed appointment-booking agent that turns chat intent into scheduled conversations with clearer user progress and handoff logic.",
    tags: ["Chatbot UX", "Scheduling", "Lead Qualification", "Conversion", "AI Product"],
    links: [{ label: "Live Site", url: "https://agentsuccessformula.com/" }],
  },
  {
    id: "health-loop",
    title: "The Color Purple",
    focus: "Health",
    status: "In Progress",
    summary: "Working on calm, repeatable health interactions for long-term use.",
    details: "An Alzheimer's Preventative Tracking App. It works to build preventative habits to slow or prevent alzhiemer progression or build up.",
    problem: "Health tools can feel stressful, clinical, or too dense for repeated daily use.",
    process: "Reduced visual noise, simplified information hierarchy, and added gentler routines.",
    outcome: "A calmer interaction model that supports long-term habit building.",
    tags: ["Health UX", "Information Architecture", "UI Systems", "Research"],
    links: [
      {
        label: "Figma",
        url: "https://www.figma.com/design/LFMYSd2A265NaByRpjxNr1/Sip-project?m=auto&t=ogFWsilYz070ggpD-1",
      },
      {
        label: "YouTube",
        url: "https://youtu.be/NXIuXXJugGc",
      },
    ],
    insight: {
      reflection:
        "Preventative health only works if the product feels safe to open every day. I focused on calm pacing and readable hierarchy so tracking amyloid beta-related habits never feels like a clinical chore.",
      decisions: [
        "Prioritized weekly rhythm over dense daily dashboards.",
        "Reduced visual noise so caregivers and users can scan status quickly.",
        "Framed the experience around gentle habit building, not alarm-driven tracking.",
      ],
      learnings: [
        "Long-term health UX wins when repetition feels supportive, not punitive.",
        "Persona work upstream made interface priorities much clearer.",
      ],
    },
  },
  {
    id: "uat-competition-site",
    title: "UAT Competition Website",
    focus: "Websites",
    status: "Prototype",
    summary: "A competition site focused on clarity, speed, and engagement.",
    details: "I am building the UAT competition experience so participants can quickly understand categories, timelines, submission rules, and judging flow. The goal is a clean interface that feels energetic and easy to navigate under time pressure.",
    problem: "Competition sites can bury key dates, rules, and entry steps under too many layers.",
    process: "Grouped deadlines, entry rules, and submission actions into a more obvious structure.",
    outcome: "A sharper event site experience that reduces friction and helps people act faster.",
    tags: ["Web UX", "Information Architecture", "Interaction Design", "Event Platform"],
    links: [
      { label: "Brand Guide", url: "https://www.behance.net/gallery/240609867/UAT-Competition-Website" },
      {
        label: "Figma",
        url: "https://www.figma.com/site/Ik8yipWDHgwa7eKWvDSwER/UATCompetitionWebsite?t=ogFWsilYz070ggpD-1",
      },
      {
        label: "Flowchart",
        url: "https://www.figma.com/board/uGeHd3jZDNrXmAD5QL8rPV/flowchart?t=ogFWsilYz070ggpD-1",
      },
    ],
  },
  {
    id: "dtg-platen",
    title: "DTG Platen Shark Tank Pitch",
    focus: "Research",
    status: "Shipped",
    summary: "A direct-to-garment printing platen concept pitched as a full product story.",
    details: "Developed and presented a DTG platen concept as a Shark Tank-style pitch — combining product usability, market framing, and persuasive presentation design into one deliverable.",
    problem: "New hardware concepts need a clear story that connects user value, workflow, and business case in a single narrative.",
    process: "Structured the pitch around problem, solution, demo flow, and market opportunity with visual support for the platen concept.",
    outcome: "A complete pitch presentation that communicates the DTG platen idea as a viable product concept.",
    tags: ["Product Design", "Presentation", "Pitch", "Visual Communication"],
    links: [{ label: "Watch Pitch", url: "https://www.youtube.com/watch?v=jCAoWXPXs0I" }],
  },
  {
    id: "m5-tour-guide",
    title: "M5Core2 Open AI Tour Guide",
    focus: "AI",
    status: "Shipped",
    summary: "Handheld location-aware tour guide using M5Core2, GPS, and the OpenAI API.",
    details: "Built a lab project on the M5Core2 that connects to Wi-Fi, tracks GPS with TinyGPSPlus (fallback to Phoenix, AZ), and uses OpenAI to surface Food, News, and Events based on location. Results render on-device in a touch-scrollable interface.",
    problem: "Portable tour experiences need contextual local information without the friction of a full mobile app workflow.",
    process: "Integrated embedded hardware, GPS parsing, API calls, and touch-scroll output on a constrained screen.",
    outcome: "A working handheld AI tour guide prototype with category-based local results.",
    tags: ["Embedded UX", "OpenAI", "IoT", "GPS", "Hardware"],
    links: [{ label: "GitHub Repo", url: "https://github.com/DaveLoading/M5Core2-Open-AI-Tour-Guide" }],
  },
  {
    id: "canva-design-uljt",
    title: "Alzheimer's Amyloid Beta Tracking — Personas",
    focus: "Health",
    status: "Shipped",
    summary: "Persona presentation for an Alzheimer's amyloid beta tracking health project.",
    details: "Created a Canva persona deck for an Alzheimer's amyloid beta tracking project — defining user types, motivations, constraints, and care-context needs to guide product and interaction decisions.",
    problem: "Health tracking tools for cognitive conditions need user models that reflect real caregivers, patients, and clinical context before interface design begins.",
    process: "Researched user segments, mapped goals and pain points, and built visual persona profiles in Canva tied to amyloid beta tracking workflows.",
    outcome: "A shareable persona presentation that anchors design decisions for the Alzheimer's tracking project in documented user needs.",
    tags: ["Personas", "Health UX", "Alzheimer's", "Research", "Canva"],
    links: [
      {
        label: "View Personas on Canva",
        url: "https://www.canva.com/design/DAGULJTqSyY/IZO2gTy_PC1YLZ4KKWhXAw/view?utm_content=DAGULJTqSyY&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hf8e78e90ea",
      },
    ],
  },
  {
    id: "canva-design-phpi",
    title: "Project Katalyst — Personas",
    focus: "Research",
    status: "Shipped",
    summary: "Persona presentation for Project Katalyst, a game design project.",
    details: "Developed a Canva persona deck for Project Katalyst — a game design project — capturing player types, motivations, play habits, and design implications for core game loops and onboarding.",
    problem: "Game concepts need clear player personas early so mechanics, difficulty, and UI serve distinct audiences instead of a generic user.",
    process: "Defined player archetypes, mapped goals and frustrations, and visualized personas in Canva with notes tied to Katalyst's game design direction.",
    outcome: "A presentation-ready persona set that supports game design and UX decisions for Project Katalyst.",
    tags: ["Personas", "Game Design", "Project Katalyst", "UX Research", "Canva"],
    links: [
      {
        label: "View Personas on Canva",
        url: "https://www.canva.com/design/DAGphpI1Lm4/L81XC4X2fsCcNAjiYooIFw/view?utm_content=DAGphpI1Lm4&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h2d9bd4aaae",
      },
    ],
  },
  {
    id: "az-hugs",
    title: "AZ HUGS Website",
    focus: "Websites",
    status: "Shipped",
    summary: "Website for a Phoenix nonprofit supporting people experiencing homelessness.",
    details: "Designed and built the AZ HUGS web presence — a 501(c)(3) nonprofit focused on outreach, Sunday picnics, the HUGS HOUSE shelter program, and Arizona QCO tax-credit donations.",
    problem: "Community nonprofits need a trustworthy site that makes programs, donation paths, and support options easy to find.",
    process: "Mapped key user journeys (donate, volunteer, learn programs), designed mockups in Figma, and shipped the live site.",
    outcome: "A live nonprofit website with clear calls to action for donations, care bags, and program information.",
    tags: ["Web UX", "Nonprofit", "Figma", "Information Architecture"],
    links: [
      { label: "Live Site", url: "https://www.azhugs.org/" },
      {
        label: "Figma Mockup",
        url: "https://www.figma.com/design/XIbKiTGC5OSfYMuQiGbDOb/AZ-HUGS-mockup?m=auto&t=lmFj5C2I5q8Bihtn-1",
      },
    ],
    insight: {
      reflection:
        "AZ HUGS needed a site that earns trust quickly — donors, volunteers, and community members all arrive with different goals but share a need for clarity and warmth.",
      decisions: [
        "Mapped donate, volunteer, and program paths before visual design.",
        "Kept calls to action consistent across mobile and desktop layouts.",
        "Used Figma mockups to validate hierarchy before shipping the live site.",
      ],
      learnings: [
        "Nonprofit sites convert better when program stories and action paths are equally visible.",
        "Mockups helped stakeholders agree on tone before build-out.",
      ],
    },
  },
];

const FEATURED_PROJECT_IDS = ["az-hugs", "voice-ai-agent", "health-loop"] as const;

const FEATURED_PROJECTS = FEATURED_PROJECT_IDS.map((id) => PROJECTS.find((project) => project.id === id)).filter(
  (project): project is Project => project !== undefined,
);

// Concept projects for the Lab window — ideas explored in video, not yet full case studies.
const LAB_ITEMS: LabItem[] = [
  {
    id: "lab-basal-ganglia",
    title: "Basal Ganglia Boogie",
    summary: "An interactive concept tying movement and rhythm to neuroscience themes, exploring playful engagement with complex human systems.",
    youtubeId: "D-d49nPwAyw",
  },
  {
    id: "lab-neurolens",
    title: "NeuroLens",
    summary: "A wearable lens concept for neurological feedback — exploring how visual interfaces can make hidden body data feel understandable.",
    youtubeId: "x7MYfber2ig",
  },
  {
    id: "lab-neurobridge",
    title: "NeuroBridge",
    summary: "An assistive interaction concept that bridges neural input with digital control — early exploration of inclusive interface design.",
    youtubeId: "IuHlv9B5Kfs",
  },
  {
    id: "lab-lung-assist",
    title: "Lung Assist Vest",
    summary: "A respiratory support vest concept with human-centered wearable design — balancing medical utility, comfort, and daily use.",
    youtubeId: "hg4xXrUCpeY",
  },
  {
    id: "lab-neural-exo-brace",
    title: "Neural Exo-Brace",
    summary: "An exoskeleton brace concept combining neural signals with physical assist — prototyping how people might control adaptive mobility devices.",
    youtubeId: "zkZptceqrJU",
  },
];

// HCI degree objectives shown in the Objectives window.
const DEGREE_OBJECTIVES: DegreeObjective[] = [
  {
    number: 1,
    text: "Articulate and apply concepts when creating human computer interactions that appropriately incorporate practical and aesthetic design concepts.",
    references: [
      { kind: "project", id: "uat-competition-site" },
      { kind: "project", id: "az-hugs" },
    ],
  },
  {
    number: 2,
    text: "Implement effective interfaces and interactions across a variety of devices including IoT, mobile, computers and/or wearables.",
    references: [
      { kind: "project", id: "dtg-platen" },
      { kind: "project", id: "m5-tour-guide" },
    ],
  },
  {
    number: 3,
    text: "Assess a proposed HCI technology based on its application, platform, and purpose. Convert this assessment into an effective user experience and informed human computer interaction design.",
    references: [
      { kind: "lab", id: "lab-neural-exo-brace" },
      { kind: "project", id: "voice-ai-agent" },
    ],
  },
  {
    number: 4,
    text: "Analyze human factors such as cognition, use patterns, and demographics and apply this analysis to develop effective human computer interactions.",
    references: [
      { kind: "project", id: "canva-design-phpi" },
      { kind: "project", id: "canva-design-uljt" },
    ],
  },
  {
    number: 5,
    text: "Evaluate HCI design options in terms of their cost to produce and against perceived benefit by the user.",
    references: [
      { kind: "lab", id: "lab-basal-ganglia" },
      { kind: "lab", id: "lab-lung-assist" },
    ],
  },
  {
    number: 6,
    text: "Using professional tools and pipeline processes, prototype and build innovative interfaces and interactions for multiple platforms, including web, PC, mobile, handheld, and next-generation devices.",
    references: [
      { kind: "project", id: "az-hugs" },
      { kind: "project", id: "health-loop" },
    ],
  },
];

function resolveReferenceTitle(reference: ObjectiveReference): string | null {
  if (!reference.id) return null;
  if (reference.kind === "project") {
    return PROJECTS.find((project) => project.id === reference.id)?.title ?? null;
  }
  return LAB_ITEMS.find((item) => item.id === reference.id)?.title ?? null;
}

function resolveReferenceMedia(reference: ObjectiveReference): Array<{ label: string; url: string }> {
  if (!reference.id) return [];
  if (reference.kind === "project") {
    return PROJECTS.find((project) => project.id === reference.id)?.links ?? [];
  }
  const labItem = LAB_ITEMS.find((item) => item.id === reference.id);
  if (!labItem) return [];
  return [
    {
      label: "Watch Concept",
      url: `https://www.youtube.com/watch?v=${labItem.youtubeId}&list=PLCIh1-EWC0c4`,
    },
  ];
}

// These are the filter buttons used in the Projects window.
const focusFilters: Array<"All" | ProjectFocus> = ["All", "AI", "Health", "Websites", "Research"];

// This list defines every desktop icon/window in the app.
const WINDOWS: WindowConfig[] = [
  { id: "home", title: "Home", icon: <Monitor className="h-5 w-5" />, initialPosition: { x: 180, y: 120 } },
  { id: "about", title: "About", icon: <User className="h-5 w-5" />, initialPosition: { x: 360, y: 180 } },
  { id: "lab", title: "Concepts", icon: <Beaker className="h-5 w-5" />, initialPosition: { x: 220, y: 260 } },
  { id: "projects", title: "Projects", icon: <Folder className="h-5 w-5" />, initialPosition: { x: 460, y: 140 } },
  { id: "objectives", title: "Objectives", icon: <Target className="h-5 w-5" />, initialPosition: { x: 540, y: 260 } },
  { id: "contact", title: "Contact", icon: <Mail className="h-5 w-5" />, initialPosition: { x: 300, y: 340 } },
  { id: "paint", title: "MS Paint", icon: <Paintbrush className="h-5 w-5" />, initialPosition: { x: 640, y: 160 } },
  { id: "solitaire", title: "Solitaire", icon: <Gamepad2 className="h-5 w-5" />, initialPosition: { x: 680, y: 280 } },
];

// --- Shared UI --------------------------------------------------------------

// Reusable old-school panel with beveled borders.
function Frame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`border border-[#7f7f7f] bg-[#d9d9d9] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#404040] ${className}`}>{children}</div>;
}

// Reusable button so controls look the same everywhere.
function Button({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border border-[#7f7f7f] bg-[#c0c0c0] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#404040] ${className}`}
    >
      {children}
    </button>
  );
}

// Desktop shortcut icon (like old computer desktop icons).
function DesktopIcon({ label, onClick, icon }: { label: string; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full max-w-[120px] flex-col items-center gap-1 px-2 py-1 text-center text-black transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white"
    >
      <div className="flex h-12 w-12 items-center justify-center border border-[#000080] bg-[#f4f1e8] text-[#000080] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#7f7f7f]">
        {icon}
      </div>
      <span className="max-w-[90px] text-[10px] font-mono uppercase tracking-[0.1em] text-[#f4f1e8] drop-shadow-[0_1px_0_#000]">{label}</span>
    </button>
  );
}

// Small shared heading block used in multiple windows.
function ScreenLabel({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#000080]">{subtitle}</p>
      <h1 className="mt-1 text-3xl font-semibold leading-tight md:text-4xl">{title}</h1>
    </div>
  );
}

function ProjectLinks({
  links,
  className = "mt-3",
  iconClassName = "h-4 w-4",
}: {
  links?: Array<{ label: string; url: string }>;
  className?: string;
  iconClassName?: string;
}) {
  if (!links?.length) return null;

  return (
    <div className={`${className} flex flex-wrap gap-2`}>
      {links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 border border-[#7f7f7f] bg-[#c0c0c0] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#404040] hover:bg-[#dfefff]"
        >
          {link.label} <ExternalLink className={iconClassName} />
        </a>
      ))}
    </div>
  );
}

// --- Window shells ---------------------------------------------------------

type DesktopWindowProps = {
  id: WindowId;
  title: string;
  icon: React.ReactNode;
  onClose: () => void;
  onToggleFill: () => void;
  isFilled: boolean;
  canToggleFill: boolean;
  onWindowDragStart: () => void;
  onWindowDragEnd: () => void;
  children: React.ReactNode;
};

function DesktopWindow({ title, icon, onClose, onToggleFill, isFilled, canToggleFill, onWindowDragStart, onWindowDragEnd, children }: DesktopWindowProps) {
  return (
    <motion.div layout className="max-w-full">
      <Frame className="flex flex-col bg-[#e5e5e5] text-black shadow-[2px_2px_0_#2b6262] lg:h-full">
        <div draggable onDragStart={onWindowDragStart} onDragEnd={onWindowDragEnd} className="flex cursor-grab items-center justify-between bg-[linear-gradient(90deg,#000080,#1084d0)] px-2 py-1 text-white active:cursor-grabbing">
          <div className="flex items-center gap-2">
            {icon}
            <p className="font-mono text-[11px] uppercase tracking-[0.08em]">{title}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label={isFilled ? "Move to split layout" : "Add to focus stack"}
              onClick={onToggleFill}
              disabled={!canToggleFill}
              className={`flex items-center justify-center h-8 min-w-[48px] border border-[#d9d9d9] px-1 text-[9px] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#404040] md:h-5 md:min-w-[42px] md:leading-[14px] ${isFilled ? "bg-[#dfefff] text-black" : "bg-[#c0c0c0] text-black"} ${canToggleFill ? "" : "cursor-not-allowed opacity-50"}`}
              title={canToggleFill ? (isFilled ? "Remove from focus stack and move to split grid." : "Add to the focused scroll stack at full width.") : "Open at least two windows to enable Fill."}
            >
              {isFilled ? "Split" : "Fill"}
            </button>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="flex items-center justify-center h-8 w-8 border border-[#d9d9d9] bg-[#c0c0c0] text-[11px] text-black shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#404040] md:h-5 md:w-5"
            >
              x
            </button>
          </div>
        </div>
        <div className="overflow-x-auto bg-[#f5f5f5] p-4 leading-relaxed lg:flex-1 lg:min-h-0 lg:overflow-auto">{children}</div>
      </Frame>
    </motion.div>
  );
}

// --- Page contents (window-friendly) --------------------------------------

// Mini Windows-style card for featured projects on Home.
function MiniProjectWindow({
  project,
  onMoreInfo,
}: {
  project: Project;
  onMoreInfo: (projectId: string) => void;
}) {
  return (
    <div className="border border-[#7f7f7f] bg-[#c0c0c0] shadow-[2px_2px_0_#2b6262]">
      <div className="flex items-center justify-between bg-[linear-gradient(90deg,#000080,#1084d0)] px-2 py-1 text-white">
        <p className="truncate font-mono text-[10px] uppercase tracking-[0.08em]">{project.title}</p>
      </div>
      <div className="bg-[#f5f5f5] p-3">
        <div className="mb-2 flex flex-wrap gap-1">
          <span className="border border-[#7f7f7f] bg-white px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em]">{project.focus}</span>
          <span className="border border-[#7f7f7f] bg-white px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em]">{project.status}</span>
        </div>
        <p className="text-sm leading-6">{project.summary}</p>
        <ProjectLinks links={project.links} iconClassName="h-3.5 w-3.5" />
        <div className="mt-3">
          <Button onClick={() => onMoreInfo(project.id)} className="bg-[#dfefff]">
            More Info
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProjectDetailContent({
  project,
  onBack,
}: {
  project: Project;
  onBack: () => void;
}) {
  return (
    <div className="border border-[#7f7f7f] bg-[#efefef] p-4 shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080]">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Button>
      </div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="border border-[#7f7f7f] bg-white px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">{project.focus}</span>
        <span className="border border-[#7f7f7f] bg-white px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">{project.status}</span>
      </div>
      <h3 className="text-2xl font-semibold leading-tight">{project.title}</h3>
      <p className="mt-3 leading-7">{project.details}</p>
      <ProjectLinks links={project.links} className="mt-4" />
      <div className="mt-4 grid gap-3 grid-cols-1">
        <div className="border border-[#7f7f7f] bg-white p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#000080]">Problem</p>
          <p className="mt-2 text-sm leading-6">{project.problem}</p>
        </div>
        <div className="border border-[#7f7f7f] bg-white p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#000080]">Process</p>
          <p className="mt-2 text-sm leading-6">{project.process}</p>
        </div>
        <div className="border border-[#7f7f7f] bg-white p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#000080]">Outcome</p>
          <p className="mt-2 text-sm leading-6">{project.outcome}</p>
        </div>
        {project.insight ? (
          <>
            <div className="border border-[#7f7f7f] bg-white p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#000080]">Reflection</p>
              <p className="mt-2 text-sm leading-6">{project.insight.reflection}</p>
            </div>
            <div className="border border-[#7f7f7f] bg-white p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#000080]">Key Decisions</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
                {project.insight.decisions.map((decision) => (
                  <li key={decision}>{decision}</li>
                ))}
              </ul>
            </div>
            {project.insight.learnings?.length ? (
              <div className="border border-[#7f7f7f] bg-white p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#000080]">Learnings</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
                  {project.insight.learnings.map((learning) => (
                    <li key={learning}>{learning}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="border border-[#7f7f7f] bg-white px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// Home screen content.
function HomeContent({ onMoreInfo }: { onMoreInfo: (projectId: string) => void }) {
  return (
    <div className="w-full max-w-[1100px]">
      <div className="border border-[#8fbcbc] bg-[#008080] p-3 shadow-[inset_1px_1px_0_#bce8e8,inset_-1px_-1px_0_#004f4f]">
        <div className="flex flex-col gap-4 sm:grid sm:h-full sm:grid-cols-[120px_1fr]">
          <div className="space-y-2 pt-1 text-white">
            <p className="text-[11px] font-mono uppercase tracking-[0.1em]">David Shamas OS</p>
            <p className="text-[11px] font-mono uppercase tracking-[0.1em] opacity-70">Click icons on the desktop to open windows.</p>
          </div>
          <div className="flex items-start justify-center pt-2">
            <Frame className="w-full max-w-[640px] bg-[#c0c0c0] p-0 text-black">
              <div className="flex items-center justify-between bg-[linear-gradient(90deg,#000080,#1084d0)] px-2 py-1 text-white">
                <p className="font-mono text-[11px] uppercase tracking-[0.08em]">Welcome to Experience</p>
              </div>
              <div className="p-4">
                <h2 className="text-4xl font-semibold leading-tight text-black">
                  <span className="font-black">My Design</span>
                </h2>
                <div className="mt-3 bg-[#f6f3ec] p-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#000080]">About Me</p>
                    <p className="mt-1 text-sm leading-6 text-[#111111]">
                      I am a UX designer focused on clear, usable experiences. I design interfaces that help people understand what to do next with less confusion and more confidence.
                    </p>
                  </div>
                </div>
              </div>
            </Frame>
          </div>
        </div>
        <div className="mt-4 border border-[#8fbcbc] bg-[#008080]/40 p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#f4f1e8]">Featured Projects</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_PROJECTS.map((project) => (
              <MiniProjectWindow key={project.id} project={project} onMoreInfo={onMoreInfo} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// About window content.
function AboutContent() {
  return (
    <div className="w-[880px] max-w-full">
      <Frame className="p-4">
        <ScreenLabel subtitle="About" title="About David Shamas" />
        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-[#7f7f7f] bg-[#efefef] p-4 shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080]">
            <p className="leading-7">I design system-first digital products that balance strong visual style with practical usability. My work focuses on making complex experiences feel clear, predictable, and engaging.</p>
            <p className="mt-3 leading-7">I care about interaction clarity, information architecture, and accessibility. I like blending creative interfaces with measurable outcomes so products look good and work well under real constraints.</p>
            <p className="mt-3 leading-7">This portfolio uses a Windows 95-inspired shell to reflect how I think: organized systems, visible states, and interactions that communicate what is happening.</p>
          </div>

          <div className="border border-[#7f7f7f] bg-[#efefef] p-4 shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080]">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#000080]">Core Focus</p>
            <div className="mt-2 space-y-2">
              <p className="border border-[#7f7f7f] bg-white px-3 py-2 text-sm">UX Systems</p>
              <p className="border border-[#7f7f7f] bg-white px-3 py-2 text-sm">AI Product Design</p>
              <p className="border border-[#7f7f7f] bg-white px-3 py-2 text-sm">Information Architecture</p>
              <p className="border border-[#7f7f7f] bg-white px-3 py-2 text-sm">Interaction Design</p>
            </div>
          </div>
        </div>
      </Frame>
    </div>
  );
}

// Objectives window content.
function ReferenceSlot({ reference }: { reference: ObjectiveReference }) {
  const title = resolveReferenceTitle(reference);
  const mediaLinks = resolveReferenceMedia(reference);

  if (!reference.id || !title) {
    return (
      <div className="flex items-center gap-2 border border-dashed border-[#7f7f7f] bg-[#f8f8f8] px-2 py-2 text-sm text-[#606060]">
        <SquareDashed className="h-3.5 w-3.5 shrink-0 text-[#000080]" />
        <span>Link pending</span>
      </div>
    );
  }

  return (
    <div className="border border-[#7f7f7f] bg-white p-2 shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080]">
      <p className="text-sm font-semibold">{title}</p>
      {mediaLinks.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {mediaLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 border border-[#7f7f7f] bg-[#efefef] px-2 py-1 text-[11px] shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080] hover:bg-[#dfefff]"
            >
              {link.label} <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ObjectivesContent() {
  return (
    <div className="w-[880px] max-w-full">
      <Frame className="p-4">
        <ScreenLabel subtitle="Objectives" title="HUMAN COMPUTER INTERACTION DEGREE OBJECTIVES" />
        <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
          <div className="border border-[#7f7f7f] bg-[#efefef] p-4 shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080]">
            <p className="leading-7">Core competencies for my Human Computer Interaction degree program.</p>
            <div className="mt-4 space-y-3">
              {DEGREE_OBJECTIVES.map((objective) => (
                <div key={objective.number} className="border border-[#7f7f7f] bg-white p-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#000080]">Objective {objective.number}</p>
                  <p className="mt-1 text-sm leading-6">{objective.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#7f7f7f] bg-[#efefef] p-4 shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080]">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#000080]">Objective Projects</p>
            <div className="mt-3 space-y-4">
              {DEGREE_OBJECTIVES.map((objective) => (
                <div key={objective.number}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#000080]">Objective {objective.number}</p>
                  <div className="mt-2 space-y-2">
                    {objective.references.map((reference, index) => (
                      <ReferenceSlot key={`${objective.number}-${index}`} reference={reference} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Frame>
    </div>
  );
}

// Lab window content — school concept projects shared on YouTube.
function LabContent({ highlightedLabId }: { highlightedLabId: string | null }) {
  return (
    <div className="w-[920px] max-w-full">
      <Frame className="p-4">
        <ScreenLabel subtitle="Concepts" title="Concept projects not yet built as full case studies." />
        <p className="mb-4 max-w-3xl leading-7">
          These are early school concept projects — explored on video but not fully developed into the complete case studies shown in Projects.
        </p>
        <a
          href={YOUTUBE_CONCEPT_PLAYLIST_URL}
          target="_blank"
          rel="noreferrer"
          className="mb-4 inline-flex items-center gap-2 border border-[#7f7f7f] bg-[#c0c0c0] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#404040]"
        >
          Watch full playlist <ExternalLink className="h-4 w-4" />
        </a>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {LAB_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`border border-[#7f7f7f] p-3 shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080] ${highlightedLabId === item.id ? "bg-[#dfefff]" : "bg-[#efefef]"}`}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em]">Concept</span>
                <SquareDashed className="h-3.5 w-3.5 text-[#000080]" />
              </div>
              <h3 className="text-lg font-semibold leading-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-6">{item.summary}</p>
              <a
                href={`https://www.youtube.com/watch?v=${item.youtubeId}&list=PLCIh1-EWC0c4`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 border border-[#7f7f7f] bg-white px-2 py-1 text-sm shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080] hover:bg-[#dfefff]"
              >
                Watch concept <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </Frame>
    </div>
  );
}

// Contact window content.
function ContactContent() {
  return (
    <div className="w-full max-w-[760px]">
      <Frame className="p-4">
        <ScreenLabel subtitle="Contact" title="Let’s build something useful." />
        <div className="flex flex-wrap gap-2">
          <a
            href="mailto:david.loadingexperiment@gmail.com"
            className="inline-flex items-center gap-2 border border-[#7f7f7f] bg-[#c0c0c0] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#404040]"
          >
            <Mail className="h-4 w-4" /> Email
          </a>
          <a
            href="tel:+14807890271"
            className="inline-flex items-center gap-2 border border-[#7f7f7f] bg-[#c0c0c0] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#404040]"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
          <a
            href="https://github.com/DaveLoading"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-[#7f7f7f] bg-[#c0c0c0] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#404040]"
          >
            <Github className="h-4 w-4" /> GitHub <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/david-shamas/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-[#7f7f7f] bg-[#c0c0c0] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#404040]"
          >
            <Linkedin className="h-4 w-4" /> LinkedIn <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href="https://www.behance.net/dshame"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-[#7f7f7f] bg-[#c0c0c0] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#404040]"
          >
            <Rocket className="h-4 w-4" /> Behance <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </Frame>
    </div>
  );
}

// Paint window: a small drawing app made with SVG.
function PaintContent() {
  // Tools the user can pick in the Paint toolbar.
  type PaintTool = "pencil" | "brush" | "line" | "rect" | "ellipse" | "eraser" | "spray" | "fill" | "text";
  // A stroke is one thing the user draws (line, shape, freehand, or text).
  type PaintStroke = {
    type: "path" | "line" | "rect" | "ellipse" | "text";
    color: string;
    width: number;
    points?: Array<{ x: number; y: number }>;
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    text?: string;
    fontSize?: number;
    fontWeight?: "400" | "700";
    fontStyle?: "normal" | "italic";
    fontFamily?: string;
  };

  type TextToolStyle = {
    fontSize: number;
    fontWeight: "400" | "700";
    fontStyle: "normal" | "italic";
    fontFamily: string;
  };

  type TextEditorState = {
    x: number;
    y: number;
    width: number;
    text: string;
    style: TextToolStyle;
  };

  // Fixed drawing size keeps pointer math simple and consistent.
  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 700;
  // Reference to the SVG so we can export it later.
  const svgRef = useRef<SVGSVGElement | null>(null);
  // Current tool and paint settings.
  const [activeTool, setActiveTool] = useState<PaintTool>("pencil");
  const [activeColor, setActiveColor] = useState<string>("#000000");
  const [brushSize, setBrushSize] = useState<number>(6);
  // Canvas background changes when user uses the Fill tool.
  const [canvasBgColor, setCanvasBgColor] = useState<string>("#fffdf8");
  // "strokes" are finished marks; "draftStroke" is the one in progress.
  const [strokes, setStrokes] = useState<PaintStroke[]>([]);
  const [draftStroke, setDraftStroke] = useState<PaintStroke | null>(null);
  // Text settings for the text tool.
  const [textToolStyle, setTextToolStyle] = useState<TextToolStyle>({
    fontSize: 28,
    fontWeight: "400",
    fontStyle: "normal",
    fontFamily: "Arial",
  });
  // Temporary text editor box that appears on the canvas.
  const [textEditor, setTextEditor] = useState<TextEditorState | null>(null);
  // True only while pointer is dragging to draw.
  const [isDrawing, setIsDrawing] = useState(false);

  // Paint color choices (classic palette feel).
  const palette = [
    "#000000",
    "#808080",
    "#800000",
    "#808000",
    "#008000",
    "#008080",
    "#000080",
    "#800080",
    "#ffffff",
    "#c0c0c0",
    "#ff0000",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#0000ff",
    "#ff00ff",
  ];

  const toolButtons: Array<{ id: PaintTool; label: string; icon: React.ReactNode }> = [
    { id: "pencil", label: "Pencil", icon: <Pencil className="h-3.5 w-3.5" /> },
    { id: "brush", label: "Brush", icon: <Brush className="h-3.5 w-3.5" /> },
    { id: "line", label: "Line", icon: <Minus className="h-3.5 w-3.5" /> },
    { id: "rect", label: "Rectangle", icon: <Square className="h-3.5 w-3.5" /> },
    { id: "ellipse", label: "Ellipse", icon: <Circle className="h-3.5 w-3.5" /> },
    { id: "spray", label: "Spray", icon: <SprayCan className="h-3.5 w-3.5" /> },
    { id: "fill", label: "Fill", icon: <PaintBucket className="h-3.5 w-3.5" /> },
    { id: "text", label: "Text", icon: <Type className="h-3.5 w-3.5" /> },
    { id: "eraser", label: "Eraser", icon: <Eraser className="h-3.5 w-3.5" /> },
  ];

  // Convert mouse/touch position on screen to canvas coordinates.
  const getCanvasPoint = (event: React.PointerEvent<HTMLDivElement>) => {
    // Read the canvas size on screen.
    const bounds = event.currentTarget.getBoundingClientRect();
    // Keep pointer position inside the visible box.
    const rawX = Math.max(0, Math.min(event.clientX - bounds.left, bounds.width));
    const rawY = Math.max(0, Math.min(event.clientY - bounds.top, bounds.height));
    // Scale screen position to SVG coordinate space.
    const x = (rawX / bounds.width) * CANVAS_WIDTH;
    const y = (rawY / bounds.height) * CANVAS_HEIGHT;
    return { x, y };
  };

  // Turn the text editor box into a permanent SVG text stroke.
  const applyTextLayer = () => {
    // If no text box is open, there is nothing to save.
    if (!textEditor) return;
    // Ignore empty text so blank labels are not saved.
    if (!textEditor.text.trim()) {
      setTextEditor(null);
      return;
    }

    // Save typed text as a real stroke so it stays on the canvas.
    setStrokes((prev) => [
      ...prev,
      {
        type: "text",
        color: activeColor,
        width: 1,
        start: { x: textEditor.x, y: textEditor.y },
        text: textEditor.text,
        fontSize: textEditor.style.fontSize,
        fontWeight: textEditor.style.fontWeight,
        fontStyle: textEditor.style.fontStyle,
        fontFamily: textEditor.style.fontFamily,
      },
    ]);
    setTextEditor(null);
  };

  // Start drawing or place text when pointer goes down.
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const startPoint = getCanvasPoint(event);

    // Fill tool paints the whole background in one click.
    if (activeTool === "fill") {
      setCanvasBgColor(activeColor);
      return;
    }

    // Text tool opens an editor box where user clicked.
    if (activeTool === "text") {
      if (textEditor) return;
      setTextEditor({
        x: startPoint.x,
        y: startPoint.y,
        width: 280,
        text: "",
        style: textToolStyle,
      });
      return;
    }

    setIsDrawing(true);
    // Freehand tools use a growing list of points.
    const isPathTool = activeTool === "pencil" || activeTool === "brush" || activeTool === "eraser" || activeTool === "spray";
    // Eraser is just drawing with the background color.
    const strokeColor = activeTool === "eraser" ? canvasBgColor : activeColor;
    // Each tool uses a different default thickness.
    const strokeWidth = activeTool === "brush" ? brushSize : activeTool === "eraser" ? 12 : activeTool === "spray" ? 2 : 3;

    // Spray starts by dropping random dots near the pointer.
    if (activeTool === "spray") {
      const sprayPoints = Array.from({ length: 12 }, () => ({
        x: startPoint.x + (Math.random() * 12 - 6),
        y: startPoint.y + (Math.random() * 12 - 6),
      }));
      setDraftStroke({ type: "path", color: strokeColor, width: strokeWidth, points: sprayPoints });
      return;
    }

    // Start either a freehand path or a shape draft.
    setDraftStroke(
      isPathTool
        ? {
            type: "path",
            color: strokeColor,
            width: strokeWidth,
            points: [startPoint],
          }
        : {
            type: activeTool,
            color: strokeColor,
            width: strokeWidth,
            start: startPoint,
            end: startPoint,
          },
    );
  };

  // Keep updating the draft shape while user drags.
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    // Do nothing if user is not currently dragging.
    if (!isDrawing) return;

    const nextPoint = getCanvasPoint(event);
    setDraftStroke((prev) => {
      if (!prev) return prev;

      if (activeTool === "spray") {
        // Add more random dots each move for spray effect.
        const sprayPoints = Array.from({ length: 8 }, () => ({
          x: nextPoint.x + (Math.random() * 14 - 7),
          y: nextPoint.y + (Math.random() * 14 - 7),
        }));
        return {
          ...prev,
          points: [...(prev.points ?? []), ...sprayPoints],
        };
      }

      if (prev.type === "path") {
        // Freehand tools grow point by point.
        return {
          ...prev,
          points: [...(prev.points ?? []), nextPoint],
        };
      }

      // Shape tools update only their end point while dragging.
      return {
        ...prev,
        end: nextPoint,
      };
    });
  };

  // Save draft stroke into the real strokes list when drawing ends.
  const commitDraft = () => {
    setIsDrawing(false);
    setDraftStroke((prev) => {
      if (!prev) return null;
      // Skip invalid empty paths.
      if (prev.type === "path" && !(prev.points && prev.points.length)) return null;
      // Move draft into permanent strokes list.
      setStrokes((existing) => [...existing, prev]);
      return null;
    });
  };

  // Wipe the drawing and reset background color.
  const clearCanvas = () => {
    setStrokes([]);
    setDraftStroke(null);
    setCanvasBgColor("#fffdf8");
  };

  // Draw one stroke based on its type (line, text, box, etc.).
  const renderStroke = (stroke: PaintStroke, key: string) => {
    if (stroke.type === "path") {
      // "polyline" connects many points for freehand drawing.
      return (
        <polyline
          key={key}
          fill="none"
          stroke={stroke.color}
          strokeWidth={stroke.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={(stroke.points ?? []).map((point) => `${point.x},${point.y}`).join(" ")}
        />
      );
    }

    if (stroke.type === "text") {
      if (!stroke.start || !stroke.text) return null;
      // Draw saved text directly on the SVG.
      return (
        <text
          key={key}
          x={stroke.start.x}
          y={stroke.start.y}
          fill={stroke.color}
          fontSize={stroke.fontSize ?? 28}
          fontFamily={stroke.fontFamily ?? "Arial"}
          fontWeight={stroke.fontWeight ?? "400"}
          fontStyle={stroke.fontStyle ?? "normal"}
        >
          {stroke.text}
        </text>
      );
    }

    const start = stroke.start;
    const end = stroke.end;
    if (!start || !end) return null;

    if (stroke.type === "line") {
      // Simple straight line from start to end.
      return <line key={key} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={stroke.color} strokeWidth={stroke.width} strokeLinecap="round" />;
    }

    // Rectangle math: get top-left corner and positive size.
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);

    if (stroke.type === "ellipse") {
      // Ellipse uses center point + radius values.
      return (
        <ellipse
          key={key}
          cx={x + width / 2}
          cy={y + height / 2}
          rx={width / 2}
          ry={height / 2}
          fill="none"
          stroke={stroke.color}
          strokeWidth={stroke.width}
        />
      );
    }

    return <rect key={key} x={x} y={y} width={width} height={height} fill="none" stroke={stroke.color} strokeWidth={stroke.width} />;
  };

  // Export drawing as a PNG file for download.
  const saveImage = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    // Turn SVG content into a blob URL we can load as an image.
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
      // Draw SVG onto a real canvas so we can export PNG.
      const canvas = document.createElement("canvas");
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(svgUrl);
        return;
      }

      // Paint background first so transparent areas look correct.
      context.fillStyle = canvasBgColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      canvas.toBlob((blob) => {
        if (!blob) {
          URL.revokeObjectURL(svgUrl);
          return;
        }

        // Create a temporary link and force download.
        const fileUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = fileUrl;
        downloadLink.download = `paint-${Date.now()}.png`;
        downloadLink.click();
        URL.revokeObjectURL(fileUrl);
        URL.revokeObjectURL(svgUrl);
      }, "image/png");
    };

    // Trigger image loading, which starts export flow above.
    image.src = svgUrl;
  };

  return (
    <div className="w-full max-w-[920px]">
      <Frame className="p-0">
        <div className="flex items-center justify-between border-b border-[#7f7f7f] bg-[#dcdcdc] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em]">
          <p>Making UX an Experience that lasts</p>
          <p>Loading... - Paint</p>
        </div>
        <div className="grid grid-cols-[56px_1fr] sm:grid-cols-[68px_1fr]">
          <div className="border-r border-[#7f7f7f] bg-[#efefef] p-1.5">
            <div className="grid grid-cols-2 gap-1">
              {toolButtons.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  aria-label={tool.label}
                  title={tool.label}
                  // Pick the current drawing tool.
                  onClick={() => setActiveTool(tool.id)}
                  className={`flex h-8 items-center justify-center border ${activeTool === tool.id ? "border-[#000080] bg-[#dfefff]" : "border-[#7f7f7f] bg-white"} shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080]`}
                >
                  {tool.icon}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white p-3">
            <div
              className="relative h-[300px] w-full cursor-crosshair border border-[#7f7f7f] sm:h-[360px]"
              style={{ backgroundColor: canvasBgColor, touchAction: "none" }}
              // Pointer events drive drawing behavior (touchAction none prevents scroll interference).
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={commitDraft}
              onPointerLeave={commitDraft}
            >
              <svg ref={svgRef} viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-label="Paint canvas">
                {/* Draw finished strokes first, then draft on top. */}
                {strokes.map((stroke, index) => renderStroke(stroke, `stroke-${index}`))}
                {draftStroke ? renderStroke(draftStroke, "draft-stroke") : null}
              </svg>
              {textEditor ? (
                <div
                  className="absolute border border-[#000080] bg-white/95 p-1 shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080]"
                  style={{
                    left: `${(textEditor.x / CANVAS_WIDTH) * 100}%`,
                    top: `${(textEditor.y / CANVAS_HEIGHT) * 100}%`,
                    width: `${(textEditor.width / CANVAS_WIDTH) * 100}%`,
                    minWidth: "160px",
                  }}
                >
                  <textarea
                    value={textEditor.text}
                    // Keep textarea text synced with React state.
                    onChange={(event) => setTextEditor((prev) => (prev ? { ...prev, text: event.target.value } : prev))}
                    placeholder="Type text..."
                    className="min-h-[90px] w-full resize-none border border-[#7f7f7f] bg-white p-1 text-sm leading-5 text-black"
                    style={{
                      fontFamily: textEditor.style.fontFamily,
                      fontSize: `${textEditor.style.fontSize}px`,
                      fontWeight: textEditor.style.fontWeight,
                      fontStyle: textEditor.style.fontStyle,
                    }}
                  />
                  <div className="mt-1 flex items-center gap-1">
                    <Button onClick={applyTextLayer}>Apply Text</Button>
                    <Button onClick={() => setTextEditor(null)}>Cancel</Button>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1">
              <Button onClick={clearCanvas}>Clear Paint</Button>
              <Button onClick={saveImage}>Save</Button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 border border-[#7f7f7f] bg-[#efefef] p-1.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#333]">Brush Size</p>
              <input
                type="range"
                min={1}
                max={24}
                value={brushSize}
                // Slider and number input both control brush size.
                onChange={(event) => setBrushSize(Number(event.target.value))}
                className="h-4 w-[140px]"
                aria-label="Brush size"
              />
              <input
                type="number"
                min={1}
                max={24}
                value={brushSize}
                onChange={(event) => {
                  const nextValue = Number(event.target.value);
                  if (Number.isNaN(nextValue)) return;
                  // Clamp value so it always stays in 1..24.
                  setBrushSize(Math.min(24, Math.max(1, nextValue)));
                }}
                className="w-[56px] border border-[#7f7f7f] bg-white px-2 py-1 font-mono text-[11px]"
                aria-label="Brush size value"
              />
            </div>
            {activeTool === "text" ? (
              <div className="mt-2 flex flex-wrap items-center gap-1 border border-[#7f7f7f] bg-[#efefef] p-1.5">
                <select
                  value={textToolStyle.fontFamily}
                  onChange={(event) => {
                    const nextFamily = event.target.value;
                    // Update default text style and live editor style.
                    setTextToolStyle((prev) => ({ ...prev, fontFamily: nextFamily }));
                    setTextEditor((prev) => (prev ? { ...prev, style: { ...prev.style, fontFamily: nextFamily } } : prev));
                  }}
                  className="border border-[#7f7f7f] bg-white px-2 py-1 font-mono text-[11px] uppercase"
                >
                  <option value="Arial">Arial</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Times New Roman">Times</option>
                  <option value="Courier New">Courier</option>
                </select>
                <input
                  type="number"
                  min={8}
                  max={96}
                  value={textToolStyle.fontSize}
                  onChange={(event) => {
                    const nextSize = Number(event.target.value) || 28;
                    // Update default text size and current editor box.
                    setTextToolStyle((prev) => ({ ...prev, fontSize: nextSize }));
                    setTextEditor((prev) => (prev ? { ...prev, style: { ...prev.style, fontSize: nextSize } } : prev));
                  }}
                  className="w-[70px] border border-[#7f7f7f] bg-white px-2 py-1 font-mono text-[11px]"
                />
                <Button
                  className={textToolStyle.fontWeight === "700" ? "bg-[#dfefff]" : ""}
                  onClick={() => {
                    const nextWeight = textToolStyle.fontWeight === "700" ? "400" : "700";
                    setTextToolStyle((prev) => ({ ...prev, fontWeight: nextWeight }));
                    setTextEditor((prev) => (prev ? { ...prev, style: { ...prev.style, fontWeight: nextWeight } } : prev));
                  }}
                >
                  B
                </Button>
                <Button
                  className={textToolStyle.fontStyle === "italic" ? "bg-[#dfefff]" : ""}
                  onClick={() => {
                    const nextStyle = textToolStyle.fontStyle === "italic" ? "normal" : "italic";
                    setTextToolStyle((prev) => ({ ...prev, fontStyle: nextStyle }));
                    setTextEditor((prev) => (prev ? { ...prev, style: { ...prev.style, fontStyle: nextStyle } } : prev));
                  }}
                >
                  I
                </Button>
              </div>
            ) : null}
            <div className="mt-2 grid grid-cols-8 gap-1">
              {palette.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setActiveColor(color)}
                  aria-label={`Select ${color} color`}
                  className={`h-5 border ${activeColor === color ? "border-black" : "border-[#7f7f7f]"}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#333]">Color: {activeColor}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#333]">Tool: {activeTool}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#333]">Brush: {brushSize}px</p>
          </div>
        </div>
      </Frame>
    </div>
  );
}

// Solitaire window: simple drag-and-drop card game.
function SolitaireContent() {
  // Card ranks and suits used to build the deck.
  const ranks: CardRank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const suits: CardSuit[] = ["H", "D", "S", "C"];
  // Number values make rank comparisons easy.
  const rankValue: Record<CardRank, number> = {
    A: 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 11,
    Q: 12,
    K: 13,
  };

  const suitMeta: Record<CardSuit, { icon: React.ReactNode; isRed: boolean }> = {
    H: { icon: <Heart className="h-3.5 w-3.5 fill-current" />, isRed: true },
    D: { icon: <Diamond className="h-3.5 w-3.5 fill-current" />, isRed: true },
    S: { icon: <Spade className="h-3.5 w-3.5 fill-current" />, isRed: false },
    C: { icon: <Club className="h-3.5 w-3.5 fill-current" />, isRed: false },
  };

  // Make and shuffle a full 52-card deck.
  const createDeck = (): Card[] => {
    const deck: Card[] = [];
    // Build 52 cards (13 ranks x 4 suits).
    suits.forEach((suit) => {
      ranks.forEach((rank) => {
        // Add random tail so every card id is unique.
        deck.push({ id: `${rank}${suit}-${Math.random().toString(36).slice(2, 10)}`, rank, suit });
      });
    });

    // Fisher-Yates shuffle: swap each card with a random earlier card.
    for (let i = deck.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
  };

  // Helper: red suits are hearts and diamonds.
  const isRedSuit = (suit: CardSuit) => suitMeta[suit].isRed;

  // A moving stack is valid when colors alternate and numbers go down by 1.
  const isValidSequence = (cards: Card[]) => {
    if (cards.length <= 1) return true;
    for (let i = 0; i < cards.length - 1; i += 1) {
      const current = cards[i];
      const next = cards[i + 1];
      if (isRedSuit(current.suit) === isRedSuit(next.suit)) return false;
      if (rankValue[current.rank] !== rankValue[next.rank] + 1) return false;
    }
    return true;
  };

  // Deal cards into 7 columns and set up empty piles.
  const initializeGame = () => {
    const deck = createDeck();
    // 7 tableau columns in solitaire.
    const nextColumns: Card[][] = Array.from({ length: 7 }, () => []);

    // Deal 1 card to first column, 2 to second, ... 7 to last.
    for (let i = 0; i < 7; i += 1) {
      for (let j = 0; j <= i; j += 1) {
        const nextCard = deck.pop();
        if (nextCard) nextColumns[i].push(nextCard);
      }
    }

    return {
      columns: nextColumns,
      // Remaining cards become the stock pile.
      stock: deck,
      waste: [] as Card[],
      foundations: { H: [] as Card[], D: [] as Card[], S: [] as Card[], C: [] as Card[] },
      score: 0,
    };
  };

  const [game, setGame] = useState(initializeGame);
  // Stores what cards are being dragged right now.
  const [dragState, setDragState] = useState<{
    source: "column" | "waste";
    fromColumn?: number;
    startIndex?: number;
    cards: Card[];
  } | null>(null);

  // Draw from stock to waste; if stock is empty, recycle waste back to stock.
  const drawCard = () => {
    setGame((prev) => {
      // If stock is empty, recycle waste back into stock.
      if (!prev.stock.length) {
        if (!prev.waste.length) return prev;
        return {
          ...prev,
          stock: [...prev.waste].reverse(),
          waste: [],
          score: Math.max(prev.score - 10, 0),
        };
      }

      const nextStock = [...prev.stock];
      const nextCard = nextStock.pop();
      if (!nextCard) return prev;

      // Move one card from stock to waste.
      return {
        ...prev,
        stock: nextStock,
        waste: [...prev.waste, nextCard],
      };
    });
  };

  // Foundation piles build up by suit from Ace to King.
  const canPlaceOnFoundation = (card: Card, foundation: Card[]) => {
    // Empty foundation starts with Ace.
    if (!foundation.length) return card.rank === "A";
    const top = foundation[foundation.length - 1];
    // Must match suit and be one rank higher than top card.
    return top.suit === card.suit && rankValue[card.rank] === rankValue[top.rank] + 1;
  };

  // Move top waste card to matching foundation if allowed.
  const moveWasteToFoundation = () => {
    setGame((prev) => {
      const nextWaste = [...prev.waste];
      const card = nextWaste[nextWaste.length - 1];
      if (!card) return prev;

      const foundation = prev.foundations[card.suit];
      // Stop if rules say card does not fit.
      if (!canPlaceOnFoundation(card, foundation)) return prev;

      // Remove from waste and add to its foundation pile.
      nextWaste.pop();
      return {
        ...prev,
        waste: nextWaste,
        foundations: {
          ...prev.foundations,
          [card.suit]: [...foundation, card],
        },
        score: prev.score + 10,
      };
    });
  };

  // Move top card of a column to foundation if it fits.
  const moveColumnTopToFoundation = (columnIndex: number) => {
    setGame((prev) => {
      // Clone arrays so we do immutable state updates.
      const nextColumns = prev.columns.map((column) => [...column]);
      const column = nextColumns[columnIndex];
      const card = column[column.length - 1];
      if (!card) return prev;

      const foundation = prev.foundations[card.suit];
      if (!canPlaceOnFoundation(card, foundation)) return prev;

      // Take top card from selected column.
      column.pop();
      return {
        ...prev,
        columns: nextColumns,
        foundations: {
          ...prev.foundations,
          [card.suit]: [...foundation, card],
        },
        score: prev.score + 10,
      };
    });
  };

  // Tableau rule: place opposite color and one rank lower.
  const canPlaceOnTableau = (cards: Card[], destinationColumn: Card[]) => {
    if (!cards.length) return false;
    const firstMoving = cards[0];
    const destinationTop = destinationColumn[destinationColumn.length - 1];

    // Empty tableau column can only start with a King.
    if (!destinationTop) return firstMoving.rank === "K";

    // Otherwise: opposite color and one lower than destination top.
    return isRedSuit(destinationTop.suit) !== isRedSuit(firstMoving.suit) && rankValue[firstMoving.rank] === rankValue[destinationTop.rank] - 1;
  };

  // Drop currently dragged cards onto a target column.
  const handleDropOnColumn = (targetColumn: number) => {
    if (!dragState) return;

    setGame((prev) => {
      const nextColumns = prev.columns.map((column) => [...column]);
      const movingCards = dragState.cards;
      const destinationColumn = nextColumns[targetColumn];

      // Cancel drop if stack cannot legally land here.
      if (!movingCards.length || !canPlaceOnTableau(movingCards, destinationColumn)) {
        return prev;
      }

      if (dragState.source === "column") {
        if (typeof dragState.fromColumn !== "number" || typeof dragState.startIndex !== "number") return prev;
        if (dragState.fromColumn === targetColumn) return prev;
        const sourceColumn = nextColumns[dragState.fromColumn];
        // Remove dragged cards from source column.
        nextColumns[dragState.fromColumn] = sourceColumn.slice(0, dragState.startIndex);
      }

      if (dragState.source === "waste") {
        const wasteTop = prev.waste[prev.waste.length - 1];
        // Safety check: dragged waste card must still be the top waste card.
        if (!wasteTop || wasteTop.id !== movingCards[0].id) return prev;
      }

      // Add moving cards to target column.
      nextColumns[targetColumn] = [...destinationColumn, ...movingCards];

      // If source was waste, remove one card from waste pile.
      const nextWaste = dragState.source === "waste" ? prev.waste.slice(0, -1) : prev.waste;

      return {
        ...prev,
        columns: nextColumns,
        waste: nextWaste,
        score: prev.score + 5,
      };
    });

    setDragState(null);
  };

  // Tap a card onto a foundation pile (mobile tap-to-place).
  const handleDropOnFoundation = (suit: CardSuit) => {
    if (!dragState || dragState.cards.length !== 1) { setDragState(null); return; }
    const card = dragState.cards[0];
    if (!canPlaceOnFoundation(card, game.foundations[suit])) { setDragState(null); return; }
    setGame((prev) => {
      const nextFoundations = { ...prev.foundations, [suit]: [...prev.foundations[suit], card] };
      const nextColumns = prev.columns.map((col) => [...col]);
      let nextWaste = [...prev.waste];
      if (dragState.source === "column" && typeof dragState.fromColumn === "number" && typeof dragState.startIndex === "number") {
        nextColumns[dragState.fromColumn] = nextColumns[dragState.fromColumn].slice(0, dragState.startIndex);
      } else if (dragState.source === "waste") {
        nextWaste = prev.waste.slice(0, -1);
      }
      return { ...prev, foundations: nextFoundations, columns: nextColumns, waste: nextWaste, score: prev.score + 10 };
    });
    setDragState(null);
  };

  // Start a fresh game.
  const restart = () => {
    setGame(initializeGame());
    setDragState(null);
  };

  return (
    <div className="w-full max-w-[1120px]">
      <Frame className="p-3">
        <div className="mb-3 flex items-center justify-between border border-[#7f7f7f] bg-[#e8e8e8] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em]">
          <p className="hidden md:block">Game Draw Move Drag Drop Foundation</p>
          <p className="md:hidden">Solitaire</p>
          <p>Score: {String(game.score).padStart(5, "0")}</p>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Button onClick={drawCard}>Draw</Button>
          <Button onClick={moveWasteToFoundation}>Move Waste</Button>
          <Button onClick={restart}>New Game</Button>
          <p className="hidden md:block font-mono text-[10px] uppercase tracking-[0.1em]">Drag card stacks between columns. Double-click top card to move to foundation.</p>
          <p className="md:hidden font-mono text-[10px] uppercase tracking-[0.1em]">Tap a card to select it, tap a column or foundation to move it.</p>
        </div>
        {/* Tap the green board background to cancel any active selection. */}
        <div
          className="border border-[#7f7f7f] bg-[#0a6f2a] p-4 shadow-[inset_1px_1px_0_#3aa45a,inset_-1px_-1px_0_#084b1e]"
          onClick={() => { if (dragState) setDragState(null); }}
        >
          <div className="overflow-x-auto pb-1">
            <div className="grid min-w-[680px] grid-cols-6 gap-3">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); drawCard(); }}
              className="h-28 rounded-sm border border-[#d9d9d9] bg-[#f7f7f7] p-2 shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080]"
            >
              <div className="h-full rounded-sm border border-[#7f7f7f] bg-[repeating-linear-gradient(45deg,#0b3d8f,#0b3d8f_4px,#1555b7_4px,#1555b7_8px)]" />
              <p className="mt-1 inline-block border border-[#7f7f7f] bg-[#f3f3f3] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-black">Stock: {game.stock.length}</p>
            </button>
            {/* Waste pile: tap to select for placing on a column; drag still works on desktop. */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (dragState) { setDragState(null); return; }
                if (!game.waste.length) return;
                setDragState({ source: "waste", cards: [game.waste[game.waste.length - 1]] });
              }}
              className="h-28 rounded-sm border border-[#d9d9d9] bg-[#f7f7f7] p-2 text-left shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080]"
            >
              {game.waste.length ? (
                <div
                  draggable
                  onDragStart={(e) => { e.stopPropagation(); setDragState({ source: "waste", cards: [game.waste[game.waste.length - 1]] }); }}
                  onDragEnd={() => setDragState(null)}
                  className={`h-full rounded-sm border border-[#7f7f7f] bg-white p-2 transition-all ${suitMeta[game.waste[game.waste.length - 1].suit].isRed ? "text-[#b00020]" : "text-black"} ${dragState?.source === "waste" ? "ring-2 ring-[#ffe169] ring-offset-1" : ""}`}
                >
                  <p className="font-mono text-sm font-semibold">{game.waste[game.waste.length - 1].rank}</p>
                  <div className="mt-1">{suitMeta[game.waste[game.waste.length - 1].suit].icon}</div>
                </div>
              ) : (
                <div className="h-full rounded-sm border border-dashed border-[#7f7f7f]" />
              )}
            </button>
            {/* Foundation piles: tap to drop the selected card here. */}
            {(["H", "D", "S", "C"] as CardSuit[]).map((suit) => {
              const top = game.foundations[suit][game.foundations[suit].length - 1];
              return (
                <div
                  key={suit}
                  className={`h-28 cursor-pointer rounded-sm border border-[#d9d9d9] bg-[#f7f7f7] p-2 shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080] transition-all ${dragState && dragState.cards.length === 1 ? "ring-2 ring-[#ffe169] ring-offset-1" : ""}`}
                  onClick={(e) => { e.stopPropagation(); handleDropOnFoundation(suit); }}
                >
                  {top ? (
                    <div className={`h-full rounded-sm border border-[#7f7f7f] bg-white p-2 ${suitMeta[top.suit].isRed ? "text-[#b00020]" : "text-black"}`}>
                      <p className="font-mono text-sm font-semibold">{top.rank}</p>
                      <div className="mt-1">{suitMeta[top.suit].icon}</div>
                    </div>
                  ) : (
                    <div className="h-full rounded-sm border border-dashed border-[#7f7f7f] p-2">
                      <div className={`${suitMeta[suit].isRed ? "text-[#b00020]" : "text-black"}`}>{suitMeta[suit].icon}</div>
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <div className="grid min-w-[860px] grid-cols-7 gap-3 pb-1">
              {game.columns.map((column, columnIndex) => (
                <div
                  key={`column-${columnIndex}`}
                  className={`min-h-[260px] cursor-pointer rounded-sm border p-2 shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080] ${dragState ? "border-[#1a5f2b] bg-[#dcf3e1]" : "border-[#d9d9d9] bg-[#e6f6ea]"}`}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(e) => { e.stopPropagation(); handleDropOnColumn(columnIndex); }}
                  onClick={(e) => { e.stopPropagation(); if (dragState) handleDropOnColumn(columnIndex); }}
                >
                  {column.length ? (
                    column.map((card, cardIndex) => {
                      const isRed = suitMeta[card.suit].isRed;
                      const movingSequence = column.slice(cardIndex);
                      // Highlight cards that are part of the active tap selection.
                      const isSelected = dragState?.source === "column" && dragState.fromColumn === columnIndex && dragState.startIndex !== undefined && cardIndex >= dragState.startIndex;
                      return (
                        <div
                          key={card.id}
                          draggable
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            if (cardIndex === column.length - 1) moveColumnTopToFoundation(columnIndex);
                          }}
                          onDragStart={(event) => {
                            if (!isValidSequence(movingSequence)) { event.preventDefault(); return; }
                            setDragState({ source: "column", fromColumn: columnIndex, startIndex: cardIndex, cards: movingSequence });
                          }}
                          onDragEnd={() => setDragState(null)}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => { event.preventDefault(); event.stopPropagation(); handleDropOnColumn(columnIndex); }}
                          onClick={(event) => {
                            event.stopPropagation();
                            if (dragState) {
                              // A card is already selected — treat tap on any card as placing on this column.
                              handleDropOnColumn(columnIndex);
                            } else {
                              // Select this card and the valid sequence below it.
                              if (!isValidSequence(movingSequence)) return;
                              setDragState({ source: "column", fromColumn: columnIndex, startIndex: cardIndex, cards: movingSequence });
                            }
                          }}
                          className={`relative ${cardIndex === 0 ? "mt-0" : "-mt-24"} h-36 cursor-pointer rounded-sm border bg-white p-2 shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080] transition-all ${isSelected ? "border-[#ffe169] ring-2 ring-[#ffe169] ring-offset-1" : "border-[#9d9d9d]"}`}
                        >
                          <p className={`font-mono text-sm font-semibold ${isRed ? "text-[#b00020]" : "text-black"}`}>{card.rank}</p>
                          <div className={`${isRed ? "text-[#b00020]" : "text-black"}`}>{suitMeta[card.suit].icon}</div>
                          <div className={`absolute bottom-1 right-1 ${isRed ? "text-[#b00020]" : "text-black"}`}>{suitMeta[card.suit].icon}</div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#333]">
                      {dragState ? "Drop King here" : "Empty — King only"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Frame>
    </div>
  );
}

// Projects window with filters and next/previous controls.
function ProjectsContent({
  navTarget,
  onNavHandled,
  projectDetailId,
  onCloseDetail,
  onMoreInfo,
}: {
  navTarget: PortfolioNavTarget | null;
  onNavHandled: () => void;
  projectDetailId: string | null;
  onCloseDetail: () => void;
  onMoreInfo: (projectId: string) => void;
}) {
  const [activeFocus, setActiveFocus] = useState<"All" | ProjectFocus>("All");
  const [activeProjectId, setActiveProjectId] = useState<string>(PROJECTS[0].id);

  useEffect(() => {
    if (navTarget?.window !== "projects") return;
    setActiveFocus("All");
    setActiveProjectId(navTarget.projectId);
    onNavHandled();
  }, [navTarget, onNavHandled]);

  useEffect(() => {
    if (projectDetailId) {
      setActiveFocus("All");
      setActiveProjectId(projectDetailId);
    }
  }, [projectDetailId]);

  const detailProject = projectDetailId ? PROJECTS.find((project) => project.id === projectDetailId) : null;

  // Only show projects that match the selected focus.
  const visibleProjects = useMemo(() => (activeFocus === "All" ? PROJECTS : PROJECTS.filter((project) => project.focus === activeFocus)), [activeFocus]);

  const activeProject =
    visibleProjects.find((project) => project.id === activeProjectId) ??
    visibleProjects[0] ??
    PROJECTS[0];

  const activeIndex = Math.max(
    visibleProjects.findIndex((project) => project.id === activeProject.id),
    0,
  );

  // Move to previous project in the filtered list.
  const goPrevious = () => {
    const previousIndex = Math.max(activeIndex - 1, 0);
    const previousProject = visibleProjects[previousIndex];
    if (previousProject) setActiveProjectId(previousProject.id);
  };

  // Move to next project in the filtered list.
  const goNext = () => {
    const nextIndex = Math.min(activeIndex + 1, visibleProjects.length - 1);
    const nextProject = visibleProjects[nextIndex];
    if (nextProject) setActiveProjectId(nextProject.id);
  };

  return (
    <div className="w-full max-w-[1180px]">
      <Frame className="p-4">
        <ScreenLabel subtitle="Projects" title="Fully built projects with complete case studies." />
        <p className="mb-4 max-w-3xl leading-7">In-depth work with problem, process, outcome, and deliverables — the portfolio&apos;s finished project space.</p>
        {detailProject ? (
          <ProjectDetailContent project={detailProject} onBack={onCloseDetail} />
        ) : (
          <>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {focusFilters.map((focus) => (
            <Button
              key={focus}
              onClick={() => {
                setActiveFocus(focus);
                const nextList = focus === "All" ? PROJECTS : PROJECTS.filter((project) => project.focus === focus);
                setActiveProjectId(nextList[0]?.id ?? PROJECTS[0].id);
              }}
              className={activeFocus === focus ? "bg-[#dfefff]" : ""}
            >
              {focus}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 2xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-2 2xl:max-h-[56vh] 2xl:overflow-y-auto 2xl:pr-1">
            {visibleProjects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                onClick={() => setActiveProjectId(project.id)}
                className={`w-full border border-[#7f7f7f] px-3 py-3 text-left shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080] ${index === activeIndex ? "bg-[#dfefff]" : "bg-[#efefef]"}`}
              >
                <p className="font-semibold">{project.title}</p>
                <p className="mt-2 text-sm leading-6">{project.summary}</p>
              </button>
            ))}
            <div className="flex items-center gap-2">
              <Button onClick={goPrevious}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button onClick={goNext}>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em]">
                {visibleProjects.length ? activeIndex + 1 : 0} / {visibleProjects.length}
              </p>
            </div>
          </div>
          <div>
            {visibleProjects.length ? (
              <div className="border border-[#7f7f7f] bg-[#efefef] p-4 shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#808080]">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="border border-[#7f7f7f] bg-white px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">{activeProject.focus}</span>
                  <span className="border border-[#7f7f7f] bg-white px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">{activeProject.status}</span>
                </div>
                <h3 className="text-2xl font-semibold leading-tight">{activeProject.title}</h3>
                <p className="mt-3 leading-7">{activeProject.details}</p>
                <ProjectLinks links={activeProject.links} className="mt-4" />
                <div className="mt-4 grid gap-3 grid-cols-1">
                  <div className="border border-[#7f7f7f] bg-white p-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#000080]">Problem</p>
                    <p className="mt-2 text-sm leading-6">{activeProject.problem}</p>
                  </div>
                  <div className="border border-[#7f7f7f] bg-white p-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#000080]">Process</p>
                    <p className="mt-2 text-sm leading-6">{activeProject.process}</p>
                  </div>
                  <div className="border border-[#7f7f7f] bg-white p-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#000080]">Outcome</p>
                    <p className="mt-2 text-sm leading-6">{activeProject.outcome}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeProject.tags.map((tag) => (
                    <span key={tag} className="border border-[#7f7f7f] bg-white px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4">
                  <Button onClick={() => onMoreInfo(activeProject.id)} className="bg-[#dfefff]">
                    More Info
                  </Button>
                </div>
              </div>
            ) : (
              <Frame className="p-4">No projects match this filter.</Frame>
            )}
          </div>
        </div>
          </>
        )}
      </Frame>
    </div>
  );
}

// --- Desktop experience ----------------------------------------------------

export default function App() {
  // Live clock text shown in the taskbar.
  const [clock, setClock] = useState(() => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
  // Start/menu panel open state.
  const [menuOpen, setMenuOpen] = useState(false);
  // Which windows are currently open.
  const [openWindows, setOpenWindows] = useState<WindowId[]>(["home"]);
  // Z-order list (last item is visually on top).
  const [zStack, setZStack] = useState<WindowId[]>(["home"]);
  // Windows in focused full-width scroll stack.
  const [focusedWindowIds, setFocusedWindowIds] = useState<WindowId[]>(["home"]);
  // Drag and drop state for reordering windows.
  const [draggingWindowId, setDraggingWindowId] = useState<WindowId | null>(null);
  const [dropTargetId, setDropTargetId] = useState<WindowId | null>(null);
  // Small toast text shown near the taskbar.
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  // Desktop-only scroll button is shown only when there is more content below.
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
  // Refs let us scroll specific window tiles into view.
  const windowRefs = useRef<Partial<Record<WindowId, HTMLDivElement | null>>>({});
  // Ref for the scrollable area that holds all windows.
  const windowPaneRef = useRef<HTMLDivElement | null>(null);
  // Cross-window navigation from Objectives reference links.
  const [navTarget, setNavTarget] = useState<PortfolioNavTarget | null>(null);
  const [highlightedLabId, setHighlightedLabId] = useState<string | null>(null);
  const [projectDetailId, setProjectDetailId] = useState<string | null>(null);

  const handleNavHandled = useCallback(() => {
    setNavTarget(null);
  }, []);

  const closeProjectDetail = useCallback(() => {
    setProjectDetailId(null);
  }, []);

  // Update the taskbar clock every 30 seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Bring clicked window to top of stack.
  const bringToFront = (id: WindowId) => {
    // Remove old entry, then push it to the end (top).
    setZStack((prev) => [...prev.filter((item) => item !== id), id]);
  };

  // Helper so status updates stay consistent in one place.
  const announceStatus = (message: string) => {
    setStatusMessage(message);
  };

  // Open a window (or report that it is already open).
  const openWindow = (id: WindowId) => {
    const windowLabel = WINDOWS.find((window) => window.id === id)?.title ?? id;
    setOpenWindows((prev) => {
      if (prev.includes(id)) {
        announceStatus(`${windowLabel} is already open.`);
        return prev;
      }
      announceStatus(`${windowLabel} opened.`);
      return [...prev, id];
    });
    setMenuOpen(false);
    setFocusedWindowIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    bringToFront(id);
  };

  const openProjectDetail = (projectId: string) => {
    setProjectDetailId(projectId);
    setNavTarget({ window: "projects", projectId });
    openWindow("projects");
  };

  // Close a window and clean up related state.
  const closeWindow = (id: WindowId) => {
    const windowLabel = WINDOWS.find((window) => window.id === id)?.title ?? id;
    setOpenWindows((prev) => prev.filter((item) => item !== id));
    setZStack((prev) => prev.filter((item) => item !== id));
    setFocusedWindowIds((prev) => prev.filter((item) => item !== id));
    if (id === "projects") {
      setProjectDetailId(null);
    }
    announceStatus(`${windowLabel} closed.`);
  };

  // Taskbar button scrolls that window into view.
  const handleTaskbarWindowClick = (id: WindowId) => {
    const target = windowRefs.current[id];
    if (target) {
      // Smooth-scroll to that window tile in the main area.
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Quick helper button to jump to the bottom of the window area.
  const scrollWindowPaneToBottom = () => {
    const pane = windowPaneRef.current;
    if (!pane) return;
    pane.scrollTo({ top: pane.scrollHeight, behavior: "smooth" });
  };

  // Check whether the window pane can still scroll downward.
  const updateScrollButtonVisibility = () => {
    const pane = windowPaneRef.current;
    if (!pane) {
      setShowScrollToBottomButton(false);
      return;
    }
    const canScrollDown = pane.scrollTop + pane.clientHeight < pane.scrollHeight - 2;
    setShowScrollToBottomButton(canScrollDown);
  };

  // Fill mode adds/removes a window from the focused scroll stack.
  const toggleWindowFill = (id: WindowId) => {
    if (openWindows.length <= 1) return;
    const windowLabel = WINDOWS.find((window) => window.id === id)?.title ?? id;
    setFocusedWindowIds((prev) => {
      if (prev.includes(id)) {
        announceStatus(`${windowLabel} moved to split layout.`);
        return prev.filter((item) => item !== id);
      }
      announceStatus(`${windowLabel} expanded to focus mode.`);
      return [...prev, id];
    });
  };

  // Reorder windows when one title bar is dragged onto another.
  const reorderOpenWindows = (sourceId: WindowId, targetId: WindowId) => {
    // Ignore no-op drop onto itself.
    if (sourceId === targetId) return;

    setOpenWindows((prev) => {
      const sourceIndex = prev.indexOf(sourceId);
      const targetIndex = prev.indexOf(targetId);
      // Safety guards for bad drag data.
      if (sourceIndex === -1 || targetIndex === -1) return prev;

      const next = [...prev];
      // Remove source, then insert it at target position.
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      const movedTitle = WINDOWS.find((window) => window.id === sourceId)?.title ?? sourceId;
      const targetTitle = WINDOWS.find((window) => window.id === targetId)?.title ?? targetId;
      announceStatus(`${movedTitle} moved near ${targetTitle}.`);
      return next;
    });
  };

  // Reset fill/drag states and keep open windows in default order.
  const resetLayout = () => {
    setDraggingWindowId(null);
    setDropTargetId(null);
    const reordered = WINDOWS.map((window) => window.id).filter((id) => openWindows.includes(id));
    setOpenWindows(reordered);
    setFocusedWindowIds(reordered);
    announceStatus("Layout reset with focused view.");
  };

  const isWindowFocused = (id: WindowId) => openWindows.length === 1 || focusedWindowIds.includes(id);

  useEffect(() => {
    setFocusedWindowIds((prev) => prev.filter((id) => openWindows.includes(id)));
  }, [openWindows]);

  // Hide status toast after a short delay.
  useEffect(() => {
    if (!statusMessage) return;
    const timeout = window.setTimeout(() => setStatusMessage(null), 2200);
    return () => window.clearTimeout(timeout);
  }, [statusMessage]);

  // Recalculate button visibility when layout/content changes or screen resizes.
  useEffect(() => {
    const frame = window.requestAnimationFrame(updateScrollButtonVisibility);
    window.addEventListener("resize", updateScrollButtonVisibility);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateScrollButtonVisibility);
    };
  }, [openWindows, focusedWindowIds]);

  // Map each window id to its matching content component.
  const windowContentMap: Record<WindowId, React.ReactNode> = useMemo(
    () => ({
      home: <HomeContent onMoreInfo={openProjectDetail} />,
      about: <AboutContent />,
      lab: <LabContent highlightedLabId={highlightedLabId} />,
      projects: (
        <ProjectsContent
          navTarget={navTarget}
          onNavHandled={handleNavHandled}
          projectDetailId={projectDetailId}
          onCloseDetail={closeProjectDetail}
          onMoreInfo={openProjectDetail}
        />
      ),
      objectives: <ObjectivesContent />,
      contact: <ContactContent />,
      paint: <PaintContent />,
      solitaire: <SolitaireContent />,
    }),
    [highlightedLabId, navTarget, handleNavHandled, projectDetailId, closeProjectDetail, openProjectDetail],
  );

  // In split mode, distribute windows into two columns.
  const tiledColumns = useMemo(() => {
    const columns: [WindowId[], WindowId[]] = [[], []];
    const tiledWindows = openWindows.filter((id) => !isWindowFocused(id));
    tiledWindows.forEach((id, index) => {
      columns[index % 2].push(id);
    });
    return columns;
  }, [focusedWindowIds, openWindows]);

  const focusedWindows = openWindows.filter((id) => isWindowFocused(id));
  const splitWindows = openWindows.filter((id) => !isWindowFocused(id));
  const layoutMode = openWindows.length === 1 || focusedWindowIds.length > 0 ? "Focused" : "Split";

  // Shared renderer for each open window tile.
  const renderWindowTile = (id: WindowId) => {
    const windowConfig = WINDOWS.find((win) => win.id === id)!;
    const focused = isWindowFocused(id);
    return (
      <div
        key={id}
        ref={(node) => {
          windowRefs.current[id] = node;
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragEnter={() => {
          // Highlight target while dragging over another window.
          if (!draggingWindowId || draggingWindowId === id) return;
          setDropTargetId(id);
        }}
        onDragLeave={() => {
          setDropTargetId((prev) => (prev === id ? null : prev));
        }}
        onDrop={() => {
          if (!draggingWindowId) return;
          // Reorder list based on drop target.
          reorderOpenWindows(draggingWindowId, id);
          setDraggingWindowId(null);
          setDropTargetId(null);
        }}
        className={`${focused ? "md:col-span-2" : ""} min-h-[320px] lg:overflow-auto lg:resize-y ${draggingWindowId && dropTargetId === id ? "ring-2 ring-[#ffe169] ring-offset-2 ring-offset-[#008080]" : ""}`}
      >
        <DesktopWindow
          id={id}
          title={windowConfig.title}
          icon={windowConfig.icon}
          onClose={() => closeWindow(id)}
          onToggleFill={() => toggleWindowFill(id)}
          isFilled={focused}
          canToggleFill={openWindows.length > 1}
          onWindowDragStart={() => setDraggingWindowId(id)}
          onWindowDragEnd={() => {
            setDraggingWindowId(null);
            setDropTargetId(null);
          }}
        >
          {windowContentMap[id]}
        </DesktopWindow>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-[#008080] text-black">
      <div className="relative mx-auto flex max-w-6xl flex-col gap-4 px-3 py-4 pb-24 md:gap-5 md:py-6 md:pb-28 lg:flex-row">
        <div className="hidden lg:flex lg:w-[130px] lg:shrink-0 lg:flex-col lg:items-center">
          {/* Left-side desktop icons. */}
          {WINDOWS.map((window) => (
            <DesktopIcon key={window.id} label={window.title} icon={window.icon} onClick={() => openWindow(window.id)} />
          ))}
        </div>

        <div className="relative flex-1 lg:h-[78vh] lg:min-h-[520px]">
          {/* Mobile-only icon strip — tap to open windows; hidden on lg where the sidebar shows */}
          <div className="lg:hidden mb-2 flex overflow-x-auto gap-1 border border-[#7f7f7f] bg-[#d8d8d8] px-1 py-1 shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080]">
            {WINDOWS.map((win) => (
              <button
                key={win.id}
                type="button"
                onClick={() => openWindow(win.id)}
                title={win.title}
                className="flex min-w-[52px] shrink-0 flex-col items-center gap-0.5 border border-[#7f7f7f] bg-[#f4f1e8] px-1.5 py-1.5 text-[#000080] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#7f7f7f] active:shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#7f7f7f]"
              >
                {win.icon}
                <span className="font-mono text-[8px] uppercase leading-tight tracking-tight text-black">{win.title}</span>
              </button>
            ))}
          </div>

          <div className="mb-2 flex items-center gap-2 border border-[#7f7f7f] bg-[#d8d8d8] px-2 py-1 shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080]">
            <p className="hidden flex-1 md:block font-mono text-[10px] uppercase tracking-[0.1em] text-[#222]">
              Open windows from desktop icons. Drag a title bar onto another window to reorder. Fill adds a window to the focused scroll stack; Split moves it to the shared grid.
            </p>
            <div className="ml-auto flex items-center gap-2">
              <span className="border border-[#7f7f7f] bg-[#efefef] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#111]">
                <span className="hidden md:inline">Layout: </span>{layoutMode}
              </span>
              <Button onClick={resetLayout} className="px-2 py-1 text-[10px]">
                <span className="hidden md:inline">Reset </span>Layout
              </Button>
            </div>
          </div>
          {showScrollToBottomButton ? (
            <button
              type="button"
              onClick={scrollWindowPaneToBottom}
              className="absolute bottom-3 right-3 z-10 hidden items-center gap-1 border border-[#7f7f7f] bg-[#d8d8d8] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#333] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080] lg:flex"
            >
              <ArrowDown className="h-3 w-3" /> Scroll
            </button>
          ) : null}
          <div ref={windowPaneRef} onScroll={updateScrollButtonVisibility} className="lg:h-full lg:overflow-y-auto pr-1">
            <div className="flex flex-col gap-4 md:hidden">
              {focusedWindows.map(renderWindowTile)}
              {splitWindows.length > 0 ? <div className="flex flex-col gap-4">{splitWindows.map(renderWindowTile)}</div> : null}
            </div>
            <div className="hidden gap-4 md:flex md:flex-col">
              {focusedWindows.map(renderWindowTile)}
              {splitWindows.length > 0 ? (
                <div className="grid items-start gap-4 md:grid-cols-2">
                  {tiledColumns.map((column, columnIndex) => (
                    <div key={`column-${columnIndex}`} className="flex flex-col gap-4">
                      {column.map(renderWindowTile)}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {menuOpen ? (
        // Pop-up menu like classic Windows start menu.
        <div className="fixed bottom-12 left-1 z-30 w-[calc(100vw-8px)] max-w-[340px] border border-[#7f7f7f] bg-[#c0c0c0] p-[2px] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#404040]">
          <div className="flex border border-[#7f7f7f] bg-[#c0c0c0]">
            <div className="w-9 bg-[linear-gradient(180deg,#000080,#1084d0)] px-1 py-2 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white [writing-mode:vertical-rl] [text-orientation:mixed]">
              David Shamas
            </div>
            <div className="flex-1 bg-[#c0c0c0] p-1">
              {WINDOWS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  // Menu item opens matching window.
                  onClick={() => openWindow(item.id)}
                  className="mb-1 flex w-full items-center gap-2 border border-transparent bg-[#c0c0c0] px-2 py-1 text-left font-mono text-[11px] uppercase tracking-[0.1em] text-[#111111] hover:border-[#7f7f7f] hover:bg-[#000080] hover:text-white"
                >
                  {item.icon}
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#7f7f7f] bg-[#c0c0c0] px-2 py-2 shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#404040]">
        <div className="mx-auto flex max-w-6xl items-center gap-2">
          {/* Menu toggle — always visible on left. */}
          <Button onClick={() => setMenuOpen((value) => !value)} className="shrink-0 min-w-[60px] bg-[#e7e1d2]">
            Menu
          </Button>
          {/* Scrollable window button strip in the middle. */}
          <div className="flex flex-1 items-center gap-2 overflow-x-auto">
            {openWindows.map((id) => {
              const item = WINDOWS.find((win) => win.id === id)!;
              return (
                <Button key={id} onClick={() => handleTaskbarWindowClick(id)} className="shrink-0 bg-[#d8d8d8] whitespace-nowrap">
                  {item.title}
                </Button>
              );
            })}
          </div>
          {/* Clock — always visible on right, never scrolls off. */}
          <div className="shrink-0 border border-[#7f7f7f] bg-[#d8d8d8] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080]">
            {clock}
          </div>
        </div>
      </footer>

      {statusMessage ? (
        // Temporary status toast for actions like open/close/reorder.
        <div className="pointer-events-none fixed bottom-14 right-3 z-30 border border-[#7f7f7f] bg-[#fff6d6] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#222] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#808080]">
          {statusMessage}
        </div>
      ) : null}
    </div>
  );
}
