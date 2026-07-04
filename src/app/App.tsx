import {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from "motion/react";
import emailjs from "@emailjs/browser";
import logoImg from "@/imports/transparent_white.png";
import poster1 from "/Images/poster1.jpg";
import poster2 from "/Images/poster2.jpg";
import vid_tn from "/Images/vid_tn.jpg";
import ace_post from "/Images/ace_post.jpeg";
import fzllc from "/Images/fzllc.jpg";
import appdes from "/Images/appdes.jpg";
import sanlogo from "/Images/sanlogo.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// EmailJS config — fill these in from your EmailJS dashboard
// ─────────────────────────────────────────────────────────────────────────────
const EJS_SERVICE_ID = "service_TR3PLE2";
const EJS_TEMPLATE_ID = "template_bchl4bg";
const EJS_PUBLIC_KEY = "Rnbn7eoCWWW3Fj74L";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────────────────────────────────────
type Page = "home" | "contact" | "about" | "work";

const PAPER =
  "https://images.unsplash.com/photo-1603484477859-abe6a73f9366?w=1600&h=1200&fit=crop&auto=format";
const LIME = "#b0f542";
const DARK = "#0a0a0a";
const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'Inter', system-ui, sans-serif";

const SERVICES = [
  "Brand Identity",
  "UI/UX Design",
  "Web Developement",
  "Graphic Design",
  "Social Media Handling",
  "Video Editing",
  "Event Photography Coverage",
  "Logo Designing",
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Discovery",
    desc: "Deep dive into your brand, audience, and objectives.",
  },
  {
    num: "02",
    title: "Strategy",
    desc: "Craft a focused creative direction and design language.",
  },
  {
    num: "03",
    title: "Design",
    desc: "Build refined, intentional visual systems and assets.",
  },
  {
    num: "04",
    title: "Deliver",
    desc: "Launch with precision. Refine. Iterate. Elevate.",
  },
];

const WHY_US = [
  {
    icon: "✦",
    title: "Premium Craft",
    desc: "Every pixel is intentional. We obsess over details others overlook.",
  },
  {
    icon: "◈",
    title: "Strategic Vision",
    desc: "Design backed by thinking. Beauty with purpose and direction.",
  },
  {
    icon: "⬡",
    title: "Full Spectrum",
    desc: "From brand to digital, we own the full creative suite.",
  },
  {
    icon: "◉",
    title: "Swift Delivery",
    desc: "Agency speed without sacrificing studio quality.",
  },
];

const PROJECTS = [
  {
    id: 1,
    title: "Jumanji GSC Poster — Poster Designing",
    category: "graphic designing",
    year: "2026",
    img: poster1,
    link: "",
  },
  {
    id: 2,
    title: "Jumanji GSC Poster 2 — Poster Designing",
    category: "graphic designing",
    year: "2026",
    img: poster2,
    link: "",
  },
  {
    id: 3,
    title: "ILCL — Video Editing",
    category: "Video Editing",
    year: "2026",
    img: vid_tn,
    link: "",
  },
  {
    id: 4,
    title: "ILCL - Academic Posts",
    category: "Graphic Designing",
    year: "2025",
    img: ace_post,
    link: "",
  },
  {
    id: 5,
    title: "Freeway Marketing — Web Developement",
    category: "web developement",
    year: "2023",
    img: fzllc,
    link: "",
  },
  {
    id: 6,
    title: "Italy Client PetCare App — UI/UX",
    category: "ui-ux",
    year: "2023",
    img: appdes,
    link: "",
  },
  {
    id: 7,
    title: "English Tuition - Brand Overhaul",
    category: "branding",
    year: "2026",
    img: sanlogo,
    link: "",
  },
];

const STATS = [
  { num: 31, suffix: "+", label: "Projects Delivered" },
  { num: 11, suffix: "+", label: "Happy Clients" },
  { num: 2, suffix: "+", label: "Years in Studio" },
  { num: 1, suffix: "+", label: "Awards Earned" },
];

const CLIENTS = [
  "MAVIX STUDIOS.",
  "GOOD SHEPHARD CONVENT",
  "ST' BENEDICT'S COLLEGE",
  "ILCL LEARNING CENTER",
  "ENGLISH WITH SANDANI",
  "GePic",
  "Freeway Marketing FZ LLC",
];

const CATS = [
  "all",
  "branding",
  "ui-ux",
  "web developement",
  "graphic designing",
  "Video Editing",
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Navigation Context
// ─────────────────────────────────────────────────────────────────────────────
const NavCtx = createContext<(p: Page) => void>(() => {});
const useNav = () => useContext(NavCtx);

// ─────────────────────────────────────────────────────────────────────────────
// Theme (dark / light) Context
// ─────────────────────────────────────────────────────────────────────────────
type Theme = "dark" | "light";
const THEME_KEY = "tr3pl-theme";

const ThemeCtx = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "dark", toggle: () => {} });
const useTheme = () => useContext(ThemeCtx);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeCtx.Provider value={{ theme, toggle }}>
      {children}
    </ThemeCtx.Provider>
  );
}

