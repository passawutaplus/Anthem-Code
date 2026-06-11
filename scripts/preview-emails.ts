/**
 * Renders 1PX auth email templates to email-previews/.
 * Run: npx tsx scripts/preview-emails.ts
 */
import * as React from 'react'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { render } from '@react-email/components'
import { SignupEmail } from '../src/lib/email-templates/signup.tsx'
import { InviteEmail } from '../src/lib/email-templates/invite.tsx'
import { MagicLinkEmail } from '../src/lib/email-templates/magic-link.tsx'
import { RecoveryEmail } from '../src/lib/email-templates/recovery.tsx'
import { EmailChangeEmail } from '../src/lib/email-templates/email-change.tsx'
import { ReauthenticationEmail } from '../src/lib/email-templates/reauthentication.tsx'
import { SITE_NAME, SITE_URL } from '../src/lib/email-templates/brandMeta.ts'

const OUT = join(import.meta.dirname ?? '.', '..', 'email-previews')

const AUTH_TEMPLATES: Record<string, { component: React.ComponentType<any>; data: Record<string, unknown> }> = {
  signup: {
    component: SignupEmail,
    data: {
      siteName: SITE_NAME,
      siteUrl: SITE_URL,
      recipient: 'user@example.test',
      confirmationUrl: `${SITE_URL}/auth/callback`,
    },
  },
  invite: {
    component: InviteEmail,
    data: { siteName: SITE_NAME, siteUrl: SITE_URL, confirmationUrl: `${SITE_URL}/auth/callback` },
  },
  magiclink: {
    component: MagicLinkEmail,
    data: { siteName: SITE_NAME, confirmationUrl: `${SITE_URL}/auth/callback` },
  },
  recovery: {
    component: RecoveryEmail,
    data: { siteName: SITE_NAME, confirmationUrl: `${SITE_URL}/auth/callback` },
  },
  email_change: {
    component: EmailChangeEmail,
    data: {
      siteName: SITE_NAME,
      oldEmail: 'old@example.test',
      email: 'old@example.test',
      newEmail: 'new@example.test',
      confirmationUrl: `${SITE_URL}/auth/callback`,
    },
  },
  reauthentication: {
    component: ReauthenticationEmail,
    data: { token: '482910' },
  },
}

mkdirSync(OUT, { recursive: true })

const links: string[] = []

for (const [name, { component: Component, data }] of Object.entries(AUTH_TEMPLATES)) {
  const html = await render(React.createElement(Component, data))
  const file = `auth-${name}.html`
  writeFileSync(join(OUT, file), html)
  links.push(`<li><a href="${file}">${name}</a></li>`)
  console.log(`✓ ${name}`)
}

const index = `<!DOCTYPE html>
<html lang="th"><head><meta charset="utf-8"/><title>1PX Email Previews</title>
<style>body{font-family:system-ui,sans-serif;max-width:640px;margin:2rem auto;padding:0 1rem}
h1{font-size:1.25rem}ul{line-height:2}</style></head>
<body><h1>1PX Email Previews</h1><ul>${links.join('')}</ul></body></html>`
writeFileSync(join(OUT, 'index.html'), index)
console.log(`\n→ ${join(OUT, 'index.html')}`)
