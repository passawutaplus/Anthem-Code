-- ลบข้อมูล demo ก่อนเปิด production (รันทีละบล็อก ตรวจ FK)
-- ผู้ใช้: email LIKE '%@demo.an1hem.app'

DELETE FROM public.ad_events WHERE ad_id IN (
  SELECT id FROM public.ad_campaigns WHERE advertiser_id::text LIKE '00000000-0000-0000-0000-00000000a0%'
);
DELETE FROM public.ad_campaigns WHERE advertiser_id::text LIKE '00000000-0000-0000-0000-00000000a0%';
DELETE FROM public.project_likes WHERE project_id::text LIKE '00000000-0000-0000-0002-%';
DELETE FROM public.follows WHERE follower_id::text LIKE '00000000-0000-0000-0000-00000000a0%'
   OR following_id::text LIKE '00000000-0000-0000-0000-00000000a0%';
DELETE FROM public.projects WHERE id::text LIKE '00000000-0000-0000-0002-%';
DELETE FROM public.job_posts WHERE id::text LIKE '00000000-0000-0000-0003-%';
DELETE FROM public.studio_members WHERE studio_id::text LIKE '00000000-0000-0000-0001-%';
DELETE FROM public.studios WHERE id::text LIKE '00000000-0000-0000-0001-%';
DELETE FROM public.profiles WHERE id::text LIKE '00000000-0000-0000-0000-00000000a0%';

-- ลบ auth.users ผ่าน Dashboard → Authentication หรือ Admin API
