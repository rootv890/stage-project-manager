import { getGreetMessage } from "@/lib/utils";

interface GreeterProps {
  user: string;
}

const Greet = ({ user }: GreeterProps) => {
  return (
    <div className="w-full  pt-6  select-none">
      <p className="text-xl">{getGreetMessage(user)}</p>
      <div className="border-b mt-2"></div>
    </div>
  );
};

export default Greet;
