import type { ActivityNotif, HireNotif, CollabNotif } from "@/hooks/useNotifications";
import { projects as mockProjects } from "./mockData";
import { mockDesigners } from "./mockDesigners";

const actor = (i: number) => {
  const d = mockDesigners[i % mockDesigners.length];
  return {
    id: (d.profile as any).id as string,
    name: (d.profile as any).display_name as string,
    avatar: (d.profile as any).avatar_url ?? "",
  };
};

const kinds: ActivityNotif["kind"][] = ["like", "bookmark", "comment"];
const sampleComments = [
  "งานนี้สวยมากครับ ขอติดตามผลงานต่อไปนะครับ",
  "ลายเส้นคุณเป็นเอกลักษณ์มากๆ",
  "สีสวยมากเลย จัด layout ลงตัวสุดๆ",
  "อยากเห็น behind-the-scene จังเลย",
  "ขอแชร์ให้เพื่อนดูนะครับ",
  "ไอเดียดีมาก ใช้ฟอนต์อะไรครับ?",
  "งานคุณช่วยให้แบรนด์โดดเด่นมาก",
  "ใช้โทนสีนี้แล้วน่ามองสุดๆ",
];

export const mockActivityNotifs: ActivityNotif[] = Array.from({ length: 26 }).map((_, i) => {
  const project = mockProjects[i % mockProjects.length];
  const a = actor(i);
  const kind = kinds[i % kinds.length];
  return {
    id: `mock-notif-${i}`,
    kind,
    createdAt: new Date(Date.now() - i * 1000 * 60 * (5 + i * 3)).toISOString(),
    actorId: a.id,
    actorName: a.name,
    actorAvatar: a.avatar,
    projectId: project.id,
    projectTitle: project.title,
    projectCover: project.image,
    content: kind === "comment" ? sampleComments[i % sampleComments.length] : undefined,
  };
});

export const mockHireNotifs: HireNotif[] = Array.from({ length: 12 }).map((_, i) => {
  const a = actor(i + 4);
  const project = mockProjects[(i * 2) % mockProjects.length];
  const statuses = ["ใหม่", "ที่ต้องตอบ", "ติดต่อแล้ว", "ตอบรับ"];
  return {
    id: `mock-hire-notif-${i}`,
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * (4 + i)).toISOString(),
    clientName: a.name,
    email: `${a.name.replace(/\s/g, "").toLowerCase()}@example.com`,
    projectTitle: project.title,
    message: `สนใจจ้างทำงานสไตล์เดียวกับ "${project.title}" ครับ พอจะคุยรายละเอียดได้ไหม?`,
    status: statuses[i % statuses.length],
    budgetAmount: [8000, 15000, 25000, 45000, 65000][i % 5],
  };
});

const collabTypeSets = [
  ["Co-Design", "Cross-promo"],
  ["Co-Create", "Equity"],
  ["Brand Collab"],
  ["Studio Hire", "Long-term"],
];

export const mockCollabNotifs: CollabNotif[] = Array.from({ length: 14 }).map((_, i) => {
  const a = actor(i + 9);
  const statuses = ["pending", "accepted", "declined"];
  return {
    id: `mock-collab-notif-${i}`,
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 3).toISOString(),
    senderId: a.id,
    senderName: a.name,
    senderAvatar: a.avatar,
    collabTypes: collabTypeSets[i % collabTypeSets.length],
    message: `อยากชวนคุณ collab ทำงานโปรเจกต์เล็กๆ ช่วงเดือนหน้า ดูเวลาให้หน่อยนะครับ`,
    timeline: ["2-3 สัปดาห์", "1 เดือน", "3 เดือน", null][i % 4],
    status: statuses[i % statuses.length],
  };
});
