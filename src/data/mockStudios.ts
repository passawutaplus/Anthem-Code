import type { StudioCardData } from "@/hooks/usePublicStudios";
import type { Studio } from "@/hooks/useStudios";
import { mockDesigners } from "./mockDesigners";
import { projects as mockProjects } from "./mockData";

const avatar = (seed: string) => `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}&backgroundColor=fff4e6,ffe8cc,fff3bf`;
const cover = (seed: string) => `https://picsum.photos/seed/${seed}/800/400`;

const seeds = [
  { name: "Doi Studio", slug: "doi-studio", tagline: "Brand identity จากภาคเหนือ", bio: "ออกแบบแบรนด์ดิ้งสำหรับธุรกิจขนาดเล็ก เน้นเรื่องเล่า", location: "Chiang Mai", verified: true },
  { name: "Lotus Lab", slug: "lotus-lab", tagline: "Product & Packaging Studio", bio: "ดีไซน์แพ็กเกจสินค้าสไตล์ Earth-tone", location: "Bangkok", verified: true },
  { name: "Mango Pixel", slug: "mango-pixel", tagline: "Web & UX Studio", bio: "เว็บไซต์และแอปสำหรับสตาร์ทอัปไทย", location: "Bangkok", verified: false },
  { name: "Inkwell Co.", slug: "inkwell-co", tagline: "Illustration Collective", bio: "กลุ่มนักวาดภาพประกอบสไตล์ไทยร่วมสมัย", location: "Khon Kaen", verified: false },
  { name: "Frame & Field", slug: "frame-field", tagline: "Photography & Film", bio: "ถ่ายภาพ-วิดีโอเชิงสารคดี ครอบคลุมงานแบรนด์", location: "Chiang Rai", verified: true },
  { name: "Sundaze Crafts", slug: "sundaze-crafts", tagline: "Handmade Goods", bio: "งานคราฟต์-เซรามิกจากช่างฝีมือไทย", location: "Lampang", verified: false },
  { name: "Soundwave Bangkok", slug: "soundwave-bkk", tagline: "Music & Audio Production", bio: "สตูดิโอเสียงสำหรับโฆษณา-พอดแคสต์", location: "Bangkok", verified: false },
  { name: "Pixel Garden", slug: "pixel-garden", tagline: "Motion Graphics", bio: "Motion Designer ทีมเล็กสไตล์เล่าเรื่อง", location: "Bangkok", verified: true },
  { name: "Yim Studio", slug: "yim-studio", tagline: "Logo & Branding", bio: "ออกแบบโลโก้สำหรับธุรกิจครอบครัว", location: "Phuket", verified: false },
  { name: "Talay Creative", slug: "talay-creative", tagline: "Boutique Web Studio", bio: "เว็บไซต์โรงแรม คาเฟ่ ริมทะเล", location: "Krabi", verified: false },
  { name: "Hatti Type", slug: "hatti-type", tagline: "Type Foundry", bio: "ออกแบบฟอนต์ภาษาไทยร่วมสมัย", location: "Bangkok", verified: true },
  { name: "Northern Frame", slug: "northern-frame", tagline: "Documentary Photo", bio: "ภาพถ่ายชุมชนภาคเหนือ", location: "Chiang Mai", verified: false },
  { name: "Studio Krating", slug: "studio-krating", tagline: "Brand & Packaging", bio: "แบรนด์สินค้าเกษตรไทย", location: "Nakhon Pathom", verified: false },
  { name: "Manus Lab", slug: "manus-lab", tagline: "Craft & Ceramic", bio: "งานเซรามิก-แก้วเป่าจากช่างไทย", location: "Lamphun", verified: true },
  { name: "Ploy Visuals", slug: "ploy-visuals", tagline: "Wedding & Lifestyle Photo", bio: "ถ่ายภาพแต่งงานสไตล์มินิมอล", location: "Bangkok", verified: false },
  { name: "Heading South", slug: "heading-south", tagline: "Travel Content Studio", bio: "คอนเทนต์ท่องเที่ยวภาคใต้", location: "Phuket", verified: false },
  { name: "Tofu Animation", slug: "tofu-anim", tagline: "2D Animation Studio", bio: "อนิเมชันโฆษณา-การศึกษา", location: "Bangkok", verified: true },
  { name: "Klang Studio", slug: "klang-studio", tagline: "Sound Design House", bio: "ออกแบบเสียงโฆษณา-เกม", location: "Bangkok", verified: false },
  { name: "Mana Press", slug: "mana-press", tagline: "Editorial & Print", bio: "นิตยสารและงานพิมพ์แบบทดลอง", location: "Bangkok", verified: false },
  { name: "Ruen Creative", slug: "ruen-creative", tagline: "Interior + Brand", bio: "ออกแบบร้านอาหารและคาเฟ่", location: "Bangkok", verified: true },
];

export const mockStudios: StudioCardData[] = seeds.map((s, idx) => {
  const studio: Studio = {
    id: `mock-studio-${idx}`,
    slug: s.slug,
    name: s.name,
    tagline: s.tagline,
    bio: s.bio,
    avatar_url: avatar(s.slug),
    cover_url: cover(s.slug),
    location: s.location,
    website: "",
    verified: s.verified,
    created_by: `mock-designer-${idx % mockDesigners.length}`,
    member_count: 3 + (idx % 6),
    created_at: new Date(Date.now() - idx * 86_400_000).toISOString(),
  };

  const members = Array.from({ length: studio.member_count }).map((_, i) => {
    const d = mockDesigners[(idx + i) % mockDesigners.length];
    return {
      id: (d.profile as any).id,
      avatar_url: (d.profile as any).avatar_url,
      display_name: (d.profile as any).display_name,
    };
  });

  const projectCovers = Array.from({ length: 3 }).map((_, i) => {
    const p = mockProjects[(idx * 3 + i) % mockProjects.length];
    return { id: p.id, title: p.title, cover: p.image };
  });

  return {
    studio,
    memberAvatars: members.slice(0, 5),
    projectCovers,
    searchHaystack: [s.name, s.tagline, s.bio, s.location].join(" ").toLowerCase(),
  };
});
