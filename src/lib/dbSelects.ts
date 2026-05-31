/** Shared Supabase column lists — avoids select("*") and heavy columns (e.g. embedding). */

export const PROJECT_FEED_SELECT =
  "id, title, cover_url, gallery_urls, category, owner_id, likes, views, status, created_at, tools, tags, allow_hire, allow_collab";

export const PROJECT_DETAIL_SELECT =
  `${PROJECT_FEED_SELECT}, description, price_thb, subtitle, studio_id, credited_user_ids, updated_at`;

export const PROJECT_MANAGE_SELECT = PROJECT_DETAIL_SELECT;

/** Public profile card — no email/phone/risk/internal fields. */
export const PUBLIC_PROFILE_SELECT =
  "id, display_name, username, avatar_url, bio, role, skills, website, instagram, facebook, line_id, cover_url, is_verified, location";

/** Designer directory list. */
export const PROFILE_DESIGNER_SELECT =
  "id, display_name, username, avatar_url, bio, role, skills, updated_at";
