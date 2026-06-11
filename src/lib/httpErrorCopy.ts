export type HttpErrorKind = '404' | '405' | '500' | '503' | 'generic' | 'token'

export type HttpErrorCopy = {
  code: number
  titleTh: string
  titleEn: string
  descTh: string
  descEn: string
  taglineTh: string
  taglineEn: string
  hintTh?: string
  hintEn?: string
}

export const HTTP_ERROR_COPY: Record<HttpErrorKind, HttpErrorCopy> = {
  '404': {
    code: 404,
    titleTh: 'อุ๊ปส์ หาไม่เจอหน้านี้',
    titleEn: "Oops — we can't find this page",
    descTh: 'ลิงก์อาจพิมพ์ผิด หน้าถูกย้าย หรืออาจถูกลบไปแล้ว ลองกลับไปหน้าแรก หรือเช็ก URL อีกที',
    descEn: 'The link might be wrong, the page may have moved, or it could have been removed.',
    taglineTh: 'หน้านี้ไม่มีอยู่จริง — ไม่เป็นไร กลับไปทางอื่นได้',
    taglineEn: "This page isn't here — no worries, you can go another way",
    hintTh: 'ถ้ามั่นใจว่าหน้านี้ควรมีอยู่ แจ้งเราได้ที่ support@1px.app',
    hintEn: 'If you think this page should exist, contact us at support@1px.app',
  },
  '405': {
    code: 405,
    titleTh: 'วิธีการนี้ไม่รองรับ',
    titleEn: 'Method not allowed',
    descTh: 'คำขอที่ส่งมาใช้วิธีที่ระบบไม่รองรับ ลองกลับไปหน้าก่อนหน้าแล้วทำรายการใหม่',
    descEn: 'This request used a method the server does not allow.',
    taglineTh: 'ลองกลับไปแล้วทำใหม่อีกครั้ง',
    taglineEn: 'Go back and try the action again',
    hintTh: 'ถ้ายังเจอปัญหา ติดต่อ support@1px.app',
    hintEn: 'If it keeps happening, contact support@1px.app',
  },
  '500': {
    code: 500,
    titleTh: 'ขอโทษด้วย มีบางอย่างขัดข้อง',
    titleEn: 'Sorry — something went wrong on our end',
    descTh:
      'ระบบเจอปัญหาที่เราไม่ได้คาดไว้ ลองรีเฟรชหรือกลับมาใหม่อีกสักครู่ ถ้ายังไม่หาย แจ้งทีมงานได้เลย',
    descEn: 'We hit an unexpected issue. Try refreshing or coming back in a moment.',
    taglineTh: 'ฝั่งเรามีปัญหา — กำลังรีบแก้อยู่',
    taglineEn: "Something broke on our side — we're on it",
    hintTh: 'ติดต่อ support@1px.app ถ้าปัญหายังไม่หาย',
    hintEn: 'Contact support@1px.app if the issue persists.',
  },
  '503': {
    code: 503,
    titleTh: 'พักแป๊บนะ กำลังปรับปรุงระบบอยู่',
    titleEn: "Hang tight — we're updating things",
    descTh: 'เรากำลังอัปเดตเพื่อให้ 1PX ทำงานได้ลื่นขึ้น ไม่นานหรอก กลับมาใหม่ในอีกสักครู่',
    descEn: "We're making updates so 1PX runs smoother for you.",
    taglineTh: 'ปรับปรุงระบบชั่วคราว — รอแป๊บเดียว',
    taglineEn: 'Temporarily down for maintenance — just a moment',
    hintTh: 'ขอบคุณที่รอ — เราจะรีบให้กลับมาใช้งานได้เร็วที่สุด',
    hintEn: "Thanks for your patience — we'll be back up as soon as possible.",
  },
  generic: {
    code: 0,
    titleTh: 'โหลดหน้านี้ไม่สำเร็จ',
    titleEn: "This page didn't load",
    descTh: 'อาจเป็นเพราะเน็ตชั่วคราว หรือข้อมูลยังโหลดไม่ครบ ลองกดลองใหม่อีกครั้ง',
    descEn: "It could be a spotty connection or data that didn't finish loading.",
    taglineTh: 'ลองอีกครั้ง — มักจะหายเอง',
    taglineEn: 'Try again — it often clears up on its own',
    hintTh: 'ถ้ายังไม่ได้ ติดต่อ support@1px.app',
    hintEn: 'Still stuck? Contact support@1px.app',
  },
  token: {
    code: 404,
    titleTh: 'ลิงก์นี้ใช้ไม่ได้แล้ว',
    titleEn: "This link isn't valid anymore",
    descTh: 'ลิงก์อาจหมดอายุ ถูกปิด หรือพิมพ์ไม่ครบ ถ้าเป็นของคุณ ลองขอลิงก์ใหม่จากผู้ส่งได้เลย',
    descEn: 'The link may have expired, been closed, or the URL might be incomplete.',
    taglineTh: 'ขอลิงก์ใหม่จากผู้ส่งได้เลย',
    taglineEn: 'Ask the sender for a new link if you need one',
    hintTh: 'ถ้ายังมีปัญหา แจ้ง support@1px.app',
    hintEn: 'Still having trouble? We can take a look.',
  },
}

export function resolveErrorKind(code?: number, kind?: HttpErrorKind): HttpErrorKind {
  if (kind) return kind
  if (code === 404) return '404'
  if (code === 405) return '405'
  if (code === 503) return '503'
  if (code && code >= 500) return '500'
  return 'generic'
}
