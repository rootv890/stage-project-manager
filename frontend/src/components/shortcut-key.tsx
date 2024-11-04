type Props = {
  shorcutKey: string;
  onClick?: () => void;
};

const ShortcutKey = ({ shorcutKey, onClick }: Props) => {
  return (
    <div
      className="inline-block bg-zinc-300 p-1 aspect-square font-geist-mono rounded-[.1em] leading-none text-[14px] "
      onClick={onClick}
    >
      {shorcutKey}
    </div>
  );
};

export default ShortcutKey;
