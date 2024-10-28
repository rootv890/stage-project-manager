import { Separator } from "./ui/separator";

const Divider = () => {
  return (
    <div className="flex items-center justify-center text-muted-foreground gap-6 w-full  overflow-hidden px-4">
      <Separator orientation="horizontal" />
      <span>or</span>
      <Separator orientation="horizontal" />
    </div>
  );
};

export default Divider;
