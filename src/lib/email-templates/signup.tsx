import * as React from 'react'
import { Link } from '@react-email/components'
import { EmailLayout, EmailButton, EmailText, link } from './layout'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({ siteName, siteUrl, recipient, confirmationUrl }: SignupEmailProps) => (
  <EmailLayout
    preview={`ยืนยันอีเมลของคุณกับ ${siteName}`}
    badge="ยืนยันอีเมล"
    icon="mail"
    title="ยินดีต้อนรับสู่ชุมชนครีเอทีฟ"
    footerNote="ถ้าคุณไม่ได้สมัครบัญชี ไม่ต้องทำอะไร — อีเมลนี้จะหมดอายุภายในไม่กี่ชั่วโมง"
  >
    <EmailText>
      ขอบคุณที่สมัครใช้งาน <Link href={siteUrl} style={link}>{siteName}</Link>{' '}
      กดปุ่มด้านล่างเพื่อยืนยันอีเมล <strong>{recipient}</strong> แล้วเริ่มลงผลงานได้เลย
    </EmailText>
    <EmailButton href={confirmationUrl}>ยืนยันอีเมลของฉัน</EmailButton>
  </EmailLayout>
)

export default SignupEmail
