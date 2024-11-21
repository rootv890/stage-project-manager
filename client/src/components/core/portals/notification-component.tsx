import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils"; // Utility for handling class names
import gsap from "gsap";

// 🎨 Styles for different notification types
const notificationStyle = {
  info: "bg-white rounded-md w-full p-4 shadow-md flex justify-between items-center text-gray-900",
  error: "bg-red-100 text-red-900",
  success: "bg-green-100 text-green-900",
};

function Notification({
  message, // 📝 The text displayed in the notification
  type = "info", // 🎭 Type of notification: info, error, or success
  onClose, // ❌ Function to remove the notification
  id, // 🔑 Unique ID for this notification
}: {
  message: string;
  type: "info" | "error" | "success";
  onClose: (id: string) => void;
  id: string;
}) {
  // 🪄 Reference to the notification DOM element
  const notificationRef = useRef<HTMLDivElement>(null);

  // 🔄 Entry Animation
  useEffect(() => {
    if (notificationRef.current) {
      gsap.fromTo(
        notificationRef.current, // 🎯 Target element
        { opacity: 0, y: -30 }, // 🔽 Start: Invisible, slightly above
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" } // ⬆️ End: Fully visible, at position
      );
    }
  }, []); // Empty dependency array ensures it runs only on mount

  // ⏳ Auto-Close with Exit Animation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (notificationRef.current) {
        gsap.to(notificationRef.current, {
          opacity: 0, // Fade out
          y: -30, // Slide up
          duration: 0.5,
          ease: "power3.in",
          onComplete: () => onClose(id), // 🧹 Call `onClose` after animation ends
        });
      }
    }, 3000); // ⏲️ Auto-close after 3 seconds

    return () => clearTimeout(timer); // 🛑 Clear the timer when unmounting
  }, [onClose, id]);

  // 🖱️ Manual Close (Button click with animation)
  const handleManualClose = () => {
    if (notificationRef.current) {
      gsap.to(notificationRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => onClose(id), // Call `onClose` after animation ends
      });
    }
  };

  return (
    <div
      ref={notificationRef} // Attach animations to this element
      className={cn(
        "bg-white rounded-md w-full p-4 shadow-md flex justify-between items-center pointer-events-none",
        notificationStyle[type] // Apply type-specific styles
      )}
    >
      <p>{message}</p> {/* 📜 Display the notification message */}
      <button onClick={handleManualClose}>X</button> {/* ❌ Close button */}
    </div>
  );
}

export default Notification;
