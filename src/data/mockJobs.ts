import type { JobPost } from "@/hooks/useJobs";
import { mockStudios } from "./mockStudios";

const seeds: Array<Partial<JobPost> & { title: string; role_category: string; skills: string[]; description: string; budget_min: number; budget_max: number; location_type: JobPost["location_type"]; location: string; budget_type: JobPost["budget_type"] }> = [
  { title: "หา UI Designer ทำแอป Wellness", role_category: "UI/UX", skills: ["Figma", "Prototyping", "Design System"], description: "ทำหน้าจอแอปจองคลาสโยคะ 30+ จอ ระยะเวลา 6 สัปดาห์", budget_min: 35000, budget_max: 60000, budget_type: "fixed", location_type: "remote", location: "Remote" },
  { title: "Graphic Designer ทำ Packaging ขนมไทย", role_category: "Graphic", skills: ["Illustrator", "Packaging", "Print"], description: "ออกแบบกล่อง-ฉลาก 8 SKU ส่งโรงพิมพ์", budget_min: 18000, budget_max: 30000, budget_type: "fixed", location_type: "hybrid", location: "Bangkok" },
  { title: "Brand Designer สำหรับสตาร์ทอัป Fintech", role_category: "Branding", skills: ["Logo", "Brand Guideline", "Figma"], description: "ทำโลโก้ + brand guideline เต็มรูปแบบ", budget_min: 45000, budget_max: 80000, budget_type: "fixed", location_type: "remote", location: "Remote" },
  { title: "Illustrator วาดภาพประกอบหนังสือเด็ก", role_category: "Illustration", skills: ["Procreate", "Children Book", "Color"], description: "ภาพประกอบ 24 หน้า + ปก พร้อม revision 2 รอบ", budget_min: 30000, budget_max: 55000, budget_type: "fixed", location_type: "remote", location: "Remote" },
  { title: "Motion Designer ทำคลิปสินค้า 30 วินาที", role_category: "Motion", skills: ["After Effects", "Storyboard"], description: "คลิป Motion อธิบายแอป ตัด-มิกซ์เสียงให้พร้อม", budget_min: 22000, budget_max: 40000, budget_type: "fixed", location_type: "remote", location: "Remote" },
  { title: "Photographer ถ่าย Lookbook คอลเลกชันใหม่", role_category: "Photography", skills: ["Fashion", "Studio", "Lightroom"], description: "ถ่ายภาพ Lookbook 12 ลุค พร้อม retouch", budget_min: 15000, budget_max: 28000, budget_type: "fixed", location_type: "onsite", location: "Bangkok" },
  { title: "Sound Designer ทำเสียงโฆษณา 15s", role_category: "Audio", skills: ["Logic Pro", "SFX", "Mix"], description: "เสียงประกอบโฆษณาออนไลน์ พร้อม VO ภาษาไทย", budget_min: 8000, budget_max: 15000, budget_type: "fixed", location_type: "remote", location: "Remote" },
  { title: "UX Researcher เก็บข้อมูลผู้ใช้คาเฟ่", role_category: "UX/Research", skills: ["Interview", "Journey Map"], description: "สัมภาษณ์ 8 คน + ทำ journey map ส่งรายงาน", budget_min: 25000, budget_max: 45000, budget_type: "fixed", location_type: "hybrid", location: "Bangkok" },
  { title: "Pattern Designer ทำลายผ้าคอลเลกชัน SS27", role_category: "Pattern", skills: ["Illustrator", "Repeat Pattern"], description: "ลายผ้า 6 ลาย พร้อมไฟล์โรงพิมพ์", budget_min: 18000, budget_max: 30000, budget_type: "fixed", location_type: "remote", location: "Remote" },
  { title: "Video Editor ตัด Vlog ท่องเที่ยว", role_category: "Video", skills: ["Premiere", "Color Grade"], description: "ตัดต่อคลิป 8-10 นาที วันละ 1 EP รวม 8 EP", budget_min: 4500, budget_max: 7000, budget_type: "fixed", location_type: "remote", location: "Remote" },
  { title: "Logo Designer สำหรับคลินิกใหม่", role_category: "Branding", skills: ["Logo", "Stationery"], description: "โลโก้ + นามบัตร + ป้ายหน้าร้าน", budget_min: 9000, budget_max: 18000, budget_type: "fixed", location_type: "remote", location: "Remote" },
  { title: "Webflow Developer สร้าง Landing Page", role_category: "Web/UI", skills: ["Webflow", "Animations"], description: "Landing page 4 sections + form, อยากได้แอนิเมชันลื่นๆ", budget_min: 15000, budget_max: 28000, budget_type: "fixed", location_type: "remote", location: "Remote" },
  { title: "Content Creator สาย TikTok อาหาร", role_category: "Content", skills: ["TikTok", "Editing"], description: "ทำคลิป TikTok 8 คลิป/เดือน เรท rate การ์ด", budget_min: 25000, budget_max: 45000, budget_type: "monthly", location_type: "hybrid", location: "Bangkok" },
  { title: "3D Artist สร้างโมเดลสินค้าเครื่องประดับ", role_category: "3D", skills: ["Blender", "Keyshot"], description: "โมเดล 10 ชิ้น + render 3 ภาพต่อชิ้น", budget_min: 22000, budget_max: 40000, budget_type: "fixed", location_type: "remote", location: "Remote" },
  { title: "Copywriter เขียนเว็บโรงแรม", role_category: "Copywriting", skills: ["TH/EN", "Brand Voice"], description: "เขียนเว็บไซต์โรงแรม Boutique ทั้งภาษาไทย-อังกฤษ", budget_min: 18000, budget_max: 35000, budget_type: "fixed", location_type: "remote", location: "Remote" },
  { title: "Mascot Designer ทำคาแรกเตอร์", role_category: "Illustration", skills: ["Character", "Procreate"], description: "ออกแบบมาสคอต 1 ตัว 3 expression + sticker pack", budget_min: 12000, budget_max: 22000, budget_type: "fixed", location_type: "remote", location: "Remote" },
  { title: "Poster Designer สำหรับเทศกาลหนัง", role_category: "Graphic", skills: ["Poster", "Typography"], description: "โปสเตอร์ 5 ผลงาน ขนาด A1 พร้อม social asset", budget_min: 20000, budget_max: 35000, budget_type: "fixed", location_type: "remote", location: "Remote" },
  { title: "App Designer ทำ Onboarding flow", role_category: "UI/UX", skills: ["Figma", "Onboarding"], description: "Onboarding 6 จอ + Empty states", budget_min: 8000, budget_max: 15000, budget_type: "fixed", location_type: "remote", location: "Remote" },
  { title: "Wedding Photographer พรีเวดดิ้ง", role_category: "Photography", skills: ["Wedding", "Outdoor"], description: "ถ่ายพรีเวดดิ้ง 1 วัน + ส่งภาพ retouch 80 รูป", budget_min: 15000, budget_max: 25000, budget_type: "fixed", location_type: "onsite", location: "Chiang Mai" },
  { title: "Music Producer เพลง Jingle 10s", role_category: "Audio", skills: ["Composer", "Logic Pro"], description: "Jingle สำหรับโฆษณา TV แบรนด์ใหญ่", budget_min: 25000, budget_max: 45000, budget_type: "fixed", location_type: "remote", location: "Remote" },
  { title: "Stylist + Photographer ถ่าย OTOP", role_category: "Photography", skills: ["Styling", "Product"], description: "ถ่ายสินค้า OTOP 20 SKU พร้อม mood ภาพรวม", budget_min: 18000, budget_max: 30000, budget_type: "fixed", location_type: "hybrid", location: "Chiang Mai" },
  { title: "Senior Designer เข้าทำงานประจำ Studio", role_category: "Full-time", skills: ["Branding", "Team Lead"], description: "เปิดรับ Senior Designer ดูแลแบรนด์ลูกค้า 4-5 ราย", budget_min: 65000, budget_max: 90000, budget_type: "monthly", location_type: "onsite", location: "Bangkok" },
  { title: "Junior UI Designer (Part-time)", role_category: "UI/UX", skills: ["Figma", "Junior"], description: "Part-time 20 ชม./สัปดาห์ ทำงานกับทีมเดเวลเปอร์", budget_min: 350, budget_max: 600, budget_type: "hourly", location_type: "remote", location: "Remote" },
  { title: "Editorial Designer ทำเล่มรายงานประจำปี", role_category: "Editorial", skills: ["InDesign", "Layout"], description: "เล่มรายงาน 80 หน้า + ส่งไฟล์โรงพิมพ์", budget_min: 35000, budget_max: 55000, budget_type: "fixed", location_type: "remote", location: "Remote" },
];

