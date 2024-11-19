import { cn } from "@/lib/utils";
import { NotificationType } from "@/providers/notification-provider";
import { CrossIcon } from "lucide-react";
import { useEffect, useState } from "react";

const NotificationStyle: NotificationStyleProps = {
  container: "fixed right-10 top-10 w-50  p-4 rounded-md",
  error: "bg-red-500 border border-red-300 text-white",
  success: "bg-green-500 border border-green-300 text-white",
  info: "bg-blue-500 border border-green-300 text-white",
};

export interface Notification {
  message: string;
  type: NotificationType;
  duration: number;
  id: number;
}

const Notification = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: NotificationType;
  onClose: () => void;
}) => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Set the ticktick for 2500ms them vanish it!
    const timer = setTimeout(() => {
      setOpacity(0);
    }, 2500);
    // Clear  the way for the next notification to get cleared
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      onClick={onClose}
      className={cn(
        NotificationStyle.container,
        NotificationStyle[type],
        `opacity-${opacity}`,
        "transition-opacity duration-500 relative !rounded-md"
      )}
    >
      {message}
      <div className="absolute top-2 right-2 group cursor-pointer">
        <CrossIcon className="text-2xl group-hover:opacity-75 " />
      </div>
    </div>
  );
};

export default Notification;
