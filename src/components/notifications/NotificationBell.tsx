import { useState } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/core/notifications";
import NotificationsDialog from "@/components/notifications/NotificationsDialog";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { unreadCount } = useNotifications(user?.id);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`แจ้งเตือน${unreadCount > 0 ? ` (${unreadCount} รายการใหม่)` : ""}`}
        title="แจ้งเตือน"
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-semibold flex items-center justify-center leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      <NotificationsDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

export default NotificationBell;
