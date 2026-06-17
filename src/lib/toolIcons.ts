type ToolEntry = {
  label: string;
  slug: string;
  aliases?: string[];
  desc?: string;
};

/** Canonical tools with theSVG slugs + common aliases (case-insensitive). */
const TOOL_CATALOG: ToolEntry[] = [
  // Adobe Creative Cloud
  { label: "Photoshop", slug: "photoshop", aliases: ["adobe photoshop", "ps"], desc: "Adobe Photoshop — แต่งภาพ & composite" },
  { label: "Illustrator", slug: "illustrator", aliases: ["adobe illustrator", "ai"], desc: "Adobe Illustrator — งาน vector" },
  { label: "After Effects", slug: "after-effects", aliases: ["adobe after effects", "ae"], desc: "Motion graphics & VFX" },
  { label: "Premiere", slug: "premierepro", aliases: ["premiere pro", "adobe premiere", "adobe premiere pro", "pr"], desc: "ตัดต่อวิดีโอระดับโปร" },
  { label: "Lightroom", slug: "lightroom", aliases: ["adobe lightroom", "lr"], desc: "แต่งสีภาพถ่าย" },
  { label: "Audition", slug: "audition", aliases: ["adobe audition"], desc: "ตัดต่อเสียงระดับโปร" },
  { label: "InDesign", slug: "indesign", aliases: ["indesign", "adobe indesign", "id"], desc: "จัดหน้าเล่ม & สิ่งพิมพ์" },
  { label: "Adobe XD", slug: "xd", aliases: ["xd"], desc: "ออกแบบ UI/UX prototype" },
  { label: "Animate", slug: "animate", aliases: ["adobe animate", "flash"], desc: "แอนิเมชัน 2D" },
  { label: "Adobe Firefly", slug: "firefly-adobe", aliases: ["firefly"], desc: "AI สร้างภาพจาก Adobe" },
  { label: "Substance Painter", slug: "substance-3d-painter", aliases: ["substance painter", "substance"], desc: "เทกเจอร์ 3D painting" },

  // Design & UI
  { label: "Figma", slug: "figma", desc: "ออกแบบ UI/UX collaborative" },
  { label: "Sketch", slug: "sketch", desc: "ออกแบบ UI บน macOS" },
  { label: "Framer", slug: "framer", desc: "ออกแบบ & prototype เว็บ" },
  { label: "Canva", slug: "canva", desc: "เทมเพลตสำเร็จรูปสำหรับโซเชียล" },
  { label: "Penpot", slug: "penpot", desc: "ออกแบบ UI โอเพนซอร์ส" },
  { label: "Miro", slug: "miro", desc: "บอร์ด brainstorm & workshop" },
  { label: "InVision", slug: "invision", desc: "prototype & design review" },
  { label: "Zeplin", slug: "zeplin", desc: "ส่งมอบงานดีไซน์ให้ dev" },

  // 3D & Motion
  { label: "Blender", slug: "blender", desc: "3D modeling & rendering ฟรี" },
  { label: "Cinema 4D", slug: "cinema-4d", aliases: ["cinema4d", "c4d"], desc: "3D motion graphics" },
  { label: "ZBrush", slug: "zbrush", aliases: ["z brush"], desc: "Sculpt 3D ระดับโปร" },
  { label: "Maya", slug: "autodesk-maya", aliases: ["autodesk maya"], desc: "3D animation ระดับสตูดิโอ" },
  { label: "3ds Max", slug: "autodesk", aliases: ["3dsmax", "3d studio max"], desc: "3D modeling & rendering" },
  { label: "Rhino", slug: "rhinoceros", aliases: ["rhino 3d", "rhinoceros 3d"], desc: "CAD & 3D modeling" },
  { label: "Houdini", slug: "houdini", aliases: ["sidefx houdini"], desc: "VFX procedural 3D" },
  { label: "Spline", slug: "spline", desc: "3D บนเว็บแบบ real-time" },
  { label: "Unity", slug: "unity", desc: "เกม & interactive 3D" },
  { label: "Unreal", slug: "unreal-engine", aliases: ["unreal engine", "ue5", "ue4"], desc: "เกม & real-time 3D" },

  // Video
  { label: "DaVinci Resolve", slug: "davinci-resolve", aliases: ["davinci", "resolve"], desc: "ตัดต่อ & color grade" },
  { label: "Final Cut Pro", slug: "final-cut-pro", aliases: ["final cut", "fcp"], desc: "ตัดต่อวิดีโอบน Mac" },
  { label: "CapCut", slug: "capcut", desc: "ตัดต่อวิดีโอสายโซเชียล" },
  { label: "OBS Studio", slug: "obs-studio", aliases: ["obs"], desc: "สตรีม & บันทึกหน้าจอ" },

  // Illustration & Photo
  { label: "Procreate", slug: "procreate", desc: "วาดภาพดิจิทัลบน iPad" },
  { label: "Affinity Designer", slug: "affinity-designer", aliases: ["affinity"], desc: "งาน vector ทางเลือก Adobe" },
  { label: "Affinity Photo", slug: "affinity-photo", desc: "แต่งภาพทางเลือก Photoshop" },
  { label: "CorelDRAW", slug: "coreldraw", aliases: ["corel draw"], desc: "งาน vector & layout" },

  // Audio
  { label: "Logic Pro", slug: "logic-pro", aliases: ["logic"], desc: "DAW บน macOS" },
  { label: "Ableton", slug: "ableton-live", aliases: ["ableton live"], desc: "DAW สาย electronic" },
  { label: "FL Studio", slug: "fl-studio", aliases: ["fl"], desc: "DAW สร้างบีท & เพลง" },
  { label: "Pro Tools", slug: "pro-tools", aliases: ["avid pro tools"], desc: "DAW มาตรฐานสตูดิโอ" },
  { label: "GarageBand", slug: "garageband", desc: "DAW เริ่มต้นบน Apple" },

  // Web & Dev
  { label: "React", slug: "react", desc: "UI library สำหรับเว็บ" },
  { label: "Next.js", slug: "nextdotjs", aliases: ["nextjs", "next"], desc: "React framework full-stack" },
  { label: "Vue", slug: "vue", aliases: ["vue.js", "vuejs", "vuedotjs"], desc: "JavaScript framework" },
  { label: "Angular", slug: "angular", desc: "TypeScript web framework" },
  { label: "Svelte", slug: "svelte", desc: "Compiler-based UI framework" },
  { label: "TypeScript", slug: "typescript", aliases: ["ts"], desc: "JavaScript + types" },
  { label: "JavaScript", slug: "javascript", aliases: ["js"], desc: "ภาษาหลักของเว็บ" },
  { label: "Tailwind", slug: "tailwind-css", aliases: ["tailwind css", "tailwindcss"], desc: "Utility-first CSS" },
  { label: "HTML5", slug: "html5", aliases: ["html"], desc: "โครงสร้างเว็บ" },
  { label: "CSS3", slug: "css3", aliases: ["css"], desc: "สไตล์เว็บ" },
  { label: "Node.js", slug: "nodedotjs", aliases: ["nodejs", "node"], desc: "JavaScript runtime" },
  { label: "Python", slug: "python", desc: "ภาษา script & data" },
  { label: "PHP", slug: "php", desc: "ภาษา backend เว็บ" },
  { label: "Rust", slug: "rust", desc: "ภาษาระบบประสิทธิภาพสูง" },
  { label: "Go", slug: "go", aliases: ["golang"], desc: "ภาษา backend จาก Google" },
  { label: "VS Code", slug: "visual-studio-code", aliases: ["visual studio code", "vscode"], desc: "ตัวแก้โค้ดยอดนิยม" },
  { label: "Git", slug: "git", desc: "ระบบ version control" },
  { label: "GitHub", slug: "github", desc: "โฮสต์โค้ด & collaboration" },
  { label: "GitLab", slug: "gitlab", desc: "DevOps & โฮสต์โค้ด" },
  { label: "Docker", slug: "docker", desc: "คอนเทนเนอร์ไซส์แอป" },
  { label: "Kubernetes", slug: "kubernetes", aliases: ["k8s"], desc: "Orchestrate containers" },
  { label: "Vercel", slug: "vercel", desc: "deploy เว็บ & serverless" },
  { label: "Netlify", slug: "netlify", desc: "deploy static & Jamstack" },
  { label: "Webflow", slug: "webflow", desc: "สร้างเว็บ visual + CMS" },
  { label: "WordPress", slug: "wordpress", aliases: ["wp"], desc: "CMS ยอดนิยม" },
  { label: "Shopify", slug: "shopify", desc: "ร้านค้าออนไลน์" },
  { label: "Strapi", slug: "strapi", desc: "headless CMS" },
  { label: "Supabase", slug: "supabase", desc: "Backend-as-a-Service" },
  { label: "Firebase", slug: "firebase", desc: "Backend จาก Google" },

  // Productivity
  { label: "Notion", slug: "notion", desc: "จัดการโปรเจกต์ & docs" },
  { label: "Trello", slug: "trello", desc: "บอร์ดงานแบบการ์ด" },
  { label: "Asana", slug: "asana", desc: "จัดการงานทีม" },
  { label: "Linear", slug: "linear", desc: "ติดตาม issue สาย dev" },
  { label: "Jira", slug: "jira", desc: "ติดตามงาน Agile" },
  { label: "Slack", slug: "slack", desc: "แชททีม" },
  { label: "Discord", slug: "discord", desc: "ชุมชน & แชท" },
  { label: "Obsidian", slug: "obsidian", desc: "จดบันทึกแบบ linked notes" },

  // AI
  { label: "ChatGPT", slug: "openai", aliases: ["gpt", "gpt-4", "gpt4"], desc: "AI ช่วยเขียน & ไอเดีย" },
  { label: "OpenAI", slug: "openai", desc: "แพลตฟอร์ม AI จาก OpenAI" },
  { label: "Midjourney", slug: "midjourney", aliases: ["mj"], desc: "สร้างภาพจาก prompt" },
  { label: "Stable Diffusion", slug: "stability-ai", aliases: ["sd"], desc: "โมเดลสร้างภาพ open" },
  { label: "DALL·E", slug: "openai", aliases: ["dalle", "dall-e", "dall e"], desc: "สร้างภาพจาก OpenAI" },
  { label: "Runway", slug: "runway", aliases: ["runway ml"], desc: "AI วิดีโอ & creative" },
  { label: "Claude", slug: "anthropic", desc: "AI assistant จาก Anthropic" },
];

function normalizeToolLookupKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

function compactKey(raw: string): string {
  return normalizeToolLookupKey(raw).replace(/[^a-z0-9]/g, "");
}

const slugByKey = new Map<string, string>();
const descByKey = new Map<string, string>();

for (const entry of TOOL_CATALOG) {
  const keys = [entry.label, ...(entry.aliases ?? [])];
  for (const k of keys) {
    slugByKey.set(normalizeToolLookupKey(k), entry.slug);
    slugByKey.set(compactKey(k), entry.slug);
    if (entry.desc) {
      descByKey.set(normalizeToolLookupKey(k), entry.desc);
      descByKey.set(compactKey(k), entry.desc);
    }
  }
}

/** Preferred labels for tool suggestions (design-first ordering). */
export const COMMON_TOOLS = [
  "Figma",
  "Photoshop",
  "Illustrator",
  "Procreate",
  "Blender",
  "After Effects",
  "Premiere",
  "DaVinci Resolve",
  "Canva",
  "Lightroom",
  "CapCut",
  "InDesign",
  "Cinema 4D",
  "Maya",
  "Unity",
  "Notion",
  "Webflow",
  "React",
  "Tailwind",
  "Midjourney",
  "VS Code",
] as const;

export function resolveToolIconSlug(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const spaced = normalizeToolLookupKey(trimmed);
  const compact = compactKey(trimmed);

  const mapped = slugByKey.get(spaced) ?? slugByKey.get(compact);
  if (mapped) return mapped;

  if (/^[a-z0-9][a-z0-9-]*$/.test(compact) && compact.length > 1) {
    return compact;
  }

  return null;
}

