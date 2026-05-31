import { Link } from "react-router-dom";
import LegalLayout from "@/components/LegalLayout";
import { Button } from "@/components/ui/button";
import { requestOpenCookiePreferences } from "@/lib/cookieConsent";
import {
  LEGAL_APP_NAME,
  LEGAL_DPO_EMAIL,
  LEGAL_SUPPORT_EMAIL,
} from "@/lib/legalConfig";
import { useAuth } from "@/hooks/useAuth";

const mailto = (subject: string, body: string) =>
  `mailto:${LEGAL_DPO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const DataRightsPage = () => {
  const { user } = useAuth();
  const uid = user?.id ?? "";
  const email = user?.email ?? "";

  const templates = {
    access: mailto(
      `[${LEGAL_APP_NAME}] ขอเข้าถึงข้อมูลส่วนบุคคล`,
      `เรียน เจ้าหน้าที่คุ้มครองข้อมูล\n\nข้าพเจ้าขอใช้สิทธิเข้าถึงข้อมูลส่วนบุคคลตาม PDPA\n\nUser ID: ${uid}\nอีเมลบัญชี: ${email}\n\nขอบคุณ`,
    ),
    delete: mailto(
      `[${LEGAL_APP_NAME}] ขอลบบัญชีและข้อมูล`,
      `เรียน เจ้าหน้าที่คุ้มครองข้อมูล\n\nข้าพเจ้าขอลบบัญชีและข้อมูลส่วนบุคคลที่เกี่ยวข้อง\n\nUser ID: ${uid}\nอีเมลบัญชี: ${email}\n\nขอบคุณ`,
    ),
    withdraw: mailto(
      `[${LEGAL_APP_NAME}] ถอนความยินยอม`,
      `เรียน เจ้าหน้าที่คุ้มครองข้อมูล\n\nข้าพเจ้าขอถอนความยินยอมในเรื่อง: (ระบุ เช่น การแจ้งเตือนทางอีเมล)\n\nUser ID: ${uid}\nอีเมล: ${email}\n\nขอบคุณ`,
    ),
  };

  return (
    <LegalLayout title="สิทธิของเจ้าของข้อมูล (PDPA)">
      <p>
        ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล คุณมีสิทธิเกี่ยวกับข้อมูลของตนเองบน {LEGAL_APP_NAME}
        หน้านี้สรุปวิธีใช้สิทธิและช่องทางติดต่อ
      </p>

      <h2>1. สิทธิที่คุณมี</h2>
      <ul>
        <li>ขอทราบว่ามีการเก็บข้อมูลใดของคุณบ้าง</li>
        <li>ขอสำเนาข้อมูลในรูปแบบที่อ่านได้</li>
        <li>ขอแก้ไขข้อมูลให้ถูกต้อง — ทำได้ที่ <Link to="/settings">ตั้งค่าบัญชี</Link></li>
        <li>ขอลบหรือทำลายข้อมูลเมื่อไม่จำเป็นต้องเก็บต่อ</li>
        <li>ขอระงับการใช้ข้อมูลชั่วคราว</li>
        <li>ถอนความยินยอม (เช่น คุกกี้ที่ไม่จำเป็น การแจ้งเตือน)</li>
        <li>ร้องเรียนต่อ สคส. (<a href="https://www.pdpc.or.th" target="_blank" rel="noopener noreferrer">pdpc.or.th</a>)</li>
      </ul>

      <h2>2. ดำเนินการด้วยตนเอง (ทันที)</h2>
      <ul>
        <li>
          <strong>แก้ไขโปรไฟล์</strong> — <Link to="/settings">ตั้งค่า → โปรไฟล์</Link>
        </li>
        <li>
          <strong>การแจ้งเตือน</strong> — ปิด/เปิดใน ตั้งค่า → การแจ้งเตือน
        </li>
        <li>
          <strong>คุกกี้</strong> — ปุ่มด้านล่าง
        </li>
      </ul>
      <div className="not-prose my-3">
        <Button type="button" size="sm" variant="outline" onClick={() => requestOpenCookiePreferences()}>
          จัดการความยินยอมคุกกี้
        </Button>
      </div>

      <h2>3. ส่งคำขอถึง DPO</h2>
      <p>
        สำหรับการเข้าถึงข้อมูล การลบบัญชี หรือถอนความยินยอมที่ต้องตรวจสอบโดยเจ้าหน้าที่
        กรุณาอีเมล <a href={`mailto:${LEGAL_DPO_EMAIL}`}>{LEGAL_DPO_EMAIL}</a>
        {user ? " (เทมเพลตด้านล่างจะใส่ User ID ให้อัตโนมัติ)" : " — กรุณาเข้าสู่ระบบก่อนเพื่อให้ระบุตัวตนได้ง่าย"}
      </p>

      <div className="not-prose flex flex-col sm:flex-row flex-wrap gap-2 my-4">
        <Button type="button" variant="secondary" size="sm" asChild>
          <a href={templates.access}>ขอเข้าถึง / สำเนาข้อมูล</a>
        </Button>
        <Button type="button" variant="secondary" size="sm" asChild>
          <a href={templates.delete}>ขอลบบัญชี</a>
        </Button>
        <Button type="button" variant="secondary" size="sm" asChild>
          <a href={templates.withdraw}>ถอนความยินยอม</a>
        </Button>
      </div>

      <h2>4. ระยะเวลาตอบกลับ</h2>
      <p>เราจะดำเนินการภายใน 30 วันนับจากได้รับคำขอที่ครบถ้วน หากซับซ้อนอาจขยายตามที่ PDPA อนุญาต พร้อมแจ้งเหตุผล</p>

      <h2>5. การยืนยันตัวตน</h2>
      <p>
        เพื่อความปลอดภัย เราอาจขอให้ยืนยันตัวตนจากอีเมลที่ลงทะเบียนก่อนดำเนินการลบหรือส่งข้อมูลออก
      </p>

      <h2>6. เอกสารที่เกี่ยวข้อง</h2>
      <ul>
        <li><Link to="/legal/privacy">นโยบายความเป็นส่วนตัว</Link></li>
        <li><Link to="/legal/cookies">นโยบายคุกกี้</Link></li>
        <li><Link to="/legal/terms">ข้อกำหนดการใช้งาน</Link></li>
      </ul>

      <h2>7. ติดต่อทั่วไป</h2>
      <p>
        คำถามอื่น: <a href={`mailto:${LEGAL_SUPPORT_EMAIL}`}>{LEGAL_SUPPORT_EMAIL}</a>
      </p>
    </LegalLayout>
  );
};

export default DataRightsPage;
