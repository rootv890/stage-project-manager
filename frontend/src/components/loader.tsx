import { RiLoader3Fill } from "react-icons/ri";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <RiLoader3Fill className="animate-spin text-2xl" />
      Loading
    </div>
  );
};

export default Loader;