export function getToolDescription(name: string): string | undefined {
  const spaced = normalizeToolLookupKey(name);
  const compact = compactKey(name);
  return descByKey.get(spaced) ?? descByKey.get(compact);
}

/** Bundled icons for tools not on theSVG (see public/tool-icons/). */
const LOCAL_TOOL_ICONS: Record<string, string> = {
  procreate: "/tool-icons/procreate.png",
  invision: "/tool-icons/invision.svg",
  zeplin: "/tool-icons/zeplin.svg",
  zbrush: "/tool-icons/zbrush.svg",
  spline: "/tool-icons/spline.webp",
  "final-cut-pro": "/tool-icons/final-cut-pro.svg",
  "logic-pro": "/tool-icons/logic-pro.svg",
  "ableton-live": "/tool-icons/ableton-live.svg",
  "fl-studio": "/tool-icons/fl-studio.png",
  garageband: "/tool-icons/garageband.svg",
};

export function toolIconUrl(slug: string): string {
  return toolIconSources(slug)[0];
}

/** Local asset first, then theSVG CDN. */
export function toolIconSources(slug: string): string[] {
  const local = LOCAL_TOOL_ICONS[slug];
  const remote = `https://thesvg.org/icons/${slug}/default.svg`;
  return local ? [local, remote] : [remote];
}
