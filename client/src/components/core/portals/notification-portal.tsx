import { createPortal } from "react-dom";
import NofticationCenter from "./notification-center";
import { NotificationContextType } from "./notification-provider";

const NotificationPortal = ({
  notifications,
  removeNotification,
}: {
  notifications: NotificationContextType[];
  removeNotification: (id: string) => void;
}) => {
  const root = document.getElementById("notification-root");

  console.log("From NotificationPortal:", notifications);
  if (!root) return null;
  return createPortal(
    <NofticationCenter
      notifications={notifications}
      removeNotification={removeNotification}
    />,
    root
  );
};

export default NotificationPortal;
