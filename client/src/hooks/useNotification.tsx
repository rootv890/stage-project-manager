import { useContext } from "react";
import { NotificationContext } from "@/providers/notification-provider";

/**
 * 🎯 useNotification: Your friendly neighborhood notification hook!
 *
 *broadcast messages
 * across your app with style and pizzazz! ✨
 */
function useNotification() {
  // 🎭 Grab our notification context from the magical realm
  const notification = useContext(NotificationContext);
  console.log("DEBUG::", notification);
  // 🚨 Oops! Someone tried to use this hook outside its kingdom
  if (!notification) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }

  // 🎉 Here's your notification power pack!
  return notification;
}

// 🚀 Launch this hook into the world
export default useNotification;
