import BriefcaseIcon from "../components/icons/BriefcaseIcon";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Link2, Camera, Save, Bell, MessageCircle, Sparkles, MapPin, Moon, Sun, LogOut, Palette, Shield, Flag, MessageSquare, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { profileSchema, type ExperienceItem, type ProfileInput } from "@/lib/validators";
import { supabase } from "@/integrations/supabase/client";
import SkillsEditor from "@/components/profile/SkillsEditor";
import ExperienceEditor from "@/components/profile/ExperienceEditor";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const empty: ProfileInput = {
  displayName: "",
  username: "",
  bio: "",
  role: "",
  location: "",
  email: "",
  phone: "",
  website: "",
  lineId: "",
  facebook: "",
  instagram: "",
  notifyEmail: true,
  notifyHire: true,
  notifyJobMatch: true,
  preferredCategories: [],
  preferredEmploymentTypes: [],
  skills: [],
  experience: [],
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id);
  const updateMut = useUpdateProfile(user?.id);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const { data: isAdmin } = useIsAdmin();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("ออกจากระบบแล้ว");
    navigate("/");
  };

  const [form, setForm] = useState<ProfileInput>(empty);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?redirect=/settings");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.display_name ?? "",
        username: profile.username ?? "",
        bio: profile.bio ?? "",
        role: profile.role ?? "",
        location: profile.location ?? "",
        email: profile.email ?? user?.email ?? "",
        phone: profile.phone ?? "",
        website: profile.website ?? "",
        lineId: profile.line_id ?? "",
        facebook: profile.facebook ?? "",
        instagram: profile.instagram ?? "",
        notifyEmail: profile.notify_email ?? true,
        notifyHire: profile.notify_hire ?? true,
        notifyJobMatch: (profile as any).notify_job_match ?? true,
        preferredCategories: (profile as any).preferred_categories ?? [],
        preferredEmploymentTypes: (profile as any).preferred_employment_types ?? [],
        skills: profile.skills ?? [],
        experience: ((profile.experience as unknown as ExperienceItem[]) ?? []),
      });
    }
  }, [profile, user]);

  const update = <K extends keyof ProfileInput>(k: K, v: ProfileInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง");
      return;
    }
    try {
      await updateMut.mutateAsync(parsed.data);
      toast.success("บันทึกสำเร็จ", { description: "ข้อมูลโปรไฟล์ของคุณถูกอัปเดตแล้ว" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ");
    }
  };

  if (authLoading || isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">กำลังโหลด...</div>;
  }

  return (
    <div className="min-h-screen bg-app-ambient">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> กลับ
          </button>
          <span className="text-sm font-medium text-foreground">ตั้งค่าบัญชี</span>
          <span className="w-12" />
        </div>
      </div>

      <div className="bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-6">
          <h1 className="text-3xl md:text-4xl font-medium text-foreground">
            ตั้งค่า<span className="text-primary">โปรไฟล์</span>ของคุณ
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">ปรับแต่งข้อมูลที่จะแสดงบนหน้าผลงานและคำขอจ้างงาน</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="max-w-3xl mx-auto px-4 pb-24 space-y-6">
        <section className="rounded-2xl glass-panel p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-3xl font-medium text-primary-foreground">
                {(form.displayName || "?")[0]}
              </div>
              <button type="button" className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full glass-panel flex items-center justify-center hover:bg-secondary"
                onClick={() => toast.info("เร็วๆ นี้", { description: "อัปโหลดรูปกำลังพัฒนา" })}>
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{form.displayName || "ยังไม่ได้ตั้งชื่อ"}</p>
              <p className="text-sm text-muted-foreground">@{form.username || "username"}</p>
              <p className="text-xs text-primary mt-1">{form.role}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl glass-panel p-6 space-y-5">
          <SectionTitle icon={User} title="ข้อมูลส่วนตัว" />
          <Field label="ชื่อที่แสดง" value={form.displayName} onChange={(v) => update("displayName", v)} />
          <Field label="ชื่อผู้ใช้ (username)" value={form.username} onChange={(v) => update("username", v)} prefix="@" />
          <Field label="ตำแหน่ง / สาขา" value={form.role ?? ""} onChange={(v) => update("role", v)} icon={BriefcaseIcon} />
          <Field label="เมือง / ที่อยู่" value={form.location ?? ""} onChange={(v) => update("location", v)} icon={MapPin} placeholder="กรุงเทพฯ, ประเทศไทย" />
          <div>
            <label className="text-sm font-medium text-foreground">แนะนำตัว</label>
            <textarea
              value={form.bio ?? ""}
              onChange={(e) => update("bio", e.target.value)}
              rows={4}
              maxLength={500}
              className="mt-1 w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            <p className="mt-1 text-xs text-muted-foreground">{(form.bio ?? "").length}/500 ตัวอักษร</p>
          </div>
        </section>

        <section className="rounded-2xl glass-panel p-6 space-y-4">
          <SectionTitle icon={Sparkles} title="ความชำนาญ" />
          <SkillsEditor value={form.skills} onChange={(v) => update("skills", v)} />
        </section>

        <section className="rounded-2xl glass-panel p-6 space-y-4">
          <SectionTitle icon={BriefcaseIcon} title="ประสบการณ์ทำงาน" />
          <ExperienceEditor value={form.experience} onChange={(v) => update("experience", v)} />
        </section>

        <section className="rounded-2xl glass-panel p-6 space-y-5">
          <SectionTitle icon={Mail} title="ช่องทางติดต่อ" />
          <Field label="อีเมล" value={form.email} onChange={(v) => update("email", v)} type="email" icon={Mail} />
          <Field label="เบอร์มือถือ" value={form.phone ?? ""} onChange={(v) => update("phone", v)} placeholder="0812345678" />
          <Field label="เว็บไซต์ / Portfolio" value={form.website ?? ""} onChange={(v) => update("website", v)} icon={Link2} placeholder="https://..." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="LINE ID" value={form.lineId ?? ""} onChange={(v) => update("lineId", v)} icon={MessageCircle} />
            <Field label="Facebook" value={form.facebook ?? ""} onChange={(v) => update("facebook", v)} />
            <Field label="Instagram" value={form.instagram ?? ""} onChange={(v) => update("instagram", v)} prefix="@" />
          </div>
        </section>

        <section className="rounded-2xl glass-panel p-6 space-y-3">
          <SectionTitle icon={Bell} title="การแจ้งเตือน" />
          <Toggle label="แจ้งเตือนทางอีเมล" description="รับสรุปกิจกรรมในบัญชี" checked={form.notifyEmail} onChange={(v) => update("notifyEmail", v)} />
          <Toggle label="แจ้งเตือนเมื่อมีคำขอจ้างงาน" description="ส่งอีเมลทันทีที่มีคนสนใจจ้างงาน" checked={form.notifyHire} onChange={(v) => update("notifyHire", v)} />
          <Toggle
            label="แจ้งเตือนงานที่ตรงกับฉัน"
            description="ระบบจะคัดประกาศจากบอร์ดงานที่ตรงกับสกิล/หมวดของคุณมาแจ้งให้อัตโนมัติ"
            checked={form.notifyJobMatch}
            onChange={(v) => update("notifyJobMatch", v)}
          />
          {form.notifyJobMatch && (
            <div className="space-y-3 pt-1">
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">หมวดหมู่งานที่สนใจ (คั่นด้วย ,)</p>
                <input
                  type="text"
                  value={form.preferredCategories.join(", ")}
                  onChange={(e) =>
                    update(
                      "preferredCategories",
                      e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  placeholder="UI/UX, Branding, 3D"
                  className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">ประเภทการจ้างที่ต้องการ</p>
                <div className="flex flex-wrap gap-2">
                  {(["project", "fulltime", "parttime", "internship"] as const).map((t) => {
                    const active = form.preferredEmploymentTypes.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          update(
                            "preferredEmploymentTypes",
                            active
                              ? form.preferredEmploymentTypes.filter((x) => x !== t)
                              : [...form.preferredEmploymentTypes, t]
                          )
                        }
                        className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground hover:bg-accent"
                        }`}
                      >
                        {t === "project" ? "โปรเจกต์" : t === "fulltime" ? "Full-time" : t === "parttime" ? "Part-time" : "ฝึกงาน"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl glass-panel p-6 space-y-4">
          <SectionTitle icon={Palette} title="ลักษณะการแสดงผล" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">โหมดสี</p>
              <p className="text-xs text-muted-foreground">สลับระหว่างโหมดสว่างและมืด</p>
            </div>
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="inline-flex items-center gap-2 rounded-full bg-secondary hover:bg-accent px-4 py-2 text-sm font-medium text-foreground transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? "โหมดสว่าง" : "โหมดมืด"}
            </button>
          </div>
        </section>

        <section className="rounded-2xl glass-panel p-6 space-y-3">
          <SectionTitle icon={Flag} title="การติดตามของฉัน" />
          <p className="text-xs text-muted-foreground">ดูสถานะรายงานและฟีดแบ็กที่คุณส่งให้ทีมงาน</p>
          <div className="grid sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => navigate("/me/reports")}
              className="flex items-center justify-between gap-2 rounded-xl bg-secondary hover:bg-accent px-4 py-3 text-sm font-medium text-foreground transition-colors"
            >
              <span className="inline-flex items-center gap-2"><Flag className="w-4 h-4 text-primary" /> รายงานของฉัน</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/me/feedback")}
              className="flex items-center justify-between gap-2 rounded-xl bg-secondary hover:bg-accent px-4 py-3 text-sm font-medium text-foreground transition-colors"
            >
              <span className="inline-flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> ฟีดแบ็กของฉัน</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </section>

        {isAdmin && (
          <section className="rounded-2xl glass-panel p-6 space-y-3">
            <SectionTitle icon={Shield} title="ผู้ดูแลระบบ" />
            <p className="text-xs text-muted-foreground">เข้าถึงเครื่องมือมอนิเตอร์และจัดการทั้งระบบ</p>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background hover:bg-foreground/90 px-4 py-2 text-sm font-medium transition-colors"
            >
              <Shield className="w-4 h-4" /> เปิดหน้าแอดมิน
            </button>
          </section>
        )}

        <section className="rounded-2xl glass-panel p-6 space-y-4">
          <SectionTitle icon={LogOut} title="บัญชี" />
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive px-4 py-2 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" /> ออกจากระบบ
          </button>
        </section>


        <div className="sticky bottom-4 flex justify-end">
          <Button type="submit" size="lg" disabled={updateMut.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg px-8">
            <Save className="w-4 h-4 mr-1" /> {updateMut.isPending ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </Button>
        </div>
      </form>
    </div>
  );
};

const SectionTitle = ({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) => (
  <div className="flex items-center gap-2"><Icon className="w-5 h-5 text-primary" /><h2 className="font-semibold text-foreground">{title}</h2></div>
);

interface FieldProps {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; prefix?: string; placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
}
const Field = ({ label, value, onChange, type = "text", prefix, icon: Icon, placeholder }: FieldProps) => (
  <div>
    <label className="text-sm font-medium text-foreground">{label}</label>
    <div className="mt-1 flex items-center rounded-xl bg-secondary border border-border focus-within:ring-2 focus-within:ring-primary/30">
      {Icon && <Icon className="w-4 h-4 text-muted-foreground ml-3" />}
      {prefix && <span className="pl-3 text-muted-foreground text-sm">{prefix}</span>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
    </div>
  </div>
);

const Toggle = ({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between gap-4 py-2">
    <div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : ""}`} />
    </button>
  </div>
);

export default SettingsPage;
