import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface LegalLayoutProps {
  title: string;
  updatedAt?: string;
  children: ReactNode;
}

const LegalLayout = ({ title, updatedAt, children }: LegalLayoutProps) => (
  <div className="min-h-screen bg-background">
    <header className="border-b border-border/60 backdrop-blur-md bg-background/80 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link
          to="/"
          className="p-2 -ml-2 rounded-full hover:bg-accent transition-colors"
          aria-label="กลับ"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-base font-semibold">{title}</h1>
      </div>
    </header>
    <main className="max-w-3xl mx-auto px-4 py-8">
      {updatedAt && (
        <p className="text-xs text-muted-foreground mb-6">อัปเดตล่าสุด: {updatedAt}</p>
      )}
      <article className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-foreground/90 leading-relaxed [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:text-primary [&_a]:underline-offset-4 [&_a:hover]:underline">
        {children}
      </article>
    </main>
  </div>
);

export default LegalLayout;
