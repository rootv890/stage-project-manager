import { createPortal } from "react-dom";
import Notification, { Notification } from "./components/core/notification";

const portalRoot = document.getElementById("notification-root") as HTMLElement;

const NotificationPortal = ({ notifications }: Notification[]) => {
  if (!notifications.length) return null;
  return createPortal(
    <div className="fixed top-[10px] right-[10px] origin-right z-[1000]">
      {notifications.map(
        (notification: { id: number; message: string; type: string }) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => {
              notifications.filter((n) => n.id !== notification.id);
            }}
          />
        )
      )}
    </div>,
    portalRoot,
    "notification-portal"
  );
};

export default NotificationPortal;
