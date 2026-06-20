import { useNavigate } from "react-router-dom";
import { Bell, Gift, UserPlus, Briefcase, Handshake, MessageCircle, Banknote, Megaphone } from "lucide-react";
import type { Notification } from "@/core/notifications";
import { resolveNotificationLink } from "@/lib/notificationLinks";

const kindIcon = (kind: string) => {
  if (kind.includes("gift")) return Gift;
  if (kind.includes("follow")) return UserPlus;
  if (kind.includes("hire")) return Briefcase;
  if (kind.includes("collab")) return Handshake;
  if (kind.includes("message")) return MessageCircle;
  if (kind.includes("cashout")) return Banknote;
  if (kind.includes("ad")) return Megaphone;
  return Bell;
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "เมื่อสักครู่";
  if (m < 60) return `${m} นาทีที่แล้ว`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ชม.ที่แล้ว`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} วันที่แล้ว`;
  return new Date(iso).toLocaleDateString("th-TH");
};

interface Props {
  items: Notification[];
  loading: boolean;
  onOpen: (n: Notification) => void;
  onDismiss: (id: string) => void;
  onBeforeNavigate?: () => void;
}

const InboxList = ({ items, loading, onOpen, onDismiss, onBeforeNavigate }: Props) => {
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground text-sm">กำลังโหลด...</div>;
  }
  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
        <p className="text-sm">ยังไม่มีการแจ้งเตือนในกล่องข้อความ</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((n) => {
        const Icon = kindIcon(n.kind);
        return (
          <div
            key={n.id}
            className={`flex items-start gap-3 p-3 rounded-2xl border transition-colors ${
              n.is_read ? "border-transparent hover:bg-secondary/40" : "border-primary/20 bg-primary/5"
            }`}
          >
            <button
              type="button"
              onClick={() => {
                onOpen(n);
                onBeforeNavigate?.();
                navigate(resolveNotificationLink(n.link));
              }}
              className="flex-1 flex items-start gap-3 text-left min-w-0"
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.body}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{timeAgo(n.created_at)}</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onDismiss(n.id)}
              className="text-[10px] text-muted-foreground hover:text-foreground px-2 py-1 shrink-0"
              title="ซ่อน"
            >
              ซ่อน
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default InboxList;
