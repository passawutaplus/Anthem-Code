import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { CREATE_ACTIONS } from "@/data/createActions";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreateContentDrawer = ({ open, onOpenChange }: Props) => {
  const navigate = useNavigate();

  const pickCreate = (to: string) => {
    onOpenChange(false);
    navigate(to);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="pb-[env(safe-area-inset-bottom)]">
        <DrawerHeader className="text-left">
          <DrawerTitle>สร้างอะไรดี?</DrawerTitle>
        </DrawerHeader>
        <div className="grid gap-2 px-4 pb-6">
          {CREATE_ACTIONS.map(({ label, desc, icon: Icon, to }) => (
            <DrawerClose key={to} asChild>
              <button
                type="button"
                onClick={() => pickCreate(to)}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-left hover:bg-muted/60 transition-colors"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="block text-xs text-muted-foreground">{desc}</span>
                </span>
              </button>
            </DrawerClose>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateContentDrawer;
