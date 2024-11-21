import { createContext, useCallback, useContext, useState } from "react";
import NotificationPortal from "./notification-portal";

export type NotificationContextType = {
  message: string;
  type: "success" | "error" | "info";
  show: boolean; // after 3 seconds, show will be set to false
  id?: string; // for removing a specific notification
};

export const NotificationContext = createContext<{
  notifications: NotificationContextType[];
  addNotification: (notification: NotificationContextType) => void;
} | null>(null);

// Provider

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationContextType[]>(
    []
  );
  console.log("NotificationProvider -> notifications", notifications);

  const addNotification = useCallback(
    (notification: NotificationContextType) => {
      const id = Date.now().toString();
      // Add Notification
      setNotifications([{ ...notification, id }, ...notifications]);
    },
    [notifications]
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((currentNotifications: NotificationContextType[]) =>
      currentNotifications.filter((n) => n.id !== id)
    );
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
      }}
    >
      {children}
      {/* Notification Portal */}
      <NotificationPortal
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

export function useNotification() {
  return useContext(NotificationContext);
}

export default NotificationProvider;

/*
    eslint
    react-refresh/only-export-components: off

*/
