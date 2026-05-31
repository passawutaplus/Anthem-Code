import { projects as mockProjects } from "./mockData";
import type { DesignerCardData } from "@/data/designerTypes";

const designerSeeds: Array<{
  name: string;
  username: string;
  role: string;
  bio: string;
  skills: string[];
  categories: string[];
}> = [
  { name: "ภัสวุฒิ ศรีวงค์", username: "phatsawut", role: "Brand & Logo Designer", bio: "ออกแบบโลโก้ & แบรนด์ดิ้งสไตล์มินิมอล", skills: ["Logo", "Branding", "Illustrator"], categories: ["Graphic"] },
  { name: "นภัสรา ทองดี", username: "napatsara", role: "Brand Identity Designer", bio: "สร้างแบรนด์ขนมไทยและร้านคาเฟ่", skills: ["Branding", "Packaging", "Figma"], categories: ["Graphic"] },
  { name: "พิมพ์ชนก ใจดี", username: "pimchanok", role: "Illustrator", bio: "ภาพประกอบเด็ก & Pop Art", skills: ["Procreate", "Illustration", "Character"], categories: ["Illustration"] },
  { name: "วรรณกร พันธ์ทอง", username: "wannakorn", role: "Pattern & Textile Designer", bio: "ลายผ้าไทยสไตล์โมเดิร์น", skills: ["Pattern", "Textile", "Illustrator"], categories: ["Craft"] },
  { name: "ธัญญา รัตนพร", username: "thanya", role: "Ceramic Artist", bio: "เซรามิกแฮนด์เมด Earth Tone", skills: ["Ceramic", "Craft", "Product"], categories: ["Craft"] },
  { name: "ฉัตรชัย วรกุล", username: "chatchai", role: "Web & Poster Designer", bio: "เว็บไซต์ร้านอาหาร & โปสเตอร์หนัง", skills: ["Figma", "Webflow", "Poster"], categories: ["Web/UI", "Graphic"] },
  { name: "อาทิตยา จันทร์เพ็ญ", username: "atittaya", role: "UX/UI Designer", bio: "ออกแบบแอป & เว็บโรงแรม Boutique", skills: ["Figma", "UX", "UI", "Webflow"], categories: ["Web/UI"] },
  { name: "พลอยไพลิน ขจร", username: "ploypailin", role: "Content Creator", bio: "TikTok สายอาหารเหนือ", skills: ["TikTok", "Premiere", "CapCut"], categories: ["Content"] },
  { name: "ธนกร แสงทอง", username: "thanakorn", role: "IG Content & Photo", bio: "รีวิวคาเฟ่สไตล์มินิมอล", skills: ["Lightroom", "Canva", "Photo"], categories: ["Content"] },
  { name: "อนุชา ภูมิดี", username: "anucha", role: "Product Photographer", bio: "ถ่ายสินค้า OTOP & ผ้าทอ", skills: ["Photography", "Lightroom", "Product"], categories: ["Photography"] },
  { name: "ปาริชาต สวยงาม", username: "parichat", role: "Wedding Photographer", bio: "พรีเวดดิ้งสไตล์มินิมอล", skills: ["Wedding", "Portrait", "Lightroom"], categories: ["Photography"] },
  { name: "เจษฎา ท่องเที่ยว", username: "jessada", role: "Video Editor", bio: "ตัดต่อ Vlog ท่องเที่ยว", skills: ["Premiere", "After Effects", "Vlog"], categories: ["Video"] },
  { name: "สุพัตรา โมชั่น", username: "supatra", role: "Motion Designer", bio: "Motion Graphic อธิบายสินค้า", skills: ["After Effects", "Motion", "Illustrator"], categories: ["Video"] },
  { name: "วทัญญู เสียงดี", username: "wathanyu", role: "Sound Designer", bio: "Sound Design พอดแคสต์", skills: ["Audition", "Logic Pro", "Sound"], categories: ["Music/Audio"] },
  { name: "กฤษณา เมโลดี้", username: "kritsana", role: "Music Producer", bio: "เพลงประกอบโฆษณา", skills: ["Logic Pro", "Ableton", "Composer"], categories: ["Music/Audio"] },
  { name: "ศิริพร เงินงาม", username: "siriporn", role: "Jewelry Designer", bio: "เครื่องประดับเงินแฮนด์เมด", skills: ["Jewelry", "Silver", "Craft"], categories: ["Craft"] },
  { name: "กิตติพงษ์ ดิจิทัล", username: "kittipong", role: "Web Developer & UI", bio: "Landing page & E-commerce", skills: ["Webflow", "Figma", "React"], categories: ["Web/UI"] },
  { name: "มนัสนันท์ อาร์ต", username: "manatsanan", role: "Digital Illustrator", bio: "ภาพประกอบดิจิทัล & สติกเกอร์", skills: ["Procreate", "Sticker", "Illustration"], categories: ["Illustration"] },
  { name: "ณัฐวุฒิ ภาพถ่าย", username: "nattawut", role: "Street Photographer", bio: "ภาพสตรีท กรุงเทพ & ต่างจังหวัด", skills: ["Photography", "Street", "Film"], categories: ["Photography"] },
  { name: "ภัทรานิษฐ์ คอนเทนต์", username: "phattranit", role: "Content Strategist", bio: "วางแผนคอนเทนต์แบรนด์", skills: ["Content", "Strategy", "Copywriting"], categories: ["Content"] },
];

export const mockDesigners: DesignerCardData[] = designerSeeds.map((seed, idx) => {
  const matched = mockProjects.filter(
    (p) => seed.categories.includes(p.category) && p.status === "Published"
  );
  // pick up to 6, cycling if not enough
  const picked = [] as typeof mockProjects;
  for (let i = 0; picked.length < 6 && i < mockProjects.length * 2; i++) {
    const src = matched.length ? matched : mockProjects;
    const candidate = src[(idx + i) % src.length];
    if (candidate && !picked.find((x) => x.id === candidate.id)) picked.push(candidate);
  }

  const projectsAsRows = picked.map((p) => ({
    id: p.id,
    title: p.title,
    cover_url: p.image,
    gallery_urls: p.gallery ?? [],
    category: p.category,
    tools: p.tools ?? [],
    tags: [],
    owner_id: `mock-${idx}`,
  })) as unknown as DesignerCardData["projects"];

  const profile = {
    id: `mock-designer-${idx}`,
    display_name: seed.name,
    username: seed.username,
    role: seed.role,
    bio: seed.bio,
    skills: seed.skills,
    avatar_url: null,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  } as unknown as DesignerCardData["profile"];

  const haystack = [
    seed.name,
    seed.username,
    seed.role,
    seed.bio,
    seed.skills.join(" "),
    seed.categories.join(" "),
    picked.map((p) => p.title).join(" "),
    picked.flatMap((p) => p.tools ?? []).join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return { profile, projects: projectsAsRows, searchHaystack: haystack };
});