export const mockJobs: JobPost[] = seeds.map((s, i) => {
  const studio = mockStudios[i % mockStudios.length].studio;
  const isSeeking = i % 6 === 5; // sprinkle in some "user looking for job" posts
  return {
    id: `mock-job-${i}`,
    studio_id: isSeeking ? null : studio.id,
    posted_by: studio.created_by,
    title: isSeeking ? `${s.role_category} มองหางานประจำ` : s.title,
    role_category: s.role_category,
    description: s.description,
    skills: s.skills,
    budget_min: s.budget_min,
    budget_max: s.budget_max,
    budget_type: s.budget_type,
    location_type: s.location_type,
    location: s.location,
    deadline: new Date(Date.now() + (10 + i) * 86_400_000).toISOString(),
    status: "open",
    applicants_count: (i * 3) % 18,
    views: 60 + (i * 27) % 600,
    created_at: new Date(Date.now() - i * 3_600_000 * 8).toISOString(),
    updated_at: new Date().toISOString(),
    post_type: isSeeking ? "seeking" : "hiring",
    poster_role: isSeeking ? "freelancer" : "studio",
    employment_type: s.budget_type === "monthly" ? "fulltime" : s.budget_type === "hourly" ? "parttime" : "project",
    attached_cv_url: null,
    attached_portfolio_ids: [],
    studio: isSeeking ? undefined : {
      name: studio.name,
      slug: studio.slug,
      avatar_url: studio.avatar_url,
      verified: studio.verified,
    },
    poster: isSeeking ? {
      display_name: studio.name + " (Freelance)",
      avatar_url: studio.avatar_url,
      username: null,
    } : undefined,
  };
});
