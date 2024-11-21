import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Notification from "./notification-component";

const NotificationCenter = ({
  notifications,
  removeNotification,
}: {
  notifications: {
    id: string;
    type: "info" | "error" | "success";
    message: string;
  }[];
  removeNotification: (id: string) => void;
}) => {
  // Store refs for each notification
  const notificationRefs = useRef<
    Record<string, React.RefObject<HTMLDivElement>>
  >({});

  // Initialize refs for each notification
  notifications.forEach((n) => {
    if (!notificationRefs.current[n.id]) {
      notificationRefs.current[n.id] = React.createRef<HTMLDivElement>();
    }
  });

  // Animate entry for new notifications
  useEffect(() => {
    notifications.forEach((notification) => {
      const ref = notificationRefs.current[notification.id]?.current;
      if (ref) {
        gsap.fromTo(
          ref,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
        );
      }
    });
  }, [notifications]);

  // Animate exit for a notification when removed
  const handleRemove = (id: string) => {
    const ref = notificationRefs.current[id]?.current;
    if (ref) {
      gsap.to(ref, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => removeNotification(id), // Call remove after animation
      });
    }
  };

  return (
    <div className="fixed top-3 right-3 w-[312px] pointer-events-none z-[1000] flex flex-col gap-3">
      {notifications.map((notification) => (
        <Notification
          key={notification.id} // Key ensures React stability
          id={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => handleRemove(notification.id)} // Handle close with animation
        />
      ))}
    </div>
  );
};

export default NotificationCenter;
