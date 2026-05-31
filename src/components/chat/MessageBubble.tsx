import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { th } from "date-fns/locale";

interface Props {
  content: string;
  attachmentUrl?: string | null;
  createdAt: string;
  mine: boolean;
  kind: "hire" | "collab";
  readAt?: string | null;
}

const MessageBubble = ({ content, attachmentUrl, createdAt, mine, kind, readAt }: Props) => {
  const time = format(new Date(createdAt), "HH:mm");

  // Persona-based bubble color via tokens
  const mineBg =
    kind === "hire"
      ? "bg-[hsl(var(--chat-hire))] text-white"
      : "bg-gradient-to-br from-[hsl(var(--chat-collab))] to-[hsl(var(--chat-collab)/0.8)] text-white";
  const theirBg =
    kind === "hire"
      ? "bg-[hsl(var(--chat-hire-soft))] text-foreground"
      : "bg-card text-foreground border border-border";

  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[78%] md:max-w-[60%]")}>
        {attachmentUrl && (
          <img src={attachmentUrl} alt="" className="rounded-2xl mb-1 max-h-72 object-cover" />
        )}
        {content && (
          <div
            className={cn(
              "px-3.5 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm",
              mine ? `${mineBg} rounded-br-md` : `${theirBg} rounded-bl-md`,
            )}
          >
            {content}
          </div>
        )}
        <div className={cn("flex items-center gap-1 mt-1 text-[10px] text-muted-foreground", mine ? "justify-end" : "justify-start")}>
          <span>{time}</span>
          {mine && <span>{readAt ? "อ่านแล้ว" : "ส่งแล้ว"}</span>}
        </div>
      </div>
    </div>
  );
};

export const DateSeparator = ({ date }: { date: string }) => {
  const d = new Date(date);
  const label = isToday(d) ? "วันนี้" : isYesterday(d) ? "เมื่อวาน" : format(d, "d MMM yyyy", { locale: th });
  return (
    <div className="flex justify-center my-3">
      <span className="text-[10px] text-muted-foreground bg-muted px-3 py-1 rounded-full">{label}</span>
    </div>
  );
};

export default MessageBubble;
