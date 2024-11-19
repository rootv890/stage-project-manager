import Notification from "@/components/core/notification";
import { createContext, ReactNode, useCallback, useState } from "react";

// 🎭 Types that keep our notifications from going rogue
export type NotificationType = "error" | "success" | "info";

interface Notification {
  message: string;
  type: NotificationType;
  duration: number;
  id: number;
}

// 🎮 The control center for our notification system
interface NotificationContextType {
  addNotification: (
    message: string,
    type?: NotificationType,
    duration?: number
  ) => void;
}

// 🌟 Creating our magical notification realm
// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext =
  createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  // 📦 Where all our notification babies live
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 🚀 The grand notification launcher
  const addNotification = useCallback(
    (
      message: string,
      type: NotificationType = "info",
      duration = 3000
    ): void => {
      // 🎯 Give each notification a unique ID (like a social security number, but cooler)
      const id = Date.now();
      const newNotification: Notification = { message, type, duration, id };

      // 🎪 Add the new notification to our arena
      setNotifications((prev) => [...prev, newNotification]);

      // ⏰ Set up the self-destruct sequence
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        // Remove a message for every `${duration}` seconds
      }, duration);
    },
    []
  );

  // 🎪 The grand performance stage
  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <Notification
        notifications={notifications}
        onClose={() => {
          //
        }}
      />
    </NotificationContext.Provider>
  );
};
