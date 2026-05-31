import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cookie-consent";

const CookieConsent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : "x";
    if (!v) setOpen(true);
  }, []);

  const decide = (value: "accepted" | "essential") => {
    localStorage.setItem(STORAGE_KEY, value);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4 pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto rounded-2xl border border-border/60 bg-background/85 backdrop-blur-xl shadow-2xl p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="shrink-0 flex items-center justify-center text-primary">
            <Cookie className="w-5 h-5" strokeWidth={2.25} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์ของคุณ</p>
            <p className="text-xs text-muted-foreground mt-1">
              เรียนรู้เพิ่มเติมที่{" "}
              <Link to="/legal/cookies" className="text-primary hover:underline">นโยบายคุกกี้</Link>{" "}และ{" "}
              <Link to="/legal/privacy" className="text-primary hover:underline">PDPA</Link>
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Button size="sm" onClick={() => decide("accepted")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                ยอมรับทั้งหมด
              </Button>
              <Button size="sm" variant="outline" onClick={() => decide("essential")}>
                จำเป็นเท่านั้น
              </Button>
            </div>
          </div>
          <button
            aria-label="ปิด"
            onClick={() => decide("essential")}
            className="p-1.5 rounded-full hover:bg-accent text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