// A playful sun/moon toggle — the sun's rays retract into a crescent moon
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <motion.button
      onClick={toggle}
      aria-label="Toggle light and dark mode"
      className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden shrink-0"
      style={{
        background: isDark ? "#1a1a1a" : "#eeece4",
        border: `1px solid ${LIME}55`,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88, rotate: 25 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.4 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ fontSize: 16, color: LIME, lineHeight: 1 }}
          >
            🌙
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.4 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ fontSize: 16, lineHeight: 1 }}
          >
            ☀️
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared Components
// ─────────────────────────────────────────────────────────────────────────────
function Stripes({
  className = "",
  flipX = false,
  flipY = false,
}: {
  className?: string;
  flipX?: boolean;
  flipY?: boolean;
}) {
  const tx: string[] = [];
  if (flipX) tx.push("scaleX(-1)");
  if (flipY) tx.push("scaleY(-1)");
  return (
    <div
      className={`absolute ${className}`}
      style={{
        width: 132,
        height: 108,
        backgroundImage:
          "repeating-linear-gradient(135deg,#1c1c1c 0,#1c1c1c 10px,#cec9ba 10px,#cec9ba 20px)",
        transform: tx.length ? tx.join(" ") : undefined,
      }}
    />
  );
}

function Reveal({
  children,
  delay = 0,
  dir = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  dir?: "up" | "left" | "right" | "none";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isIn = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: dir === "up" ? 44 : 0,
        x: dir === "left" ? -44 : dir === "right" ? 44 : 0,
      }}
      animate={
        isIn ? { opacity: 1, y: 0, x: 0 } : { opacity: 0 }
      }
      transition={{
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

function Counter({
  to,
  suffix = "",
}: {
  to: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isIn = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!isIn) return;
    const start = Date.now();
    const dur = 1600;
    const tick = () => {
      const t = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setV(Math.floor(e * to));
      if (t < 1) requestAnimationFrame(tick);
      else setV(to);
    };
    requestAnimationFrame(tick);
  }, [isIn, to]);
  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  );
}

