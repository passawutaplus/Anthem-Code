import type { ComponentType } from 'react'
import { hireRequestTemplate } from './hire-request'
import { chatMessageTemplate } from './chat-message'
import { jobMatchTemplate } from './job-match'
import { collabRequestTemplate } from './collab-request'

export interface NotificationTemplateEntry {
  component: ComponentType<Record<string, unknown>>
  subject: string | ((data: Record<string, unknown>) => string)
  displayName?: string
  previewData?: Record<string, unknown>
}

export const NOTIFICATION_TEMPLATES: Record<string, NotificationTemplateEntry> = {
  'hire-request': hireRequestTemplate,
  'chat-message': chatMessageTemplate,
  'job-match': jobMatchTemplate,
  'collab-request': collabRequestTemplate,
}

export const ANTHEM_NOTIFICATION_SUBJECTS = Object.fromEntries(
  Object.entries(NOTIFICATION_TEMPLATES).map(([key, entry]) => {
    const sample = entry.previewData ?? {}
    const subject =
      typeof entry.subject === 'function' ? entry.subject(sample) : entry.subject
    return [key, subject]
  }),
) as Record<string, string>
