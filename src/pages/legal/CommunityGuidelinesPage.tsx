import LegalLayout from "@/components/LegalLayout";
import { LEGAL_APP_NAME, LEGAL_SUPPORT_EMAIL, LEGAL_UPDATED_AT } from "@/lib/legalConfig";

const CommunityGuidelinesPage = () => (
  <LegalLayout title="กฎชุมชนและการดูแลความปลอดภัย">
    <p className="text-muted-foreground text-sm">อัปเดตล่าสุด: {LEGAL_UPDATED_AT}</p>

    <p>
      {LEGAL_APP_NAME} เป็นชุมชนครีเอทีฟ — เราอยากให้ทุกคนพูดคุย แชร์ไอเดีย และช่วยเหลือกันได้อย่างสุภาพ
      เอกสารนี้อธิบายพฤติกรรมที่ไม่เหมาะสม ระบบกรองคำหยาบ และโทษแบนชั่วคราว
    </p>

    <h2>1. พฤติกรรมที่ไม่เหมาะสม</h2>
    <ul>
      <li>คำหยาบ ดูหมิ่น หรือคุกคาม</li>
      <li>Spam หรือโฆษณาที่ไม่เกี่ยวข้อง</li>
      <li>เนื้อหา NSFW หรือรุนแรง</li>
      <li>การหลอกลวง แอบอ้าง หรือละเมิดลิขสิทธิ์</li>
    </ul>
    <p>
      หากพบเนื้อหาที่ละเมิด ให้ใช้ปุ่ม <strong>รายงาน</strong> บนผลงาน โปรไฟล์ คอมเมนต์ แชท หรืองาน
      แล้วติดตามสถานะได้ที่ <a href="/me/reports">รายงานของฉัน</a>
    </p>

    <h2>2. ระบบกรองคำหยาบอัตโนมัติ</h2>
    <ul>
      <li>เมื่อระบบตรวจพบคำหยาบ จะแสดงเตือน <strong>「ไม่ควรใช้คำหยาบ」</strong></li>
      <li>ใน <strong>แชท</strong> คำหยาบจะถูกแทนด้วย <code>***</code> ก่อนส่ง</li>
      <li>ใน <strong>คอมเมนต์</strong> และ <strong>โพสต์ชุมชน</strong> ระบบจะ mask แล้วบันทึก และนับ strike</li>
      <li>ใน <strong>FAQ โปรไฟล์</strong> ระบบจะไม่อนุญาตให้บันทึกถ้ามีคำหยาบ</li>
    </ul>

    <h2>3. โทษแบนจากคำหยาบ (Strike ladder)</h2>
    <table className="w-full text-sm border-collapse my-4">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left py-2 pr-4">ครั้งที่</th>
          <th className="text-left py-2">ผล</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border/60"><td className="py-2 pr-4">1–2</td><td className="py-2">เตือน (ยังโพสต์ได้)</td></tr>
        <tr className="border-b border-border/60"><td className="py-2 pr-4">3</td><td className="py-2">จำกัดการโพสต์ 3 วัน</td></tr>
        <tr className="border-b border-border/60"><td className="py-2 pr-4">4–5</td><td className="py-2">จำกัดการโพสต์ 7 วัน</td></tr>
        <tr><td className="py-2 pr-4">6+</td><td className="py-2">จำกัดการโพสต์ 30 วัน</td></tr>
      </tbody>
    </table>
    <p>
      Strike จะรีเซ็ตหลังไม่มีเหตุการณ์ใหม่ครบ 90 วัน
      ระหว่างถูกจำกัด คุณยังเข้าชมและอ่านเนื้อหาได้ แต่ไม่สามารถคอมเมนต์ แชท หรือโพสต์ชุมชนได้
    </p>

    <h2>4. การแบนจากรายงาน (Report)</h2>
    <p>
      ทีมดูแลจะตรวจรายงานจากผู้ใช้ หากพบว่ามีการละเมิดจริง อาจ:
    </p>
    <ul>
      <li>เพิ่ม strike</li>
      <li>จำกัดการโพสต์ชั่วคราว (mute / ban)</li>
      <li>ซ่อนหรือลบเนื้อหา</li>
    </ul>
    <p>โทษจากรายงานแยกจาก strike คำหยาบอัตโนมัติ — ทีมดูแลเลือกความรุนแรงตามแต่ละกรณี</p>

    <h2>5. อุทธรณ์และติดต่อ</h2>
    <p>
      หากคิดว่าถูกแบนโดยไม่เป็นธรรม ติดต่อ{" "}
      <a href={`mailto:${LEGAL_SUPPORT_EMAIL}`}>{LEGAL_SUPPORT_EMAIL}</a> พร้อม username และรายละเอียด
    </p>
    <p>
      อ่านเพิ่ม: <a href="/legal/terms">ข้อกำหนดการใช้งาน</a> ·{" "}
      <a href="/legal/privacy">นโยบายความเป็นส่วนตัว</a>
    </p>
  </LegalLayout>
);

export default CommunityGuidelinesPage;