function MagBtn({
  children,
  onClick,
  bg = LIME,
  fg = DARK,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  bg?: string;
  fg?: string;
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 22 });
  const sy = useSpring(my, { stiffness: 200, damping: 22 });

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      mx.set((e.clientX - r.left - r.width / 2) * 0.28);
      my.set((e.clientY - r.top - r.height / 2) * 0.28);
    },
    [mx, my],
  );
  const onOut = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy, background: bg, color: fg }}
      className={`inline-block px-9 py-3.5 rounded-full text-sm font-bold tracking-widest uppercase ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onOut}
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
    >
      {children}
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom Cursor
// ─────────────────────────────────────────────────────────────────────────────
function Cursor() {
  const cx = useMotionValue(-60);
  const cy = useMotionValue(-60);
  const sx = useSpring(cx, { stiffness: 700, damping: 42 });
  const sy = useSpring(cy, { stiffness: 700, damping: 42 });
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    if ("ontouchstart" in window) {
      setTouch(true);
      return;
    }
    document.documentElement.style.cursor = "none";
    const m = (e: MouseEvent) => {
      cx.set(e.clientX - 5);
      cy.set(e.clientY - 5);
    };
    window.addEventListener("mousemove", m);
    return () => {
      window.removeEventListener("mousemove", m);
      document.documentElement.style.cursor = "";
    };
  }, [cx, cy]);

  if (touch) return null;
  return (
    <motion.div
      className="fixed z-[9999] pointer-events-none w-2.5 h-2.5 rounded-full"
      style={{
        x: sx,
        y: sy,
        background: LIME,
        mixBlendMode: "difference" as const,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────────
const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/tr3pldesigns",
  },
  {
    label: "Behance",
    href: "https://behance.net/tr3pldesigns",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/tr3pldesigns",
  },
];

function Footer() {
  const go = useNav();
  return (
    <footer
      style={{
        background: "var(--card)",
        borderTop: "1px solid rgba(var(--fg-rgb),0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-14">
          {/* Logo + tagline */}
          <div>
            <button
              onClick={() => go("home")}
              className="mb-4 block"
            >
              <img
                src={logoImg}
                alt="TR3PL Designs"
                className="h-12 w-auto object-contain"
              />
            </button>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{
                fontFamily: SANS,
                color: "rgba(var(--fg-rgb),0.38)",
              }}
            >
              A Colombo-based creative studio building brands
              and digital experiences that leave a mark.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p
              className="tracking-[0.38em] uppercase mb-5"
              style={{
                fontFamily: SANS,
                fontSize: "0.58rem",
                color: LIME,
              }}
            >
              Navigation
            </p>
            <div className="flex flex-col gap-3">
              {(
                ["home", "about", "work", "contact"] as const
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => go(p)}
                  className="text-left text-sm font-medium capitalize w-fit hover:text-white transition-colors"
                  style={{
                    fontFamily: SANS,
                    color: "rgba(var(--fg-rgb),0.48)",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Socials + email */}
          <div>
            <p
              className="tracking-[0.38em] uppercase mb-5"
              style={{
                fontFamily: SANS,
                fontSize: "0.58rem",
                color: LIME,
              }}
            >
              Connect
            </p>
            <div className="flex flex-col gap-3 mb-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium w-fit hover:text-white transition-colors flex items-center gap-2 group"
                  style={{
                    fontFamily: SANS,
                    color: "rgba(var(--fg-rgb),0.48)",
                  }}
                >
                  {s.label}
                  <span
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: LIME }}
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>
            <a
              href="mailto:TR3PLDESIGNSLIMITED@GMAIL.COM"
              className="text-xs font-bold tracking-wider hover:text-white transition-colors"
              style={{
                fontFamily: SANS,
                color: "rgba(var(--fg-rgb),0.28)",
              }}
            >
              TR3PLDESIGNSLIMITED@GMAIL.COM
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{
            borderTop: "1px solid rgba(var(--fg-rgb),0.05)",
          }}
        >
          <p
            className="text-xs tracking-wider"
            style={{
              fontFamily: SANS,
              color: "rgba(var(--fg-rgb),0.22)",
            }}
          >
            © {new Date().getFullYear()} TR3PL Designs Limited.
            All rights reserved.
          </p>
          <p
            className="text-xs tracking-wider"
            style={{
              fontFamily: SANS,
              color: "rgba(var(--fg-rgb),0.18)",
            }}
          >
            EST. 2019 — COLOMBO, SRI LANKA
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Navigation Bar
// ─────────────────────────────────────────────────────────────────────────────
function Nav({ cur }: { cur: Page }) {
  const go = useNav();
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-10 py-3.5"
      style={{
        background: "rgba(var(--bg-rgb),0.94)",
        backdropFilter: "blur(22px)",
        borderBottom: "1px solid rgba(var(--fg-rgb),0.08)",
      }}
    >
      <div className="flex items-center gap-2">
        {(["home", "contact"] as const).map((p) => (
          <motion.button
            key={p}
            onClick={() => go(p)}
            className="px-3.5 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{
              background: cur === p ? "#c5ff58" : LIME,
              color: DARK,
              boxShadow:
                cur === p ? `0 0 20px ${LIME}55` : "none",
              fontFamily: SANS,
            }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.93 }}
          >
            {p}
          </motion.button>
        ))}
      </div>

      <motion.button
        onClick={() => go("home")}
        whileHover={{ scale: 1.12 }}
        transition={{ duration: 0.18 }}
      >
        <img
          src={logoImg}
          alt="TR3PL Designs"
          className="h-14 w-auto object-contain"
        />
      </motion.button>

      <div className="flex items-center gap-2">
        {(["about", "work"] as const).map((p) => (
          <motion.button
            key={p}
            onClick={() => go(p)}
            className="px-3.5 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{
              background: cur === p ? "#c5ff58" : LIME,
              color: DARK,
              boxShadow:
                cur === p ? `0 0 20px ${LIME}55` : "none",
              fontFamily: SANS,
            }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.93 }}
          >
            {p}
          </motion.button>
        ))}
        <ThemeToggle />
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────
function HomePage() {
  return (
    <div
      className="h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Corner diagonal stripe decorations */}
      <Stripes className="top-[72px] left-0" />
      <Stripes className="top-[72px] right-0" flipX />
      <Stripes className="bottom-0 left-0" flipY />
      <Stripes className="bottom-0 right-0" flipX flipY />

      {/* Center crumpled paper card */}
      <motion.div
        className="relative w-[70vw] max-w-3xl overflow-hidden"
        style={{ aspectRatio: "4/3" }}
        initial={{ opacity: 0, y: 70, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.016 }}
      >
        <img
          src={PAPER}
          alt="TR3PL Designs — crumpled paper texture"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Subtle paper vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.18) 100%)",
          }}
        />

        {/* Brand text on paper */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.9 }}
            className="text-center select-none"
          >
            <div
              className="leading-none tracking-tighter"
              style={{
                fontFamily: SANS,
                fontSize: "clamp(2.8rem, 8vw, 6.5rem)",
                fontWeight: 900,
                color: "#1a1814",
                letterSpacing: "-0.025em",
              }}
            >
              TR3PL
            </div>
            <div
              className="leading-none tracking-tighter"
              style={{
                fontFamily: SANS,
                fontSize: "clamp(2.8rem, 8vw, 6.5rem)",
                fontWeight: 900,
                color: "#1a1814",
                letterSpacing: "-0.025em",
              }}
            >
              DESIGNS
            </div>
            <div
              className="mt-2.5 tracking-[0.38em] uppercase"
              style={{
                fontFamily: SANS,
                fontSize: "clamp(0.55rem, 1.2vw, 0.7rem)",
                fontWeight: 600,
                color: "#4a4640",
              }}
            >
              LIMITED
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll pulse indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 1.5 }}
      >
        <span
          className="tracking-[0.3em] uppercase"
          style={{
            fontFamily: SANS,
            fontSize: "0.55rem",
            color: "rgba(var(--fg-rgb),0.25)",
          }}
        >
          scroll
        </span>
        <motion.div
          className="w-px h-8 origin-top"
          style={{ background: LIME }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT PAGE
// ─────────────────────────────────────────────────────────────────────────────
function ContactPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSend = useCallback(async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      await emailjs.send(
        EJS_SERVICE_ID,
        EJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        EJS_PUBLIC_KEY,
      );
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }, [form]);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center pt-20 pb-16">
      {/* Full-page paper background */}
      <div className="absolute inset-0">
        <img
          src={PAPER}
          alt="paper background"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(255,255,255,0.12)" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-8 max-w-3xl">
        <motion.h1
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(2.4rem, 6vw, 5.5rem)",
            fontWeight: 700,
            color: "#1a1814",
            lineHeight: 1.12,
          }}
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.95,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          Touch us! Urhmm
          <br />
          we mean, Get in
          <br />
          touch with us!
        </motion.h1>

        <motion.div
          className="mt-10 mb-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={() => setOpen(true)}
            className="px-10 py-2.5 rounded-full font-bold uppercase tracking-[0.25em]"
            style={{
              fontFamily: SANS,
              fontSize: "0.72rem",
              background: DARK,
              color: LIME,
              border: `1px solid ${LIME}`,
            }}
            whileHover={{
              scale: 1.06,
              background: LIME,
              color: DARK,
            }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.2 }}
          >
            FILL FORM
          </motion.button>
        </motion.div>

        {/* Arrow CTA */}
        <motion.div
          className="flex justify-center mb-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.52 }}
        >
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: DARK, cursor: "pointer" }}
            onClick={() => setOpen(true)}
            whileHover={{ scale: 1.15, rotate: 45 }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: 17,
                lineHeight: 1,
              }}
            >
              →
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Contact info pills */}
      <motion.div
        className="relative z-10 flex flex-wrap justify-center gap-3 px-6"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
      >
        {[
          "TR3PLDESIGNSLIMITED@GMAIL.COM",
          "PHONE: +94 77 123 4567",
          "ADDRESS: COLOMBO, SRI LANKA",
        ].map((info) => (
          <div
            key={info}
            className="px-5 py-2 rounded-full font-bold tracking-wider"
            style={{
              fontFamily: SANS,
              fontSize: "0.65rem",
              background: DARK,
              color: LIME,
              border: `1px solid ${LIME}35`,
            }}
          >
            {info}
          </div>
        ))}
      </motion.div>

      {/* Form modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(10px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-sm overflow-hidden rounded-lg"
              initial={{ scale: 0.86, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.86, opacity: 0, y: 24 }}
              transition={{
                type: "spring",
                stiffness: 340,
                damping: 28,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={PAPER}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: "rgba(255,255,255,0.22)" }}
              />

              <div className="relative z-10 p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3
                    className="font-bold tracking-[0.3em] uppercase"
                    style={{
                      fontFamily: SANS,
                      fontSize: "0.72rem",
                      color: "#1a1814",
                    }}
                  >
                    FORM
                  </h3>
                  <button
                    onClick={() => {
                      setOpen(false);
                      setStatus("idle");
                    }}
                    className="text-xl leading-none opacity-60 hover:opacity-100 transition-opacity"
                    style={{ color: "#1a1814" }}
                  >
                    ✕
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {status === "sent" ? (
                    <motion.div
                      key="sent"
                      className="py-10 flex flex-col items-center gap-4 text-center"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <div
                        className="text-3xl mb-1"
                        style={{ color: DARK }}
                      >
                        ✦
                      </div>
                      <p
                        className="font-bold tracking-[0.22em] uppercase"
                        style={{
                          fontFamily: SANS,
                          fontSize: "0.75rem",
                          color: "#1a1814",
                        }}
                      >
                        Message sent!
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{
                          fontFamily: SANS,
                          color: "rgba(26,24,20,0.54)",
                        }}
                      >
                        We'll get back to you soon.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {(
                        ["name", "email", "message"] as const
                      ).map((k) => (
                        <div key={k} className="mb-5">
                          <input
                            placeholder={
                              k === "email"
                                ? "E-MAIL"
                                : k.toUpperCase()
                            }
                            className="w-full bg-transparent border-b pb-2 text-sm outline-none placeholder:tracking-wider"
                            style={{
                              fontFamily: SANS,
                              borderColor:
                                "rgba(26,24,20,0.28)",
                              color: "#1a1814",
                            }}
                            value={form[k]}
                            onChange={(e) =>
                              setForm((p) => ({
                                ...p,
                                [k]: e.target.value,
                              }))
                            }
                          />
                        </div>
                      ))}

                      {status === "error" && (
                        <p
                          className="text-xs mb-3 tracking-wider"
                          style={{
                            fontFamily: SANS,
                            color: "#e05",
                          }}
                        >
                          Something went wrong — please try
                          again.
                        </p>
                      )}

                      <motion.button
                        onClick={handleSend}
                        disabled={status === "sending"}
                        className="w-full mt-4 py-2.5 rounded-full font-bold tracking-[0.3em] uppercase"
                        style={{
                          fontFamily: SANS,
                          fontSize: "0.68rem",
                          background: DARK,
                          color: LIME,
                          opacity:
                            status === "sending" ? 0.6 : 1,
                          cursor:
                            status === "sending"
                              ? "wait"
                              : "pointer",
                        }}
                        whileHover={{
                          scale:
                            status === "sending" ? 1 : 1.02,
                        }}
                        whileTap={{
                          scale:
                            status === "sending" ? 1 : 0.97,
                        }}
                      >
                        {status === "sending"
                          ? "SENDING..."
                          : "SEND"}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────────────────────────────────────────
function AboutPage() {
  const go = useNav();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -130]);

  return (
    <div style={{ background: "var(--background)" }}>
      {/* ── 1. Hero ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated lime radial gradient */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              `radial-gradient(ellipse at 50% 55%, rgba(176,245,66,0.07) 0%, transparent 62%)`,
              `radial-gradient(ellipse at 22% 75%, rgba(176,245,66,0.10) 0%, transparent 62%)`,
              `radial-gradient(ellipse at 78% 28%, rgba(176,245,66,0.07) 0%, transparent 62%)`,
              `radial-gradient(ellipse at 50% 55%, rgba(176,245,66,0.07) 0%, transparent 62%)`,
            ],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating orbital rings */}
        {[
          {
            w: 88,
            h: 88,
            l: "8%",
            t: "22%",
            dur: 7.5,
            delay: 0,
          },
          {
            w: 148,
            h: 148,
            l: "80%",
            t: "16%",
            dur: 10,
            delay: 1.2,
          },
          {
            w: 62,
            h: 62,
            l: "20%",
            t: "70%",
            dur: 6,
            delay: 0.4,
          },
          {
            w: 112,
            h: 112,
            l: "70%",
            t: "66%",
            dur: 8.5,
            delay: 1.8,
          },
          {
            w: 52,
            h: 52,
            l: "48%",
            t: "12%",
            dur: 5.5,
            delay: 2.2,
          },
          {
            w: 76,
            h: 76,
            l: "38%",
            t: "80%",
            dur: 7,
            delay: 0.8,
          },
        ].map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: s.w,
              height: s.h,
              left: s.l,
              top: s.t,
              borderColor: `${LIME}18`,
            }}
            animate={{ y: [0, -26, 0], x: [0, 14, 0] }}
            transition={{
              duration: s.dur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.delay,
            }}
          />
        ))}

        <motion.div
          className="relative z-10 text-center px-6"
          style={{ y: heroY }}
        >
          <motion.p
            className="tracking-[0.45em] uppercase mb-8"
            style={{
              fontFamily: SANS,
              fontSize: "0.6rem",
              color: LIME,
            }}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            EST. 2019 — COLOMBO, SRI LANKA
          </motion.p>

          {/* Letter-by-letter headline reveal */}
          <div className="overflow-visible mb-6">
            {"About TR3PL".split("").map((c, i) => (
              <motion.span
                key={i}
                className="inline-block"
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(3.2rem, 8.5vw, 7.5rem)",
                  fontWeight: 700,
                  color: c === " " ? "transparent" : "var(--foreground)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.04,
                }}
                initial={{ y: 90, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.72,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.18 + i * 0.038,
                }}
              >
                {c === " " ? " " : c}
              </motion.span>
            ))}
          </div>

          <motion.p
            className="text-base max-w-md mx-auto"
            style={{
              fontFamily: SANS,
              color: "rgba(var(--fg-rgb),0.52)",
              lineHeight: 1.82,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05 }}
          >
            A creative studio building brands and digital
            <br />
            experiences that leave a mark.
          </motion.p>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          <span
            className="tracking-[0.35em] uppercase"
            style={{
              fontFamily: SANS,
              fontSize: "0.52rem",
              color: "rgba(var(--fg-rgb),0.22)",
            }}
          >
            scroll
          </span>
          <div
            className="w-px h-9"
            style={{
              background: `linear-gradient(to bottom, ${LIME}, transparent)`,
            }}
          />
        </motion.div>
      </section>

      {/* ── 2. Who We Are ── */}
      <section className="py-28 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-28 items-center">
          <Reveal dir="left">
            <p
              className="tracking-[0.42em] uppercase mb-5"
              style={{
                fontFamily: SANS,
                fontSize: "0.6rem",
                color: LIME,
              }}
            >
              Who We Are
            </p>
            <h2
              className="mb-8 leading-[1.06]"
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                fontWeight: 700,
                color: "var(--foreground)",
              }}
            >
              We design the extraordinary.
            </h2>
            <p
              className="text-lg mb-6 leading-relaxed"
              style={{
                fontFamily: SANS,
                color: "rgba(var(--fg-rgb),0.62)",
              }}
            >
              TR3PL Designs Limited is a Colombo-based creative
              studio founded on the belief that great design
              changes the way people experience the world.
            </p>
            <p
              className="leading-relaxed"
              style={{
                fontFamily: SANS,
                color: "rgba(var(--fg-rgb),0.42)",
              }}
            >
              We work with ambitious brands, startups, and
              individuals who want more than pretty visuals —
              they want identity, strategy, and execution that
              moves culture.
            </p>
          </Reveal>

          <Reveal dir="right" delay={0.14}>
            <div className="relative">
              <motion.div
                className="absolute -top-10 -right-10 w-36 h-36 rounded-full border"
                style={{ borderColor: `${LIME}22` }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 28,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-22 h-22 border"
                style={{
                  width: 88,
                  height: 88,
                  borderColor: "rgba(var(--fg-rgb),0.08)",
                }}
                animate={{ rotate: -360 }}
                transition={{
                  duration: 22,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <div>
                {SERVICES.map((svc, i) => (
                  <motion.div
                    key={svc}
                    className="flex items-center gap-5 py-4 border-b"
                    style={{
                      borderColor: "rgba(var(--fg-rgb),0.06)",
                    }}
                    initial={{ opacity: 0, x: 32 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: i * 0.09,
                      duration: 0.52,
                    }}
                    whileHover={{ x: 10 }}
                  >
                    <span
                      className="font-bold"
                      style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: "0.62rem",
                        color: LIME,
                      }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className="text-lg font-medium"
                      style={{
                        fontFamily: SANS,
                        color: "var(--foreground)",
                      }}
                    >
                      {svc}
                    </span>
                    <motion.span
                      className="ml-auto text-sm"
                      style={{
                        color: "rgba(var(--fg-rgb),0.28)",
                      }}
                      whileHover={{ x: 5 }}
                    >
                      →
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 3. Mission ── */}
      <section
        className="py-28 px-6"
        style={{ background: "var(--card)" }}
      >
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <p
              className="tracking-[0.42em] uppercase mb-4"
              style={{
                fontFamily: SANS,
                fontSize: "0.6rem",
                color: LIME,
              }}
            >
              Our Mission
            </p>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                fontWeight: 700,
                color: "var(--foreground)",
              }}
            >
              Purpose-driven design.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                sym: "✦",
                title: "Authentic",
                body: "We craft identities that feel genuinely yours — not trend-chasing, but honest to who you are and where you're going.",
              },
              {
                sym: "◈",
                title: "Intentional",
                body: "Every color, letter, space, and pixel serves a purpose. Nothing is decorative without function. Design thinks before it speaks.",
              },
              {
                sym: "◉",
                title: "Transformative",
                body: "The brands that matter change how people feel. We build the visual language for that kind of transformation.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                className="relative p-8 rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(var(--fg-rgb),0.024)",
                  border: "1px solid rgba(var(--fg-rgb),0.062)",
                  backdropFilter: "blur(22px)",
                }}
                initial={{ opacity: 0, y: 52 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.15,
                  duration: 0.72,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{
                  borderColor: `${LIME}28`,
                  background: "rgba(176,245,66,0.028)",
                }}
              >
                <motion.div
                  className="absolute -top-12 -right-12 rounded-full"
                  style={{
                    width: 110,
                    height: 110,
                    background: `${LIME}07`,
                  }}
                  whileHover={{ scale: 2.6 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="relative z-10">
                  <div
                    className="text-3xl mb-5"
                    style={{ color: LIME }}
                  >
                    {card.sym}
                  </div>
                  <h3
                    className="text-xl font-bold mb-4"
                    style={{
                      fontFamily: SANS,
                      color: "var(--foreground)",
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: SANS,
                      color: "rgba(var(--fg-rgb),0.54)",
                    }}
                  >
                    {card.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Process ── */}
      <section className="py-28 px-6 max-w-7xl mx-auto">
        <Reveal className="text-center mb-20">
          <p
            className="tracking-[0.42em] uppercase mb-4"
            style={{
              fontFamily: SANS,
              fontSize: "0.6rem",
              color: LIME,
            }}
          >
            Our Process
          </p>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            How we work.
          </h2>
        </Reveal>

        <div className="relative">
          {/* Animated timeline connecting line */}
          <div
            className="hidden md:block absolute top-8 left-8 right-8 h-px"
            style={{ background: "rgba(var(--fg-rgb),0.05)" }}
          >
            <motion.div
              className="h-full origin-left"
              style={{ background: LIME }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.9,
                ease: "easeOut",
                delay: 0.25,
              }}
            />
          </div>

          <div className="grid md:grid-cols-4 gap-10">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                className="relative pt-20"
                initial={{ opacity: 0, y: 42 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.7 }}
              >
                <motion.div
                  className="absolute top-0 left-0 w-16 h-16 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor: LIME,
                    background: "var(--background)",
                  }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.2 + 0.42,
                    type: "spring",
                    stiffness: 280,
                  }}
                  whileHover={{
                    scale: 1.16,
                    boxShadow: `0 0 22px ${LIME}40`,
                  }}
                >
                  <span
                    className="font-bold"
                    style={{
                      fontFamily: SANS,
                      fontSize: "0.68rem",
                      color: LIME,
                    }}
                  >
                    {step.num}
                  </span>
                </motion.div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: SANS, color: "var(--foreground)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: SANS,
                    color: "rgba(var(--fg-rgb),0.48)",
                  }}
                >
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Why Choose Us ── */}
      <section
        className="py-28 px-6"
        style={{ background: "var(--card)" }}
      >
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <p
              className="tracking-[0.42em] uppercase mb-4"
              style={{
                fontFamily: SANS,
                fontSize: "0.6rem",
                color: LIME,
              }}
            >
              Why TR3PL
            </p>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                fontWeight: 700,
                color: "var(--foreground)",
              }}
            >
              The difference
              <br />
              is in the details.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_US.map((item, i) => (
              <motion.div
                key={item.title}
                className="p-7 rounded-xl border relative overflow-hidden"
                style={{
                  border: "1px solid rgba(var(--fg-rgb),0.062)",
                  background: "rgba(var(--fg-rgb),0.016)",
                }}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  y: -8,
                  borderColor: `${LIME}32`,
                  background: "rgba(176,245,66,0.025)",
                }}
              >
                <motion.div
                  className="text-2xl mb-5"
                  style={{ color: LIME }}
                  whileHover={{ scale: 1.32, rotate: 18 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                  }}
                >
                  {item.icon}
                </motion.div>
                <h3
                  className="text-base font-bold mb-2"
                  style={{ fontFamily: SANS, color: "var(--foreground)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily: SANS,
                    color: "rgba(var(--fg-rgb),0.48)",
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CTA ── */}
      <section className="relative py-40 px-6 overflow-hidden flex flex-col items-center justify-center text-center">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              `radial-gradient(ellipse at 32% 50%, rgba(176,245,66,0.11) 0%, transparent 58%), radial-gradient(ellipse at 68% 50%, rgba(176,245,66,0.05) 0%, transparent 58%)`,
              `radial-gradient(ellipse at 68% 50%, rgba(176,245,66,0.13) 0%, transparent 58%), radial-gradient(ellipse at 32% 50%, rgba(176,245,66,0.05) 0%, transparent 58%)`,
              `radial-gradient(ellipse at 32% 50%, rgba(176,245,66,0.11) 0%, transparent 58%), radial-gradient(ellipse at 68% 50%, rgba(176,245,66,0.05) 0%, transparent 58%)`,
            ],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <Reveal className="relative z-10 max-w-2xl">
          <p
            className="tracking-[0.42em] uppercase mb-6"
            style={{
              fontFamily: SANS,
              fontSize: "0.6rem",
              color: LIME,
            }}
          >
            Ready to build?
          </p>
          <h2
            className="mb-10 leading-tight"
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            Let's create something extraordinary.
          </h2>
          <MagBtn onClick={() => go("contact")}>
            GET IN TOUCH
          </MagBtn>
        </Reveal>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Project Lightbox
// ─────────────────────────────────────────────────────────────────────────────
function ProjectLightbox({
  project,
  onClose,
}: {
  project: (typeof PROJECTS)[0] | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          style={{
            backdropFilter: "blur(18px)",
            background: "rgba(0,0,0,0.72)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-4xl w-full"
            initial={{ scale: 0.82, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.82, opacity: 0, y: 40 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 28,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-10 right-0 text-sm tracking-widest uppercase font-bold opacity-60 hover:opacity-100 transition-opacity"
              style={{ fontFamily: SANS, color: "#f0ebe0" }}
            >
              ✕ close
            </button>

            {/* Image — clickable if link is set */}
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              whileHover={project.link ? { scale: 1.012 } : {}}
              style={{
                cursor: project.link ? "pointer" : "default",
              }}
              onClick={() => {
                if (project.link)
                  window.open(project.link, "_blank");
              }}
            >
              <img
                src={project.img}
                alt={project.title}
                className="w-full object-contain max-h-[75vh]"
                style={{ display: "block" }}
              />
              {/* Visit overlay hint */}
              {project.link && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: `${LIME}cc` }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.22 }}
                >
                  <span
                    className="font-bold tracking-[0.3em] uppercase flex items-center gap-3"
                    style={{
                      fontFamily: SANS,
                      fontSize: "0.8rem",
                      color: DARK,
                    }}
                  >
                    Visit Project ↗
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Meta */}
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <p
                  className="tracking-[0.3em] uppercase mb-1"
                  style={{
                    fontFamily: SANS,
                    fontSize: "0.6rem",
                    color: LIME,
                  }}
                >
                  {project.category} · {project.year}
                </p>
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: SANS, color: "#f0ebe0" }}
                >
                  {project.title}
                </h3>
              </div>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-5 py-2 rounded-full font-bold tracking-widest uppercase text-xs"
                  style={{
                    background: LIME,
                    color: DARK,
                    fontFamily: SANS,
                  }}
                >
                  Visit ↗
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORK PAGE — Tilt Card
// ─────────────────────────────────────────────────────────────────────────────
function TiltCard({
  project,
  onClick,
}: {
  project: (typeof PROJECTS)[0];
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rX = useTransform(my, [-0.5, 0.5], [7, -7]);
  const rY = useTransform(mx, [-0.5, 0.5], [-7, 7]);
  const srX = useSpring(rX, { stiffness: 180, damping: 26 });
  const srY = useSpring(rY, { stiffness: 180, damping: 26 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onOut = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div style={{ perspective: 900 }}>
      <motion.div
        ref={ref}
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        style={{ rotateX: srX, rotateY: srY }}
        onMouseMove={onMove}
        onMouseLeave={onOut}
        onClick={onClick}
        initial={{ opacity: 0, y: 64 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.018 }}
      >
        <div className="aspect-video relative overflow-hidden">
          <motion.img
            src={project.img}
            alt={project.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.09 }}
            transition={{ duration: 0.58, ease: "easeOut" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 55%)",
            }}
          />
          <div className="absolute bottom-6 left-6">
            <p
              className="tracking-[0.28em] uppercase mb-1"
              style={{
                fontFamily: SANS,
                fontSize: "0.62rem",
                color: LIME,
              }}
            >
              {project.category} · {project.year}
            </p>
            <h3
              className="text-xl font-bold"
              style={{ fontFamily: SANS, color: "#f0ebe0" }}
            >
              {project.title}
            </h3>
          </div>
          <motion.div
            className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: `${LIME}18`,
              border: `1px solid ${LIME}35`,
            }}
            whileHover={{ scale: 1.22, background: LIME }}
          >
            <span style={{ color: LIME, fontSize: 14 }}>
              ↗
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORK PAGE
// ─────────────────────────────────────────────────────────────────────────────
function WorkPage() {
  const go = useNav();
  const [cat, setCat] = useState<(typeof CATS)[number]>("all");
  const [active, setActive] = useState<
    (typeof PROJECTS)[0] | null
  >(null);
  const filtered =
    cat === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === cat);

  return (
    <div style={{ background: "var(--background)" }}>
      <ProjectLightbox
        project={active}
        onClose={() => setActive(null)}
      />
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              `radial-gradient(ellipse at 42% 58%, rgba(176,245,66,0.06) 0%, transparent 68%)`,
              `radial-gradient(ellipse at 60% 38%, rgba(176,245,66,0.09) 0%, transparent 68%)`,
              `radial-gradient(ellipse at 42% 58%, rgba(176,245,66,0.06) 0%, transparent 68%)`,
            ],
          }}
          transition={{ duration: 9, repeat: Infinity }}
        />

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.p
            className="tracking-[0.45em] uppercase mb-8"
            style={{
              fontFamily: SANS,
              fontSize: "0.6rem",
              color: LIME,
            }}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
          >
            SELECTED WORKS — 2023 TO PRESENT
          </motion.p>

          {"Our Work".split("").map((c, i) => (
            <motion.span
              key={i}
              className="inline-block"
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(4rem, 13vw, 11rem)",
                fontWeight: 700,
                color: c === " " ? "transparent" : "var(--foreground)",
                letterSpacing: "-0.025em",
                lineHeight: 1,
              }}
              initial={{ opacity: 0, y: 90 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.08 + i * 0.055,
              }}
            >
              {c === " " ? " " : c}
            </motion.span>
          ))}

          <motion.p
            className="mt-8 text-base max-w-lg mx-auto"
            style={{
              fontFamily: SANS,
              color: "rgba(var(--fg-rgb),0.48)",
              lineHeight: 1.82,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.92 }}
          >
            Crafted with precision and purpose. Each project is
            a collaboration built to last.
          </motion.p>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          <div
            className="w-px h-12 mx-auto"
            style={{
              background: `linear-gradient(to bottom, ${LIME}, transparent)`,
            }}
          />
        </motion.div>
      </section>

      {/* ── Featured Projects ── */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto">
        <Reveal className="mb-14">
          <p
            className="tracking-[0.42em] uppercase mb-3"
            style={{
              fontFamily: SANS,
              fontSize: "0.6rem",
              color: LIME,
            }}
          >
            Featured
          </p>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            Highlighted work.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.slice(0, 2).map((p) => (
            <TiltCard
              key={p.id}
              project={p}
              onClick={() => setActive(p)}
            />
          ))}
        </div>
      </section>

      {/* ── Portfolio Grid with Filtering ── */}
      <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto">
        <Reveal className="mb-12">
          <p
            className="tracking-[0.42em] uppercase mb-3"
            style={{
              fontFamily: SANS,
              fontSize: "0.6rem",
              color: LIME,
            }}
          >
            All Projects
          </p>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            The full picture.
          </h2>
        </Reveal>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-3 mb-12">
          {CATS.map((c) => (
            <motion.button
              key={c}
              onClick={() => setCat(c)}
              className="px-5 py-2 rounded-full font-bold tracking-widest uppercase"
              style={{
                fontFamily: SANS,
                fontSize: "0.65rem",
                background: cat === c ? LIME : "transparent",
                color:
                  cat === c ? DARK : "rgba(var(--fg-rgb),0.48)",
                border: `1px solid ${cat === c ? LIME : "rgba(var(--fg-rgb),0.1)"}`,
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              {c}
            </motion.button>
          ))}
        </div>

        {/* Project grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                className="rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => setActive(p)}
                style={{
                  border: "1px solid rgba(var(--fg-rgb),0.062)",
                }}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                whileHover={{ y: -7 }}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <motion.img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.12 }}
                    transition={{ duration: 0.52 }}
                  />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: `${LIME}e0` }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.28 }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ color: DARK }}
                    >
                      ↗
                    </span>
                  </motion.div>
                </div>
                <div
                  className="p-5"
                  style={{ background: "var(--card)" }}
                >
                  <p
                    className="tracking-[0.28em] uppercase mb-1"
                    style={{
                      fontFamily: SANS,
                      fontSize: "0.58rem",
                      color: LIME,
                    }}
                  >
                    {p.category} · {p.year}
                  </p>
                  <h3
                    className="text-base font-semibold"
                    style={{
                      fontFamily: SANS,
                      color: "var(--foreground)",
                    }}
                  >
                    {p.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        className="py-24 px-6"
        style={{ background: "var(--card)" }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div
                className="font-black mb-2"
                style={{
                  fontFamily: SANS,
                  fontSize: "clamp(3rem, 6vw, 5rem)",
                  color: LIME,
                  lineHeight: 1,
                }}
              >
                <Counter to={s.num} suffix={s.suffix} />
              </div>
              <p
                className="tracking-widest uppercase"
                style={{
                  fontFamily: SANS,
                  fontSize: "0.6rem",
                  color: "rgba(var(--fg-rgb),0.38)",
                }}
              >
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Client Carousel ── */}
      <section
        className="py-20 overflow-hidden"
        style={{
          borderTop: "1px solid rgba(var(--fg-rgb),0.05)",
          borderBottom: "1px solid rgba(var(--fg-rgb),0.05)",
        }}
      >
        <Reveal className="text-center mb-10">
          <p
            className="tracking-[0.38em] uppercase"
            style={{
              fontFamily: SANS,
              fontSize: "0.58rem",
              color: "rgba(var(--fg-rgb),0.28)",
            }}
          >
            BRANDS WE'VE WORKED WITH
          </p>
        </Reveal>
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-20 items-center"
            style={{ width: "max-content" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...CLIENTS, ...CLIENTS].map((client, i) => (
              <span
                key={i}
                className="text-sm font-bold tracking-[0.28em] whitespace-nowrap"
                style={{
                  fontFamily: SANS,
                  color: "rgba(var(--fg-rgb),0.18)",
                }}
              >
                {client}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-40 px-6 overflow-hidden flex flex-col items-center justify-center text-center">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              `radial-gradient(ellipse at 50% 50%, rgba(176,245,66,0.09) 0%, transparent 58%)`,
              `radial-gradient(ellipse at 28% 50%, rgba(176,245,66,0.13) 0%, transparent 58%)`,
              `radial-gradient(ellipse at 72% 50%, rgba(176,245,66,0.09) 0%, transparent 58%)`,
              `radial-gradient(ellipse at 50% 50%, rgba(176,245,66,0.09) 0%, transparent 58%)`,
            ],
          }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <Reveal className="relative z-10 max-w-3xl">
          <p
            className="tracking-[0.42em] uppercase mb-6"
            style={{
              fontFamily: SANS,
              fontSize: "0.6rem",
              color: LIME,
            }}
          >
            Start a project
          </p>
          <h2
            className="mb-10 leading-tight"
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            Your next big
            <br />
            idea starts here.
          </h2>
          <MagBtn onClick={() => go("contact")}>
            LET'S COLLABORATE
          </MagBtn>
        </Reveal>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────
const PAGES: Record<Page, React.ComponentType> = {
  home: HomePage,
  contact: ContactPage,
  about: AboutPage,
  work: WorkPage,
};

export default function App() {
  const [page, setPage] = useState<Page>("home");

  const navigate = useCallback((p: Page) => {
    window.scrollTo({
      top: 0,
      behavior: "instant" as ScrollBehavior,
    });
    setPage(p);
  }, []);

  const PageComp = PAGES[page];

  return (
    <ThemeProvider>
      <NavCtx.Provider value={navigate}>
        <Cursor />
        <div
          style={{
            background: "var(--background)",
            minHeight: "100vh",
            fontFamily: SANS,
          }}
        >
          <Nav cur={page} />
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.38, ease: "easeInOut" }}
            >
              <PageComp />
              {page !== "home" && <Footer />}
            </motion.div>
          </AnimatePresence>
        </div>
      </NavCtx.Provider>
    </ThemeProvider>
  );
}