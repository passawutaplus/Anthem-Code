import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import project5 from "@/assets/project-5.jpg";
import project6 from "@/assets/project-6.jpg";

export type {
  Category,
  SpecialFilter,
  FeedFilter,
  ProjectStatus,
  HiringStatus,
  Project,
  HiringRequest,
} from "@/data/projectTypes";
export { categories, specialFilters, feedFilters } from "@/data/projectTypes";

import type { Category, Project, HiringRequest } from "@/data/projectTypes";


const IMG = [project1, project2, project3, project4, project5, project6];
const pic = (i: number) => IMG[i % IMG.length];
const gal = (i: number) => [pic(i), pic(i + 1), pic(i + 2), pic(i + 3)];

const raw: Omit<Project, "id" | "image" | "gallery" | "ownerAvatar" | "bookmarked" | "comments">[] = [
  { title: "โลโก้ร้านกาแฟเชียงใหม่ Doi Brew", category: "Graphic", owner: "ภัสวุฒิ", likes: 24, views: 312, status: "Published", publishedDate: "2026-04-28", tools: ["Illustrator", "Photoshop"], price: "฿3,500" },
  { title: "แบรนด์ดิ้งร้านขนมไทย แม่ละมุน", category: "Graphic", owner: "นภัสรา", likes: 41, views: 528, status: "Published", publishedDate: "2026-04-26", tools: ["Illustrator", "Figma"], price: "฿8,000" },
  { title: "ภาพประกอบหนังสือเด็ก ช้างน้อยกับดวงดาว", category: "Illustration", owner: "พิมพ์ชนก", likes: 87, views: 1240, status: "Published", publishedDate: "2026-04-25", tools: ["Procreate", "Photoshop"], price: "฿12,000" },
  { title: "Pattern ผ้าขาวม้าโมเดิร์น", category: "Craft", owner: "วรรณกร", likes: 36, views: 410, status: "Published", publishedDate: "2026-04-24", tools: ["Illustrator", "Procreate"], price: "฿6,500" },
  { title: "เซรามิกสไตล์มินิมอล Earth Tone", category: "Craft", owner: "ธัญญา", likes: 52, views: 689, status: "Published", publishedDate: "2026-04-23", tools: ["Lightroom", "Photoshop"], price: "฿4,800" },
  { title: "เว็บไซต์ร้านอาหารอีสาน ส้มตำลำซิ่ง", category: "Web/UI", owner: "ฉัตรชัย", likes: 19, views: 245, status: "Published", publishedDate: "2026-04-22", tools: ["Figma", "Webflow"], price: "฿18,000" },
  { title: "UI App จองคิวสปา Thai Wellness", category: "Web/UI", owner: "อาทิตยา", likes: 28, views: 367, status: "Published", publishedDate: "2026-04-21", tools: ["Figma", "Notion"], price: "฿22,000" },
  { title: "Landing Page คอร์สเรียนทำขนม", category: "Web/UI", owner: "ภัสวุฒิ", likes: 14, views: 198, status: "Published", publishedDate: "2026-04-20", tools: ["Figma", "Webflow"], price: "฿9,500" },
  { title: "คอนเทนต์ TikTok สายอาหารเหนือ", category: "Content", owner: "พลอยไพลิน", likes: 145, views: 2890, status: "Published", publishedDate: "2026-04-19", tools: ["Premiere", "CapCut"], price: "฿3,200/คลิป" },
  { title: "รีวิวคาเฟ่สไตล์ minimal บน IG", category: "Content", owner: "ธนกร", likes: 78, views: 1120, status: "Published", publishedDate: "2026-04-18", tools: ["Lightroom", "Canva"], price: "฿2,500" },
  { title: "ถ่ายภาพสินค้า OTOP ผ้าทอภาคเหนือ", category: "Photography", owner: "อนุชา", likes: 92, views: 1560, status: "Published", publishedDate: "2026-04-17", tools: ["Lightroom", "Photoshop"], price: "฿7,500" },
  { title: "พรีเวดดิ้งสไตล์มินิมอลเชียงราย", category: "Photography", owner: "ปาริชาต", likes: 134, views: 2340, status: "Published", publishedDate: "2026-04-16", tools: ["Lightroom"], price: "฿15,000" },
  { title: "ตัดต่อ Vlog ท่องเที่ยวภาคใต้", category: "Video", owner: "เจษฎา", likes: 67, views: 980, status: "Published", publishedDate: "2026-04-15", tools: ["Premiere", "After Effects"], price: "฿8,000" },
  { title: "Motion Graphic อธิบายสินค้า", category: "Video", owner: "สุพัตรา", likes: 45, views: 612, status: "Published", publishedDate: "2026-04-14", tools: ["After Effects", "Illustrator"], price: "฿12,500" },
  { title: "Sound Design พอดแคสต์ไทย คุยเรื่องผี", category: "Music/Audio", owner: "วทัญญู", likes: 23, views: 345, status: "Published", publishedDate: "2026-04-13", tools: ["Audition", "Logic Pro"], price: "฿4,000/EP" },
  { title: "เพลงประกอบโฆษณาแบรนด์ไทย", category: "Music/Audio", owner: "กฤษณา", likes: 31, views: 478, status: "Published", publishedDate: "2026-04-12", tools: ["Logic Pro", "Ableton"], price: "฿18,000" },
  { title: "Mascot น้องหมูเด้ง Pop Art", category: "Illustration", owner: "พิมพ์ชนก", likes: 210, views: 4520, status: "Published", publishedDate: "2026-04-11", tools: ["Procreate", "Illustrator"], price: "฿9,000" },
  { title: "เครื่องประดับเงินแฮนด์เมด", category: "Craft", owner: "ศิริพร", likes: 58, views: 745, status: "Published", publishedDate: "2026-04-10", tools: ["Lightroom"], price: "฿2,800/ชิ้น" },
  { title: "โปสเตอร์เทศกาลภาพยนตร์อิสระ", category: "Graphic", owner: "ฉัตรชัย", likes: 73, views: 920, status: "Published", publishedDate: "2026-04-09", tools: ["Photoshop", "Illustrator"], price: "฿5,500" },
  { title: "เว็บไซต์โรงแรม Boutique หัวหิน", category: "Web/UI", owner: "อาทิตยา", likes: 22, views: 289, status: "Published", publishedDate: "2026-04-08", tools: ["Figma", "Webflow"], price: "฿35,000" },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "Tesa+ Brand Identity",
    image: project1,
    gallery: gal(0),
    category: "Graphic",
    owner: "You",
    ownerAvatar: "",
    likes: 12,
    views: 158,
    comments: 3,
    bookmarked: false,
    status: "Published",
    publishedDate: "2026-04-28",
    tools: ["Illustrator", "Figma"],
    price: "฿8,500",
  },
  {
    id: "2",
    title: "เทสสี้ Packaging",
    image: project2,
    gallery: gal(1),
    category: "Craft",
    owner: "You",
    ownerAvatar: "",
    likes: 18,
    views: 240,
    comments: 5,
    bookmarked: false,
    status: "Published",
    publishedDate: "2026-04-27",
    tools: ["Illustrator", "Photoshop"],
    price: "฿6,200",
  },
  {
    id: "3",
    title: "FinTech App Design",
    image: project3,
    gallery: gal(2),
    category: "Web/UI",
    owner: "You",
    ownerAvatar: "",
    likes: 4,
    views: 89,
    comments: 1,
    bookmarked: false,
    status: "Draft",
    publishedDate: "2026-04-30",
    tools: ["Figma", "Notion"],
    price: "฿24,000",
  },
  ...raw.map((p, i) => ({
    ...p,
    id: `p-${i + 10}`,
    image: pic(i + 1),
    gallery: gal(i + 1),
    ownerAvatar: "",
    comments: Math.floor(p.likes / 5),
    bookmarked: false,
  })),
];

export const hiringRequests: HiringRequest[] = [
  {
    id: "1",
    clientName: "คุณปิยะ มีสุข",
    clientAvatar: "",
    status: "ติดต่อแล้ว",
    referenceProject: "Tesa+ Brand Identity",
    message: "สนใจจ้างทำโลโก้ + นามบัตรร้านกาแฟครับ",
    email: "piya.m@gmail.com",
    date: "3 วันก่อน",
  },
  {
    id: "2",
    clientName: "คุณสมชาย ดีมาก",
    clientAvatar: "",
    status: "ที่ต้องตอบ",
    referenceProject: "FinTech App Design",
    message: "ต้องการออกแบบ Dashboard ระบบ CRM ของบริษัท",
    email: "somchai@example.com",
    date: "1 วันก่อน",
  },
];
