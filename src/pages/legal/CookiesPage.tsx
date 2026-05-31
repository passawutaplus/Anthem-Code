import LegalLayout from "@/components/LegalLayout";
import CookieTable from "@/components/legal/CookieTable";
import { Button } from "@/components/ui/button";
import { requestOpenCookiePreferences } from "@/lib/cookieConsent";
import { LEGAL_APP_NAME } from "@/lib/legalConfig";

const CookiesPage = () => (
  <LegalLayout title="นโยบายคุกกี้">
    <p>
      {LEGAL_APP_NAME} ใช้คุกกี้และเทคโนโลยีที่คล้ายกัน (เช่น localStorage และ sessionStorage)
      เพื่อให้บริการทำงานได้ จดจำการตั้งค่า และทำความเข้าใจการใช้งานแบบรวม
      นโยบายนี้อธิบายประเภท วัตถุประสงค์ และวิธีจัดการความยินยอมของคุณ
    </p>

    <div className="not-prose my-4">
      <Button type="button" size="sm" onClick={() => requestOpenCookiePreferences()}>
        เปิดการตั้งค่าคุกกี้
      </Button>
    </div>

    <h2>1. คุกกี้คืออะไร</h2>
    <p>
      คุกกี้เป็นไฟล์ข้อความขนาดเล็กที่เว็บไซต์เก็บบนอุปกรณ์ของคุณ
      localStorage/sessionStorage ทำหน้าที่คล้ายกันสำหรับการตั้งค่าในเบราว์เซอร์
    </p>

    <h2>2. ประเภทที่เราใช้</h2>
    <ul>
      <li><strong>จำเป็น</strong> — ไม่สามารถปิดได้ เพราะจำเป็นต่อการเข้าสู่ระบบและความปลอดภัย</li>
      <li><strong>เชิงฟังก์ชัน</strong> — จดจำธีม มุมมองฟีด และการตั้งค่าที่คุณเลือก</li>
      <li><strong>วิเคราะห์</strong> — สถิติการเข้าชมผลงานต่อเซสชัน เพื่อปรับปรุงฟีด (ไม่ใช่การตลาดข้ามเว็บ)</li>
    </ul>

    <h2>3. รายการคุกกี้และที่เก็บข้อมูล</h2>
    <CookieTable />

    <h2>4. คุกกี้ของบุคคลที่สาม</h2>
    <ul>
      <li><strong>Supabase Auth</strong> — จัดการเซสชันการเข้าสู่ระบบ</li>
      <li><strong>Google</strong> — เมื่อคุณเลือก &quot;เข้าสู่ระบบด้วย Google&quot; (เป็นไปตามนโยบายของ Google)</li>
    </ul>
    <p>เราไม่ใช้ป้ายโฆษณาติดตามข้ามเว็บ (third-party ad tracking) ในปัจจุบัน</p>

    <h2>5. การจัดการความยินยอม</h2>
    <ul>
      <li>แบนเนอร์เมื่อเข้าเว็บครั้งแรก — เลือก &quot;ยอมรับทั้งหมด&quot; &quot;จำเป็นเท่านั้น&quot; หรือ &quot;ปรับแต่ง&quot;</li>
      <li>หน้านี้ — ปุ่ม &quot;เปิดการตั้งค่าคุกกี้&quot; ด้านบน</li>
      <li>ตั้งค่าบัญชี → ความเป็นส่วนตัวและข้อมูล</li>
      <li>การตั้งค่าเบราว์เซอร์ — ลบหรือบล็อกคุกกี้ (อาจกระทบการเข้าสู่ระบบ)</li>
    </ul>

    <h2>6. ผลเมื่อถอนความยินยอม</h2>
    <p>
      หากปฏิเสธคุกกี้เชิงฟังก์ชันหรือวิเคราะห์ เราจะลบค่าที่เกี่ยวข้องในอุปกรณ์ (เช่น สถิติการเข้าชมต่อเซสชัน)
      การตั้งค่าธีมอาจรีเซ็ต บริการหลักยังใช้งานได้หากยอมรับคุกกี้ที่จำเป็น
    </p>

    <h2>7. อัปเดตนโยบาย</h2>
    <p>
      เมื่อมีการเปลี่ยนแปลงสำคัญ เราอาจขอความยินยอมใหม่ผ่านแบนเนอร์
      ดูความเชื่อมโยงกับ <a href="/legal/privacy">นโยบายความเป็นส่วนตัว (PDPA)</a>
    </p>
  </LegalLayout>
);

export default CookiesPage;
