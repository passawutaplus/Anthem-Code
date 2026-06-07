import LegalLayout from "@/components/LegalLayout";
import { LICENSE_LIST } from "@/lib/licenses";
import { LEGAL_APP_NAME, LEGAL_SUPPORT_EMAIL } from "@/lib/legalConfig";

const IntellectualPropertyPage = () => (
  <LegalLayout title="ลิขสิทธิ์และการใช้งานผลงาน">
    <p>
      หน้านี้อธิบายเรื่องลิขสิทธิ์แบบเข้าใจง่ายสำหรับครีเอเตอร์และผู้ชมบน <strong>{LEGAL_APP_NAME}</strong>
      ไม่ใช่คำปรึกษาทางกฎหมาย — ถ้ามีข้อพิพาทร้ายแรงควรปรึกษาทนายความ
    </p>

    <h2>1. ลิขสิทธิ์คืออะไร?</h2>
    <p>
      งานสร้างสรรค์ เช่น ภาพ กราฟิก วิดีโอ เพลง หรือ UI ได้รับความคุ้มครองโดยอัตโนมัติเมื่อสร้างเสร็จ
      คุณไม่จำเป็นต้องลงทะเบียนก่อนถึงจะมีสิทธิ์ — แต่ต้องเป็นผู้สร้างจริง หรือได้รับอนุญาตจากเจ้าของ
    </p>

    <h2>2. ตอนลงผลงานต้องทำอะไร?</h2>
    <ul>
      <li>เลือก <strong>สิทธิ์การใช้งาน</strong> ว่าคนอื่นเอาไปใช้ได้แค่ไหน</li>
      <li>ถ้ามีฟอนต์ ภาพ stock เสียง หรือ asset จากที่อื่น — เปิดแจ้งและระบุแหล่งที่มา</li>
      <li>ติ๊กยืนยันว่าคุณมีสิทธิ์เผยแพร่ก่อนกด <strong>เผยแพร่</strong></li>
    </ul>

    <h2>3. ความหมายแต่ละแบบสิทธิ์</h2>
    <div className="not-prose space-y-3 my-4">
      {LICENSE_LIST.filter((p) => p.id !== "custom").map((preset) => {
        const Icon = preset.icon;
        return (
          <div key={preset.id} className="rounded-xl border border-border/60 p-4 space-y-1">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Icon className="w-4 h-4 text-primary" />
              {preset.shortLabel}
            </div>
            <p className="text-sm text-muted-foreground">{preset.description}</p>
            <p className="text-xs text-muted-foreground">{preset.detailParagraph}</p>
          </div>
        );
      })}
      <div className="rounded-xl border border-border/60 p-4 space-y-1">
        <p className="font-medium text-foreground">กำหนดเอง</p>
        <p className="text-sm text-muted-foreground">
          คุณพิมพ์เงื่อนไขเองได้สูงสุด 500 ตัวอักษร — เหมาะกับงานที่มีข้อตกลงเฉพาะ
        </p>
      </div>
    </div>

    <h2>4. ถ้าใช้ asset จากคนอื่น</h2>
    <ul>
      <li>ฟอนต์ — ตรวจสอบ license (เช่น Google Fonts, Adobe Fonts)</li>
      <li>ภาพ/วิดีโอ stock — ต้องมีสิทธิ์ตามที่ซื้อหรือดาวน์โหลด</li>
      <li>AI reference — ระบุว่าใช้ reference อะไร และมีสิทธิ์ใช้หรือไม่</li>
      <li>งานลูกค้า — ต้องได้รับอนุญาตจากลูกค้าก่อนโชว์ในพอร์ต (ถ้าสัญญากำหนด)</li>
    </ul>

    <h2>5. ถ้าเจอการละเมิดลิขสิทธิ์</h2>
    <ul>
      <li>กดปุ่ม <strong>รายงาน</strong> บนผลงาน แล้วเลือกเหตุผล &quot;ละเมิดลิขสิทธิ์&quot;</li>
      <li>แนบหลักฐานถ้ามี (ลิงก์ต้นฉบับ, ใบอนุญาต ฯลฯ)</li>
      <li>อีเมลทีมงาน: <a href={`mailto:${LEGAL_SUPPORT_EMAIL}`}>{LEGAL_SUPPORT_EMAIL}</a></li>
    </ul>

    <h2>6. ข้อจำกัดความรับผิดชอบ</h2>
    <p>
      {LEGAL_APP_NAME} เป็นช่องทางแสดงผลและเชื่อมต่อครีเอเตอร์กับผู้ชม
      เราไม่ได้ตรวจสอบลิขสิทธิ์ทุกผลงานโดยอัตโนมัติ — ครีเอเตอร์รับผิดชอบข้อมูลที่ระบุ
      ฟีเจอร์ร่างสัญญา AI เป็นเครื่องมือช่วยร่างเท่านั้น ไม่ใช่คำปรึกษาทางกฎหมาย
    </p>

    <p className="text-sm text-muted-foreground">
      ดูเพิ่มใน <a href="/legal/terms">ข้อกำหนดการใช้งาน</a> หมวดทรัพย์สินทางปัญญา
    </p>
  </LegalLayout>
);

export default IntellectualPropertyPage;
