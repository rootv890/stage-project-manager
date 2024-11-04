import ShortcutKey from "../shortcut-key";
import { Button } from "../ui/button";

type Props = {};

function AddCourseButton({}: Props) {
  const handleShortcutClick = () => {};
  return (
    <Button className=" text-xl leading-none p-6 group border border-zinc-300 border-b-4 active:border-b-0 active:translate-y-0.5 transition-all duration-500 ease-in-out  hover:scale-95 bg-origin-content rounded-sm   ">
      Add Course
      <ShortcutKey shorcutKey="N" onClick={handleShortcutClick} />
    </Button>
  );
}

export default AddCourseButton;
