import { useRef, useState } from "react";
import { Send, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  sharedStorage,
  SHARED_MEDIA_BUCKET,
} from "@/integrations/supabase/sharedStorageClient";
import { useSendMessage } from "@/hooks/useChat";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  conversationId: string;
  kind: "hire" | "collab";
  quickReplies?: string[];
}

const ChatComposer = ({ conversationId, kind, quickReplies = [] }: Props) => {
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const send = useSendMessage();

  const placeholder =
    kind === "hire"
      ? "พิมพ์ข้อความถึงลูกค้าอย่างสุภาพ…"
      : "คุยเล่นไอเดียกันต่อได้เลย…";

  const accentRing =
    kind === "hire" ? "focus-visible:ring-[hsl(var(--chat-hire))]" : "focus-visible:ring-[hsl(var(--chat-collab))]";
  const sendBtn =
    kind === "hire"
      ? "bg-[hsl(var(--chat-hire))] hover:bg-[hsl(var(--chat-hire)/0.9)] text-white"
      : "bg-gradient-to-br from-[hsl(var(--chat-collab))] to-[hsl(var(--chat-collab)/0.85)] hover:opacity-90 text-white";

  const submit = async (overrideText?: string) => {
    const value = (overrideText ?? text).trim();
    if (!value) return;
    try {
      await send.mutateAsync({ conversationId, content: value });
      if (!overrideText) setText("");
    } catch (e: any) {
      toast.error(e?.message ?? "ส่งไม่สำเร็จ");
    }
  };

  const onAttach = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "png";
      const path = `anthem/chat/${conversationId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await sharedStorage.storage
        .from(SHARED_MEDIA_BUCKET)
        .upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { data } = sharedStorage.storage
        .from(SHARED_MEDIA_BUCKET)
        .getPublicUrl(path);
      await send.mutateAsync({ conversationId, content: "", attachmentUrl: data.publicUrl });
    } catch (e: any) {
      toast.error(e?.message ?? "อัปโหลดไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-md px-3 py-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
      {quickReplies.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {quickReplies.map((q) => (
            <button
              key={q}
              onClick={() => submit(q)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-accent text-foreground transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onAttach(f);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full shrink-0"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          aria-label="แนบรูป"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
        </Button>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder={placeholder}
          className={cn(
            "resize-none min-h-[40px] max-h-32 rounded-2xl bg-muted border-0 focus-visible:ring-2",
            accentRing,
          )}
        />
        <Button
          type="button"
          size="icon"
          onClick={() => submit()}
          disabled={!text.trim() || send.isPending}
          className={cn("rounded-full shrink-0", sendBtn)}
          aria-label="ส่งข้อความ"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatComposer;
