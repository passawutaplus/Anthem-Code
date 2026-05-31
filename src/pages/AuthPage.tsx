import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Mail, User as UserIcon, Eye, EyeOff, Loader2,
  Sparkles, Info, Heart, Bookmark, Share2,
} from "lucide-react";

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.12s.13-1.46.35-2.12V7.04H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.96l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
  </svg>
);

const PasswordInput = ({ id, value, onChange, placeholder, autoComplete, minLength, required, invalid }: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  required?: boolean;
  invalid?: boolean;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        required={required}
        className={cn(
          "h-11 rounded-xl pr-10 bg-background/60 backdrop-blur border-border/60 focus-visible:ring-primary/40",
          invalid && "border-destructive focus-visible:ring-destructive/30"
        )}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
};

const Separator = () => (
  <div className="relative my-1">
    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/60" /></div>
    <div className="relative flex justify-center text-[11px]">
      <span className="bg-background px-3 text-muted-foreground">หรือเข้าด้วยอีเมล</span>
    </div>
  </div>
);

const AuthPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const rawRedirect = params.get("redirect");
  const redirect = /^\/(?![/\\])/.test(rawRedirect ?? "") ? (rawRedirect as string) : "/";

  const { user } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (user) {
      setFadeOut(true);
      setTimeout(() => navigate(redirect, { replace: true }), 250);
    }
  }, [user, navigate, redirect]);

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + redirect,
    });
    if (result.error) toast.error(result.error.message || "เข้าสู่ระบบด้วย Google ไม่สำเร็จ");
  };

  return (
    <div className={cn(
      "relative min-h-screen overflow-hidden bg-background transition-opacity duration-300",
      fadeOut && "opacity-0"
    )}>
      {/* Ambient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-30 bg-gradient-brand" />
        <div className="absolute top-1/3 -right-24 w-[380px] h-[380px] rounded-full blur-3xl opacity-25 bg-gradient-brand" />
        <div className="absolute bottom-0 left-1/3 w-[320px] h-[320px] rounded-full blur-3xl opacity-20 bg-gradient-brand" />
      </div>

      <Link
        to="/"
        className="absolute top-4 left-4 z-30 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-background/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/40"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> กลับหน้าแรก
      </Link>

      <div className="relative min-h-screen grid lg:grid-cols-2">
        {/* LEFT: Brand banner */}
        <div className="hidden lg:flex relative p-8 xl:p-10">
          <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-brand p-10 flex flex-col justify-between text-white shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.25),transparent_40%),radial-gradient(circle_at_80%_90%,rgba(255,255,255,0.18),transparent_50%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" /> an1hem · พื้นที่ของฟรีแลนซ์
              </div>
              <h2 className="mt-8 text-4xl xl:text-5xl font-semibold thai-display">
                โชว์ผลงาน<br />หาคนร่วมงาน<br />รับงานจ้าง — ที่เดียวจบ
              </h2>
              <p className="mt-4 text-white/85 text-sm xl:text-base thai-body max-w-md">
                สร้างพอร์ตโฟลิโอสวยๆ ฟรี เชื่อมต่อกับครีเอเตอร์คนอื่นๆ
                และเปิดรับโอกาสจากลูกค้าจริงในชุมชนเดียวกัน
              </p>
            </div>

            <div className="relative grid grid-cols-3 gap-3 mt-10">
              {[
                { icon: Heart, label: "ไลก์ผลงาน" },
                { icon: Bookmark, label: "บันทึกไอเดีย" },
                { icon: Share2, label: "แชร์โปรเจกต์" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-2xl bg-white/12 backdrop-blur border border-white/15 p-3.5">
                  <Icon className="w-4 h-4 mb-2" />
                  <p className="text-xs font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Form */}
        <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center mb-6 lg:hidden">
              <div className="h-12 w-12 rounded-2xl bg-gradient-brand shadow-lg" />
              <span className="mt-3 font-medium tracking-tight text-lg">
                an<span className="text-gradient">1</span>hem
              </span>
            </div>
            <div className="hidden lg:flex items-center gap-2 mb-8">
              <div className="h-10 w-10 rounded-xl bg-gradient-brand shadow-md" />
              <span className="font-medium tracking-tight text-lg">
                an<span className="text-gradient">1</span>hem
              </span>
            </div>

            <h1 className="text-2xl font-medium tracking-tight mb-1.5 thai-display">
              {tab === "login" ? "ยินดีต้อนรับกลับมา 👋" : "สร้างบัญชีใหม่"}
            </h1>
            <p className="text-sm text-muted-foreground mb-6 thai-body">
              {tab === "login"
                ? "เข้าสู่ระบบเพื่อจัดการพอร์ตโฟลิโอของคุณ"
                : "เริ่มต้นใช้งานฟรี — ใช้เวลาไม่ถึง 1 นาที"}
            </p>

            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-5 rounded-xl bg-muted/60 p-1 h-11">
                <TabsTrigger value="login" className="rounded-lg">เข้าสู่ระบบ</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-lg">สมัครสมาชิก</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogle}
                  className="w-full h-11 gap-2 rounded-xl bg-background/60 backdrop-blur"
                >
                  <GoogleIcon /> เข้าสู่ระบบด้วย Google
                </Button>
                <Separator />
                <LoginForm redirect={redirect} onSwitch={() => setTab("signup")} />
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogle}
                  className="w-full h-11 gap-2 rounded-xl bg-background/60 backdrop-blur"
                >
                  <GoogleIcon /> สมัครด้วย Google
                </Button>
                <Separator />
                <SignupForm onSwitch={() => setTab("login")} />
              </TabsContent>
            </Tabs>

            <p className="mt-8 text-center text-[11px] text-muted-foreground">
              ดำเนินการต่อเท่ากับยอมรับ{" "}
              <Link to="/legal/terms" className="hover:text-foreground underline underline-offset-2">ข้อกำหนด</Link>
              {" "}และ{" "}
              <Link to="/legal/privacy" className="hover:text-foreground underline underline-offset-2">นโยบายความเป็นส่วนตัว</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginForm = ({ redirect, onSwitch }: { redirect: string; onSwitch: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setErr(error.message.toLowerCase().includes("invalid")
          ? "อ๊ะ! อีเมลหรือรหัสผ่านไม่ถูกต้อง"
          : error.message);
      } else {
        if (!remember) sessionStorage.setItem("an1hem_no_persist", "1");
        toast.success("เข้าสู่ระบบสำเร็จ");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="login-email" className="text-xs">อีเมล</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9 h-11 rounded-xl bg-background/60 backdrop-blur border-border/60 focus-visible:ring-primary/40"
            required
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="login-pass" className="text-xs">รหัสผ่าน</Label>
        <PasswordInput
          id="login-pass"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          invalid={!!err}
          required
        />
      </div>

      {err && <p className="text-xs text-destructive">{err}</p>}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
          <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
          จดจำฉันไว้
        </label>
      </div>

      <Button
        type="submit"
        disabled={busy}
        className="w-full h-11 rounded-xl text-base font-semibold bg-gradient-brand text-white hover:opacity-95 border-0 shadow-md shadow-primary/20"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        เข้าสู่ระบบ
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        ยังไม่มีบัญชี?{" "}
        <button type="button" onClick={onSwitch} className="text-primary hover:underline font-medium">
          สมัครสมาชิกที่นี่
        </button>
      </p>
    </form>
  );
};

const SignupForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accept, setAccept] = useState(false);
  const [busy, setBusy] = useState(false);
  const [touched, setTouched] = useState(false);

  const emailValid = !email || /^\S+@\S+\.\S+$/.test(email.trim());
  const passValid = password.length >= 8;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!emailValid) { toast.error("กรุณากรอกอีเมลให้ถูกต้อง"); return; }
    if (!passValid) { toast.error("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"); return; }
    if (!accept) { toast.error("กรุณายอมรับข้อกำหนดก่อนสมัคร"); return; }

    setBusy(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: window.location.origin + "/",
          data: { display_name: displayName || email.split("@")[0] },
        },
      });
      if (error) toast.error(error.message);
      else toast.success("สมัครสำเร็จ! กรุณาตรวจอีเมลเพื่อยืนยันบัญชีก่อนเข้าใช้งาน");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="su-name" className="text-xs">ชื่อที่แสดง</Label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="su-name"
            placeholder="ภัสวุฒิ"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="pl-9 h-11 rounded-xl bg-background/60 backdrop-blur border-border/60 focus-visible:ring-primary/40"
            maxLength={80}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="su-email" className="text-xs">อีเมล</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="su-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            className={cn(
              "pl-9 h-11 rounded-xl bg-background/60 backdrop-blur border-border/60 focus-visible:ring-primary/40",
              touched && email && !emailValid && "border-destructive"
            )}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="su-pass" className="text-xs">รหัสผ่าน (อย่างน้อย 8 ตัว)</Label>
        <PasswordInput
          id="su-pass"
          autoComplete="new-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          invalid={touched && !!password && !passValid}
          required
        />
      </div>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2.5 space-y-2">
        <div className="flex gap-2">
          <Info className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">โปรดทราบ:</span> เราจะส่งอีเมลยืนยันให้คุณก่อนเข้าใช้งาน
          </p>
        </div>
        <label className="flex gap-2 items-start cursor-pointer select-none">
          <Checkbox
            checked={accept}
            onCheckedChange={(v) => setAccept(v === true)}
            className="mt-0.5"
          />
          <span className="text-[11px] leading-relaxed text-foreground">
            ฉันยอมรับ{" "}
            <Link to="/legal/terms" target="_blank" className="text-primary hover:underline font-medium">ข้อกำหนดการใช้งาน</Link>
            {" "}และ{" "}
            <Link to="/legal/privacy" target="_blank" className="text-primary hover:underline font-medium">นโยบายความเป็นส่วนตัว (PDPA)</Link>
            {" "}และรับทราบ{" "}
            <Link to="/legal/cookies" target="_blank" className="text-primary hover:underline font-medium">นโยบายคุกกี้</Link>
          </span>
        </label>
      </div>

      <Button
        type="submit"
        disabled={busy || !accept}
        className="w-full h-11 rounded-xl text-base font-semibold bg-gradient-brand text-white hover:opacity-95 border-0 shadow-md shadow-primary/20"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        สมัครสมาชิก
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        มีบัญชีอยู่แล้ว?{" "}
        <button type="button" onClick={onSwitch} className="text-primary hover:underline font-medium">
          เข้าสู่ระบบ
        </button>
      </p>
    </form>
  );
};

export default AuthPage;
