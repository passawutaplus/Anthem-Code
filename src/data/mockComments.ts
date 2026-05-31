import type { CommentWithProfile } from "@/hooks/useProjectComments";
import { mockDesigners } from "./mockDesigners";

const samples = [
  "ลายเส้นคุณเป็นเอกลักษณ์มาก ขอติดตามนะครับ",
  "ใช้โทนสีลงตัวสุดๆ บอกแหล่ง inspiration ได้ไหมครับ?",
  "สวยมาก! รออ่านเบื้องหลังต่อเลย",
  "อยากจ้างทำงานสไตล์นี้ ไว้ทักหลังไมค์",
  "ไอเดียดี ตัวอักษรอ่านง่ายมาก",
  "คอนเซปต์เจ๋ง รูปแบบใหม่กว่าที่เคยเห็น",
  "ขอเซฟไว้เป็น reference ครับ",
  "งานนี้ควรได้ขึ้น Top 1",
  "เห็นแล้วยิ้มเลย น่ารักมาก",
  "ทำเป็นซีรีส์ต่อได้นะ น่าจะปังกว่านี้",
  "Layout ลงตัว spacing เป๊ะ",
  "เลือกฟอนต์เก่งมาก เข้ากับงาน",
  "อยากเห็น mockup ใช้จริงจัง",
  "บรรยากาศภาพดูอบอุ่นมาก",
  "เห็นแล้วอยากลองทำตามบ้าง",
];

export const mockCommentsFor = (projectId: string, count = 10): CommentWithProfile[] => {
  const n = Math.min(count, 15);
  return Array.from({ length: n }).map((_, i) => {
    const d = mockDesigners[(i + projectId.length) % mockDesigners.length];
    return {
      id: `mock-cm-${projectId}-${i}`,
      project_id: projectId,
      user_id: (d.profile as any).id,
      content: samples[(i + projectId.length) % samples.length],
      created_at: new Date(Date.now() - i * 1000 * 60 * 60 * (1 + i)).toISOString(),
      profile: {
        display_name: (d.profile as any).display_name,
        avatar_url: (d.profile as any).avatar_url,
        username: (d.profile as any).username,
      },
    };
  });
};
